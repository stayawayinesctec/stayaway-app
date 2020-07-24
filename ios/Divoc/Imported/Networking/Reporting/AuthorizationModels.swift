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

struct AuthorizationRequestBody: Codable {
    let authorizationCode: String
    let fake: Int
}

struct AuthorizationResponseBody: Codable {
    let accessToken: JWTToken
}

struct JWTBody: Codable {
    let onset: String?
    let keydate: String?
}

typealias JWTToken = String

extension JWTToken {
    var body: JWTBody? {
        let components = split(separator: ".")
        var body = String(components[1])
        let remainder = body.count % 4
        if remainder > 0 {
            body = body.padding(toLength: body.count + 4 - remainder,
                                withPad: "=",
                                startingAt: 0)
        }
        let data = Data(base64Encoded: body, options: [])
        if let data = data {
            return try? JSONDecoder().decode(JWTBody.self, from: data)
        }
        return nil
    }
}
