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

// Most of this file is inspired by Alamofire ServerTrustEvaluation.swift
// https://github.com/Alamofire/Alamofire/blob/master/Source/ServerTrustEvaluation.swift

enum CertificateValidationError: Error {
    case validationFailed
}

/// Manages for each host the preferred trust evaluator
class UBServerTrustManager {
    /// The default evaluation in case none of the host matches
    let `default`: UBServerTrustEvaluator?
    /// The list of evaluators per host
    let evaluators: [String: UBServerTrustEvaluator]
    /// :nodoc:
    init(evaluators: [String: UBServerTrustEvaluator], default defaultEvaluation: UBServerTrustEvaluator? = nil) {
        self.evaluators = evaluators
        `default` = defaultEvaluation
    }

    /// Gets the evaluator for the specified host
    func serverTrustEvaluator(forHost host: String) -> UBServerTrustEvaluator? {
        return evaluators[host] ?? `default`
    }
}

/// A protocol describing the API used to evaluate server trusts.
public protocol UBServerTrustEvaluator {
    /// Evaluates the given `SecTrust` value for the given `host`.
    ///
    /// - Parameters:
    ///   - trust: The `SecTrust` value to evaluate.
    ///   - host:  The host for which to evaluate the `SecTrust` value.
    /// - Returns: A `Bool` indicating whether the evaluator considers the `SecTrust` value valid for `host`.
    func evaluate(_ trust: SecTrust, forHost host: String) throws
}

// MARK: - Server Trust Evaluators

/// An evaluator which uses the default server trust evaluation while allowing you to control whether to validate the
/// host provided by the challenge. Applications are encouraged to always validate the host in production environments
/// to guarantee the validity of the server's certificate chain.
public final class UBDefaultTrustEvaluator: UBServerTrustEvaluator {
    private let validateHost: Bool

    /// Creates a `DefaultTrustEvalutor`.
    ///
    /// - Parameter validateHost: Determines whether or not the evaluator should validate the host. Defaults to `true`.
    public init(validateHost: Bool = true) {
        self.validateHost = validateHost
    }

    public func evaluate(_ trust: SecTrust, forHost host: String) throws {
        if validateHost {
            try trust.performValidation(forHost: host)
        }

        try trust.performDefaultValidation(forHost: host)
    }
}

/// Uses the pinned certificates to validate the server trust. The server trust is considered valid if one of the pinned
/// certificates match one of the server certificates. By validating both the certificate chain and host, certificate
/// pinning provides a very secure form of server trust validation mitigating most, if not all, MITM attacks.
/// Applications are encouraged to always validate the host and require a valid certificate chain in production
/// environments.
public final class UBPinnedCertificatesTrustEvaluator: UBServerTrustEvaluator {
    private let certificates: [SecCertificate]
    private let acceptSelfSignedCertificates: Bool
    private let performDefaultValidation: Bool
    private let validateHost: Bool

    /// Creates a `PinnedCertificatesTrustEvaluator`.
    ///
    /// - Parameters:
    ///   - certificates:                 The certificates to use to evalute the trust. Defaults to all `cer`, `crt`,
    ///                                   `der` certificates in `Bundle.main`.
    ///   - acceptSelfSignedCertificates: Adds the provided certificates as anchors for the trust evaulation, allowing
    ///                                   self-signed certificates to pass. Defaults to `false`. THIS SETTING SHOULD BE
    ///                                   FALSE IN PRODUCTION!
    ///   - performDefaultValidation:     Determines whether default validation should be performed in addition to
    ///                                   evaluating the pinned certificates. Defaults to `true`.
    ///   - validateHost:                 Determines whether or not the evaluator should validate the host, in addition
    ///                                   to performing the default evaluation, even if `performDefaultValidation` is
    ///                                   `false`. Defaults to `true`.
    public init(certificates: [SecCertificate] = Bundle.main.ub_certificates,
                acceptSelfSignedCertificates: Bool = false,
                performDefaultValidation: Bool = true,
                validateHost: Bool = true) {
        precondition(certificates.isEmpty == false, "This is the case when the framework cannot find certificates in the main bundle of the application. Make sure you copy the certificates.")
        self.certificates = certificates
        self.acceptSelfSignedCertificates = acceptSelfSignedCertificates
        self.performDefaultValidation = performDefaultValidation
        self.validateHost = validateHost
    }

    /// :nodoc:
    public func evaluate(_ trust: SecTrust, forHost host: String) throws {
        assert(certificates.isEmpty == false, "This should not have happened as we make sure to crash if there are no certificates found during initialization.")

        if acceptSelfSignedCertificates {
            try trust.setAnchorCertificates(certificates)
        }

        if performDefaultValidation {
            try trust.performDefaultValidation(forHost: host)
        }

        if validateHost {
            try trust.performValidation(forHost: host)
        }

        let serverCertificatesData = Set(trust.certificateData)
        let pinnedCertificatesData = Set(certificates.data)
        let pinnedCertificatesInServerData = !serverCertificatesData.isDisjoint(with: pinnedCertificatesData)
        if !pinnedCertificatesInServerData {
            throw CertificateValidationError.validationFailed
        }
    }
}

#if DEBUG || ENABLE_TESTING
    /// Disables all evaluation which in turn will always consider any server trust as valid.
    ///
    /// THIS EVALUATOR SHOULD NEVER BE USED IN PRODUCTION!
    public final class UBDisabledEvaluator: UBServerTrustEvaluator {
        /// :nodoc:
        public init() {}

        /// :nodoc:
        public func evaluate(_: SecTrust, forHost _: String) throws {}
    }
#endif

extension Bundle {
    /// Returns all valid `cer`, `crt`, and `der` certificates in the bundle.
    public var ub_certificates: [SecCertificate] {
        return paths(forResourcesOfTypes: [".cer", ".CER", ".crt", ".CRT", ".der", ".DER"]).compactMap { path in
            guard
                let certificateData = try? Data(contentsOf: URL(fileURLWithPath: path)) as CFData,
                let certificate = SecCertificateCreateWithData(nil, certificateData) else { return nil }

            return certificate
        }
    }

    /// Returns all pathnames for the resources identified by the provided file extensions.
    ///
    /// - Parameter types: The filename extensions locate.
    /// - Returns:         All pathnames for the given filename extensions.
    private func paths(forResourcesOfTypes types: [String]) -> [String] {
        return Array(Set(types.flatMap { self.paths(forResourcesOfType: $0, inDirectory: nil) }))
    }
}

extension SecTrust {
    /// Attempts to validate `self` using the policy provided and transforming any error produced using the closure passed.
    ///
    /// - Parameters:
    ///   - policy:        The `SecPolicy` used to evaluate `self`.
    ///   - errorProducer: The closure used transform the failed `OSStatus` and `SecTrustResultType`.
    /// - Throws:          Any error from applying the `policy`, or the result of `errorProducer` if validation fails.
    func validate(policy: SecPolicy) throws {
        try apply(policy: policy).validate()
    }

    /// Applies a `SecPolicy` to `self`, throwing if it fails.
    ///
    /// - Parameter policy: The `SecPolicy`.
    /// - Returns: `self`, with the policy applied.
    /// - Throws: An `AFError.serverTrustEvaluationFailed` instance with a `.policyApplicationFailed` reason.
    func apply(policy: SecPolicy) throws -> SecTrust {
        let status = SecTrustSetPolicies(self, policy)

        guard status.isSuccess else {
            throw CertificateValidationError.validationFailed
        }

        return self
    }

    /// Validate `self`, passing any failure values through `errorProducer`.
    ///
    /// - Parameter errorProducer: The closure used to transform the failed `OSStatus` and `SecTrustResultType` into an
    ///                            `Error`.
    /// - Throws:                  The `Error` produced by the `errorProducer` closure.
    func validate() throws {
        var error: CFError?
        let status = SecTrustEvaluateWithError(self, &error)

        guard status, error == nil else {
            throw CertificateValidationError.validationFailed
        }
    }

    /// Sets a custom certificate chain on `self`, allowing full validation of a self-signed certificate and its chain.
    ///
    /// - Parameter certificates: The `SecCertificate`s to add to the chain.
    /// - Throws:                 Any error produced when applying the new certificate chain.
    func setAnchorCertificates(_ certificates: [SecCertificate]) throws {
        // Add additional anchor certificates.
        let status = SecTrustSetAnchorCertificates(self, certificates as CFArray)
        guard status.isSuccess else {
            throw CertificateValidationError.validationFailed
        }

        // Reenable system anchor certificates.
        let systemStatus = SecTrustSetAnchorCertificatesOnly(self, true)
        guard systemStatus.isSuccess else {
            throw CertificateValidationError.validationFailed
        }
    }

    /// The `SecCertificate`s contained i `self`.
    var certificates: [SecCertificate] {
        return (0 ..< SecTrustGetCertificateCount(self)).compactMap { index in
            SecTrustGetCertificateAtIndex(self, index)
        }
    }

    /// The `Data` values for all certificates contained in `self`.
    var certificateData: [Data] {
        return certificates.data
    }

    /// Validates `self` after applying `SecPolicy.af.default`. This evaluation does not validate the hostname.
    ///
    /// - Parameter host: The hostname, used only in the error output if validation fails.
    /// - Throws: An `AFError.serverTrustEvaluationFailed` instance with a `.defaultEvaluationFailed` reason.
    func performDefaultValidation(forHost _: String) throws {
        try validate(policy: SecPolicy.default)
    }

    /// Validates `self` after applying `SecPolicy.af.hostname(host)`, which performs the default validation as well as
    /// hostname validation.
    ///
    /// - Parameter host: The hostname to use in the validation.
    /// - Throws:         An `AFError.serverTrustEvaluationFailed` instance with a `.defaultEvaluationFailed` reason.
    func performValidation(forHost host: String) throws {
        try validate(policy: SecPolicy.hostname(host))
    }
}

extension SecPolicy {
    /// Creates a `SecPolicy` instance which will validate server certificates but not require a host name match.
    static let `default` = SecPolicyCreateSSL(true, nil)

    /// Creates a `SecPolicy` instance which will validate server certificates and much match the provided hostname.
    ///
    /// - Parameter hostname: The hostname to validate against.
    /// - Returns:            The `SecPolicy`.
    static func hostname(_ hostname: String) -> SecPolicy {
        return SecPolicyCreateSSL(true, hostname as CFString)
    }
}

extension Array where Element == SecCertificate {
    /// All `Data` values for the contained `SecCertificate`s.
    var data: [Data] {
        return map { SecCertificateCopyData($0) as Data }
    }
}

extension SecCertificate {
    /// The public key for `self`, if it can be extracted.
    var publicKey: SecKey? {
        let policy = SecPolicyCreateBasicX509()
        var trust: SecTrust?
        let trustCreationStatus = SecTrustCreateWithCertificates(self, policy, &trust)

        guard let createdTrust = trust, trustCreationStatus == errSecSuccess else { return nil }

        return SecTrustCopyPublicKey(createdTrust)
    }
}

extension OSStatus {
    /// Returns whether `self` is `errSecSuccess`.
    var isSuccess: Bool { return self == errSecSuccess }
}

extension SecTrustResultType {
    /// Returns whether `self is `.unspecified` or `.proceed`.
    var isSuccess: Bool {
        return (self == .unspecified || self == .proceed)
    }
}
