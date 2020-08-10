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
    if (shouldBroadcastNotification(lastVersion: version, lastBuild: buildno)){
      //Send local notification
      let title = "app_version_notification_title".ub_localized
      let body = "app_version_notification_body".ub_localized
      TracingLocalPush.shared.scheduleCustomNotification(title: title, body: body, completionHandler: nil)
    }
  }

  func shouldBroadcastNotification(lastVersion: String, lastBuild: String) -> Bool {
    let currentVersion = Bundle.appVersion
    let currentBuild = Bundle.buildNumber
    
    if (lastVersion.isVersion(greaterThan: currentVersion)) {
      return true;
    }

    if (lastVersion.isVersion(equalTo: currentVersion)) {
      return Int(lastBuild) ?? 0 > Int(currentBuild) ?? 0;
    }

    return false;
  }
}
