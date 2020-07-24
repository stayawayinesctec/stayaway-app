/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import BackgroundTasks
import Foundation

class AppVersionManager {
  static let shared = AppVersionManager()

  private let queue = DispatchQueue(label: "org.dpppt.appversionmanager")

  private let operationQueue: OperationQueue = {
    let queue = OperationQueue()
    queue.maxConcurrentOperationCount = 1
    return queue
  }()

  @KeychainPersisted(key: "nextScheduledVersionFetch", defaultValue: nil)
  private var nextScheduledVersionFetch: Date?

  var nextScheduledFakeRequestDate: Date? {
    queue.sync {
      self.nextScheduledVersionFetch
    }
  }

  var now: Date {
    .init()
  }

  func updateVersionFetchdata() {
    queue.sync {
      nextScheduledVersionFetch = now
    }
  }

  @discardableResult
  func runTask(completionBlock: (() -> Void)? = nil) -> Operation {
    let operation = AppVersionFetchOperation(manager: self)
    operation.completionBlock = completionBlock
    operationQueue.addOperation(operation)
    return operation
  }
}

private class AppVersionFetchOperation: Operation {
  weak var manager: AppVersionManager!

  init(manager: AppVersionManager) {
    self.manager = manager
    super.init()
  }

  override func main() {
    guard isCancelled == false else { return }

    if manager.nextScheduledFakeRequestDate == nil {
      manager.updateVersionFetchdata()
    }

    guard let lastDate = manager.nextScheduledFakeRequestDate,
      Date() >= lastDate.addingTimeInterval(60*60*24) else {
        //waiting for 24h to pass
        NSLog("Too early for new app version request.")
        return
    }

    let group = DispatchGroup()
    group.enter()

    DispatchQueue.global(qos: .background).asyncAfter(deadline: .now()) {
      struct Response: Codable { // or Decodable
        let versions: Dictionary<String, Dictionary<String,String>>
        let message: String
      }

      let group2 = DispatchGroup()
      group2.enter()


      let config = ReactNativeConfig.env();
      let envConfigUrl:String = config!["BACKEND_CONFIG_URL"] as! String;
      NSLog(envConfigUrl)

      var res: Response?
      if let url = URL(string: envConfigUrl) {
        URLSession.certificatePinned.dataTask(with: url) { data, response, error in
          if let data = data {
            do {
              res = try JSONDecoder().decode(Response.self, from: data)
              //NSLog(res!.version)
            } catch let error {
              NSLog("ERROR AppVersion " + error.localizedDescription)
            }
          }
          group2.leave()
        }.resume()
      }
      else{
        group2.leave()
      }

      group2.wait()

      guard res != nil else {
        return
      }

      let currentVersion = UIApplication.version
      let version = res!.versions["ios"]?["name"] ?? "0"
      let buildno = res!.versions["ios"]?["build"] ?? "0"
      let newVersion = version + "." + buildno
      NSLog("Start App Version Fetch. Current: "+currentVersion+" New: "+newVersion)
      if(currentVersion.compare(newVersion) != .orderedSame){
        //Send local notification
        let title = "app_version_notification_title".ub_localized
        let body = "app_version_notification_body".ub_localized
        TracingLocalPush.shared.scheduleCustomNotification(title: title, body: body, completionHandler: {error in
          self.manager.updateVersionFetchdata()
          group.leave()
        })
      }
      else{
        group.leave()
      }
    }
    group.wait()
  }
}

extension UIApplication {
  static var release: String {
    return Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as! String? ?? "x.x"
  }
  static var build: String {
    return Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as! String? ?? "x"
  }
  static var version: String {
    return "\(release).\(build)"
  }
}
