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
    func request(timeoutInterval: TimeInterval = 30.0) -> URLRequest {
        var request = URLRequest(url: url, timeoutInterval: timeoutInterval)
        request.httpMethod = method.rawValue

        request.setValue(userAgentHeader, forHTTPHeaderField: "User-Agent")

        for (k, v) in headers ?? [:] {
            request.setValue(v, forHTTPHeaderField: k)
        }

        request.httpBody = body

        return request
    }

    private var userAgentHeader: String {
      // Read env variables
        let config = ReactNativeConfig.env();
        let envAppId:String = config!["APP_ID"] as! String;

        let appVersion = Bundle.appVersion
        let build = Bundle.buildNumber

        let os = "iOS"
        let systemVersion = UIDevice.current.systemVersion
        let header = [envAppId, appVersion, build, os, systemVersion].joined(separator: ";")
        return header
    }
}
