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
import Security
import TrustKit

extension URLSession {
  static let evaluator = CertificateEvaluator()

  static let certificatePinned: URLSession = {
    let session = URLSession(configuration: .default,
                             delegate: URLSession.evaluator,
                             delegateQueue: nil)
    return session
  }()
}

class CertificateEvaluator: NSObject, URLSessionDelegate {

  override init(){
    super.init()
    let trustKitConfig = [
      kTSKSwizzleNetworkDelegates: false,
      kTSKPinnedDomains: [
        "stayaway.incm.pt" : [
          kTSKIncludeSubdomains : true,
          kTSKEnforcePinning : true,
          kTSKPublicKeyHashes: [
            "KArAwbAlrVTa8DektoICjekhEwhJWKU39zEeo3SxzWA=",
            "fj/z1XrBbJbj18u72Y0mLqUd4ZCcXVyzgBr8QN9NXwA="
          ],],
        "stayaway.min-saude.pt" : [
        kTSKIncludeSubdomains : true,
        kTSKEnforcePinning : true,
        kTSKPublicKeyHashes: [
          "N36p2K8/nu2qtj9uNAIxjVv/GNlVgXggPVjdhLXbZQg=",
          "Ud3zjF0T6gbOC5mwvzJSBPDLgAgu9OJ8ZbM9gkeZxxQ=",
          "fj/z1XrBbJbj18u72Y0mLqUd4ZCcXVyzgBr8QN9NXwA="
        ],],
      ]
    ] as [String : Any]
    TrustKit.initSharedInstance(withConfiguration: trustKitConfig)
  }

  func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Swift.Void) {
    // Let TrustKit handle it
    NSLog("Running challenge.")
    TrustKit.sharedInstance().pinningValidator.handle(challenge, completionHandler: completionHandler)
  }
}
