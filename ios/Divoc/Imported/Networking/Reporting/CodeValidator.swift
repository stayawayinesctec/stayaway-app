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

class CodeValidator {
  private let session = URLSession.certificatePinned

    enum ValidationResult {
        case success(token: String, date: Date)
        case failure(error: CodedError)
        case invalidTokenError
    }

    func sendCodeRequest(code: String, isFakeRequest fake: Bool, completion: @escaping (ValidationResult) -> Void) {
        let auth = AuthorizationRequestBody(authorizationCode: code, fake: fake ? 1 : 0)

        let dataTask = session.dataTask(with: Endpoint.onset(auth: auth).request(), completionHandler: { data, response, error in

            DispatchQueue.main.async {
                if let response = response as? HTTPURLResponse {
                    if response.statusCode == 404 {
                        completion(.invalidTokenError)
                        return
                    } else if response.statusCode >= 400 {
                        completion(.failure(error: NetworkError.statusError(code: response.statusCode)))
                        return
                    }
                }

                if let error = error {
                    let nsError = error as NSError
                    if let e = error as? CodedError {
                        completion(.failure(error: e))
                    } else if nsError.domain == NSURLErrorDomain, nsError.code == -999 {
                        completion(.failure(error: CertificateValidationError.validationFailed))
                    } else {
                        completion(.failure(error: NetworkError.unexpected(error: error)))
                    }
                    return
                } else if response == nil {
                    completion(.failure(error: NetworkError.networkError))
                    return
                }

                guard let d = data, let result = try? JSONDecoder().decode(AuthorizationResponseBody.self, from: d) else {
                    completion(.failure(error: NetworkError.parseError))
                    return
                }

                guard let jwtBody = result.accessToken.body else {
                    completion(.failure(error: NetworkError.parseError))
                    return
                }

                guard let dateString = jwtBody.keydate ?? jwtBody.onset else {
                    completion(.failure(error: NetworkError.parseError))
                    return
                }

                let formatter = DateFormatter()
                formatter.dateFormat = "yyyy-MM-dd"
                formatter.locale = Locale(identifier: "en_US_POSIX")
                guard let date = formatter.date(from: dateString) else {
                    completion(.failure(error: NetworkError.parseError))
                    return
                }

                let token = result.accessToken

                completion(.success(token: token, date: date))
            }
        })

        dataTask.resume()
    }
}
