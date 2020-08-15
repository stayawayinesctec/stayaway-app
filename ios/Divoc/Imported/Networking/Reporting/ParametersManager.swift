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
import DP3TSDK

class ParametersManager {
  static let shared = ParametersManager()

  private let queue = DispatchQueue(label: "fct.inesctec.stayaway.parametersmanager")

  private let operationQueue: OperationQueue = {
    let queue = OperationQueue()
    queue.maxConcurrentOperationCount = 1
    return queue
  }()

  @KeychainPersisted(key: "nextScheduledParametersFetch", defaultValue: nil)
  private var nextScheduledParametersFetch: Date?

  var nextScheduledFakeRequestDate: Date? {
    queue.sync {
      self.nextScheduledParametersFetch
    }
  }

  var now: Date {
    .init()
  }

  func updateParametersFetchData() {
    queue.sync {
      nextScheduledParametersFetch = now
    }
  }

  @discardableResult
  func runTask(completionBlock: (() -> Void)? = nil) -> Operation {
    let operation = ParametersFetchOperation(manager: self)
    operation.completionBlock = completionBlock
    operationQueue.addOperation(operation)
    return operation
  }
}

private class ParametersFetchOperation: Operation {
  weak var manager: ParametersManager!

  init(manager: ParametersManager) {
    self.manager = manager
    super.init()
  }

  override func main() {
    guard isCancelled == false else { return }

    if manager.nextScheduledFakeRequestDate == nil {
      manager.updateParametersFetchData()
    } else {
     guard let lastDate = manager.nextScheduledFakeRequestDate,
       Date() >= lastDate.addingTimeInterval(60*60*24) else {
         //waiting for 24h to pass
         NSLog("Too early for new parameters check.")
         return
     }
    }

    DispatchQueue.global(qos: .background).asyncAfter(deadline: .now()) {
      let group2 = DispatchGroup()
      group2.enter()

      let config = ReactNativeConfig.env();
      let configUrl:String = (config!["BACKEND_CONFIG_URL"] as! String) + "config/defaults.json";
      NSLog("BACKEND_CONFIG_URL " + configUrl)

      var res: Any?
      if let url = URL(string: configUrl) {
        URLSession.certificatePinned.dataTask(with: url) { data, response, error in
          if let data = data {
            res = try? JSONSerialization.jsonObject(with: data, options: [])
          }
          group2.leave()
        }.resume()
      } else{
        group2.leave()
      }

      group2.wait()

      guard res != nil else {
        return
      }


      var dp3tParameters = DP3TTracing.parameters


      if let dictionary = res as? [String: Any] {
        if let parameters = dictionary["parameters"] as? Dictionary<String, Any> {
          let lowerThreshold = parameters["lowerThreshold"] as? Int ?? 53
          let higherThreshold = parameters["higherThreshold"] as? Int ?? 60
          let factorLow = parameters["factorLow"] as? Double ?? 1.0
          let factorHigh = parameters["factorHigh"] as? Double ?? 0.5
          let triggerThreshold = parameters["triggerThreshold"] as? Int ?? 15

          dp3tParameters.contactMatching.factorHigh = factorHigh
          dp3tParameters.contactMatching.factorLow = factorLow
          dp3tParameters.contactMatching.lowerThreshold = lowerThreshold
          dp3tParameters.contactMatching.higherThreshold = higherThreshold
          dp3tParameters.contactMatching.triggerThreshold = triggerThreshold

          DP3TTracing.parameters = dp3tParameters
        }
        if let appversion = dictionary["versions"] as? Dictionary<String,Dictionary<String,String>> {
          let iosversion = appversion["ios"] ?? [:]
          let version = iosversion["name"] ?? "0"
          let build = iosversion["build"] ?? "0"
          AppVersionManager.shared.checkAppVersion(version: version,buildno: build)
        }
        self.manager.updateParametersFetchData()
      }
    }
  }
}
