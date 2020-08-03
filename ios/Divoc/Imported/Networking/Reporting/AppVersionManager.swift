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
  
  func checkAppVersion(version: String, buildno: String) {
  
    let currentVersion = UIApplication.version
    let newVersion = version + "." + buildno
    if(currentVersion.compare(newVersion) != .orderedSame){
      //Send local notification
      let title = "app_version_notification_title".ub_localized
      let body = "app_version_notification_body".ub_localized
      TracingLocalPush.shared.scheduleCustomNotification(title: title, body: body, completionHandler: nil)
    }
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
