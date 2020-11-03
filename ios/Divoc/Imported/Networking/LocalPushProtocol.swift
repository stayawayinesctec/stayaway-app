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

protocol LocalPushProtocol {
    func scheduleExposureNotificationsIfNeeded(provider: ExposureProvider)

    func clearNotifications()

    func scheduleCustomNotification(title: String, body: String, completionHandler: ((Error?) -> Void)?)

    func scheduleInfoBoxNotification(title: String, body: String, url: String, completionHandler: ((Error?) -> Void)?)

    func removeSyncWarningTriggers()

    func resetSyncWarningTriggers(tracingState: TracingState)

    func resetSyncWarningTriggers(lastSuccess: Date)
}
