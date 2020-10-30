/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

/**
 * Copyright (c) 2020 Ubique Innovation AG <https://www.ubique.ch>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * SPDX-License-Identifier: MPL-2.0
 */

import DP3TSDK
import Foundation
import UserNotifications

protocol UserNotificationCenter {
  var delegate: UNUserNotificationCenterDelegate? { get set }
  func add(_ request: UNNotificationRequest, withCompletionHandler completionHandler: ((Error?) -> Void)?)
  func removeAllDeliveredNotifications()
  func removePendingNotificationRequests(withIdentifiers identifiers: [String])
}

extension UNUserNotificationCenter: UserNotificationCenter {}

protocol ExposureIdentifierProvider {
  var exposureIdentifiers: [String]? { get }
}

extension TracingState: ExposureIdentifierProvider {
  var exposureIdentifiers: [String]? {
    switch infectionStatus {
    case let .exposed(matches):
      return matches.map { $0.identifier.uuidString }
    case .healthy:
      return []
    case .infected:
      return nil
    }
  }
}

/// Helper to show a local push notification when the state of the user changes from not-exposed to exposed
class TracingLocalPush: NSObject {
  static let shared = TracingLocalPush()

  private var center: UserNotificationCenter

  init(notificationCenter: UserNotificationCenter = UNUserNotificationCenter.current(), keychain: KeychainProtocol = Keychain()) {
    center = notificationCenter
    _exposureIdentifiers.keychain = keychain
    super.init()
    center.delegate = self
  }

  func update(provider: ExposureIdentifierProvider) {
    if let identifers = provider.exposureIdentifiers {
      exposureIdentifiers = identifers
    }
  }

  func clearNotifications() {
    center.removeAllDeliveredNotifications()
  }

  @KeychainPersisted(key: "exposureIdentifiers", defaultValue: [])
  private var exposureIdentifiers: [String] {
    didSet {
      for identifier in exposureIdentifiers {
        if !oldValue.contains(identifier) {
          scheduleNotification(identifier: identifier)
          return
        }
      }
    }
  }

  private func scheduleNotification(identifier: String) {
    let content = UNMutableNotificationContent()
    content.title = "exposed_notification_title".ub_localized;
    content.body = "exposed_notification_body".ub_localized;

    let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
    center.add(request, withCompletionHandler: nil)
  }

  private let notificationIdentifierCustom = "stayaway.notification.custom"

  func scheduleCustomNotification(title: String, body: String, completionHandler: ((Error?) -> Void)?) {
    let content = UNMutableNotificationContent()
    content.title = title
    content.body = body
    let request = UNNotificationRequest(identifier: notificationIdentifierCustom, content: content, trigger: UNTimeIntervalNotificationTrigger(timeInterval: 20, repeats: false))
    center.add(request, withCompletionHandler: completionHandler)
  }

  private let notificationIdentifierInfoBox = "stayaway.notification.infobox"
  func scheduleInfoBoxNotification(title: String, body: String, url: String, completionHandler: ((Error?) -> Void)? = nil) {
    let content = UNMutableNotificationContent()
    content.title = title
    content.body = body
    content.userInfo = [ "url": url ]
    let request = UNNotificationRequest(identifier: notificationIdentifierInfoBox, content: content, trigger: UNTimeIntervalNotificationTrigger(timeInterval: 20, repeats: false))
    center.add(request, withCompletionHandler: completionHandler)
  }

  // MARK: - Sync warnings

  // If sync doesnt work for 2 days, we show a notification
  // User should open app to fix issues

  private let notificationIdentifier1 = "stayaway.notification.syncWarning1"
  private let notificationIdentifier2 = "stayaway.notification.syncWarning2"

  private let timeInterval1: TimeInterval = 60 * 60 * 24 * 2 // Two days
  private let timeInterval2: TimeInterval = 60 * 60 * 24 * 7 // Seven days

  func removeSyncWarningTriggers() {
    center.removePendingNotificationRequests(withIdentifiers: [notificationIdentifier1, notificationIdentifier2])
  }

  func resetSyncWarningTriggers(tracingState: TracingState) {
    if let lastSync = tracingState.lastSync {
      resetSyncWarningTriggers(lastSuccess: lastSync)
    } else {
      removeSyncWarningTriggers()
    }
  }

  func resetSyncWarningTriggers(lastSuccess: Date) {
    let content = UNMutableNotificationContent()
    content.title = "sync_notification_title".ub_localized;
    content.body = "sync_notification_body".ub_localized;

    let timePassed = lastSuccess.timeIntervalSinceNow

    let trigger1 = UNTimeIntervalNotificationTrigger(timeInterval: timeInterval1 - timePassed, repeats: false)
    let request1 = UNNotificationRequest(identifier: notificationIdentifier1, content: content, trigger: trigger1)

    let trigger2 = UNTimeIntervalNotificationTrigger(timeInterval: timeInterval2 - timePassed, repeats: false)
    let request2 = UNNotificationRequest(identifier: notificationIdentifier2, content: content, trigger: trigger2)

    // Adding a request with the same identifier again automatically cancels an existing request with that identifier, if present
    center.add(request1, withCompletionHandler: nil)
    center.add(request2, withCompletionHandler: nil)
  }
}

extension TracingLocalPush: UNUserNotificationCenterDelegate {
  func userNotificationCenter(_: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert])
  }

  func userNotificationCenter(_: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    guard exposureIdentifiers.contains(response.notification.request.identifier) else {
      if (response.notification.request.identifier == notificationIdentifierCustom) {
        if let url = URL(string: "https://apps.apple.com/pt/app/stayaway-covid/id1519479652"),
           UIApplication.shared.canOpenURL(url)
        {
          UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
      } else if (response.notification.request.identifier == notificationIdentifierInfoBox) {
        if let url = response.notification.request.content.userInfo["url"] as? String,
           let urlValue = URL(string: url),
           UIApplication.shared.canOpenURL(urlValue) {
          UIApplication.shared.open(urlValue, options: [:], completionHandler: nil)
        }
      }
      completionHandler()
      return // not a exposure notification
    }

    guard response.actionIdentifier == UNNotificationDefaultActionIdentifier else {
      completionHandler()
      return // cancelled
    }

    completionHandler()
  }
}
