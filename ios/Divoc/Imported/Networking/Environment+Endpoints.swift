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

import Foundation

extension Endpoint {

    /// Validate Code
    static func onset(auth: AuthorizationRequestBody) -> Endpoint {
        let config = ReactNativeConfig.env();
        let envReportUrl:String = config!["BACKEND_REPORT_URL"] as! String;

        return Backend(envReportUrl, version: "v1").endpoint("onset", method: .post, headers: ["accept": "*/*", "Content-Type": "application/json"], body: auth)
    }
}
