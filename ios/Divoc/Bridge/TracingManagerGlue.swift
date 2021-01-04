/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import Foundation
import DP3TSDK
import UIKit

func wrapState(_ state: TracingState) -> Dictionary<String, Any> {
  TracingLocalPush.shared.scheduleExposureNotificationsIfNeeded(provider: state)
  TracingLocalPush.shared.resetSyncWarningTriggers(tracingState: state)

  let keys = ["infectionStatus", "lastSyncDate", "errors", "exposureDays"]
  var exposureDays: Array<Any> = [];
  var infectst = 0;
  switch state.infectionStatus {
  case .infected:
    infectst = 2;
  case let .exposed(days):
    infectst = 1;
    for expday in days {
      let expDayKeys = ["id", "exposedDate", "reportDate"];
      let expDayValues:Array<Any> = [expday.identifier.uuidString, expday.exposedDate.timeIntervalSince1970*1000, expday.reportDate.timeIntervalSince1970*1000]

      exposureDays.append(Dictionary(uniqueKeysWithValues: zip(expDayKeys, expDayValues)));
    }

  default:
    infectst = 0;
  }

  var values = [infectst, state.lastSync != nil ? Int64(state.lastSync!.timeIntervalSince1970*1000) : 0] as [Any]
  let trackst = state.trackingState
  switch trackst {
  case .active:
    values.append([])
  case .stopped:
    values.append([4])
  case .inactive(error: let error):
    switch error {
    case .bluetoothTurnedOff:
      values.append([1])
    case .networkingError(error: _):
      values.append([7])
    case .caseSynchronizationError(errors: _):
      values.append([7])
    case .cancelled:
      values.append([14])
    case .exposureNotificationError(error: _):
      values.append([4])
    case .permissonError:
      values.append([4])
    case .userAlreadyMarkedAsInfected:
      values.append([16])
    case .authorizationUnknown:
      values.append([17])
    }

  case .initialization:
    NSLog("case .initialization")
  }
  values.append(exposureDays);

  return Dictionary(uniqueKeysWithValues: zip(keys, values));
}

@objc open class TracingManagerGlue: RCTEventEmitter{

  @objc static let shared = TracingManagerGlue()

  private var delegate:TracingDelegate? = nil

  @objc public var father:TracingManager?

  private let SUCCESS:String = "SUCCESS";
  private let FAILED:String = "FAILED";
  private let UNKNOWN_HOST_EXCEPTION:String = "13";
  private let UNKNOWN_EXCEPTION:String = "14";
  private let INVALID_CODE_EXCEPTION:String = "15";
  private let EN_CANCELLED:String = "EN_CANCELLED";
  private let EN_SUCCEEDED:String =  "EN_SUCCEEDED";
  private let EN_FAILED:String = "EN_FAILED";

  @KeychainPersisted(key: "tracingIsActivated", defaultValue: true)
  private var isActivated: Bool

  // in memory dictionary for codes we already have a token and date,
  // if only the second request (iWasExposed) fails
  private var codeDictionary: [String: (String, Date)] = [:]

  var isSupported: Bool {
    DP3TTracing.isOSCompatible
  }

  override init(){
    super.init()
    NSLog("Glue initialized")
  }

  private class TracingDelegate : DP3TTracingDelegate{

    private var tmglue: TracingManagerGlue

    init(glue: TracingManagerGlue){
      self.tmglue = glue
    }

    func DP3TTracingStateChanged(_ state: TracingState) {
      NSLog("SDK woke up with state change.")
      TracingLocalPush.shared.scheduleExposureNotificationsIfNeeded(provider: state)
      TracingLocalPush.shared.resetSyncWarningTriggers(tracingState: state)
      let dict = wrapState(state);

      NSLog(dict.description)
      self.tmglue.father?.eventReceived(dict)
    }
  }

  @objc open override func supportedEvents() -> [String] {
    return ["fct.inesctec.stayaway.ios.sdk.UPDATE_EVENT"]
  }

  @objc func initialize() {
    guard isSupported else { return }
    guard #available(iOS 12.5, *) else { return }
    
    // Read env variables
    let config = ReactNativeConfig.env();
    let envAppId:String = config!["APP_ID"] as! String;
    let envBucketUrl:String = config!["BACKEND_BUCKET_URL"] as! String;
    let envReportUrl:String = config!["BACKEND_REPORT_URL"] as! String;
    let envPublicKey:String = config!["BACKEND_PUBLIC_KEY"] as! String;

    let bucketUrl:URL = URL(string: envBucketUrl)!;
    let reportUrl:URL = URL(string: envReportUrl)!;
    let publicKey = Data(base64Encoded: envPublicKey);

    let descriptor = ApplicationDescriptor(appId: envAppId,
                                            bucketBaseUrl: bucketUrl,
                                            reportBaseUrl: reportUrl,
                                            jwtPublicKey: publicKey,
                                            mode: .production)

    DP3TTracing.initialize(with: descriptor,
                                urlSession: URLSession.certificatePinned,
                                backgroundHandler: self)

    NSLog("DP3TGLUE: Tracing initialized.")
  }

  @objc func isTracingEnabled(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(self.isActivated);
  }

  @objc func start(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) {
      guard #available(iOS 12.5, *) else { return }

      self.delegate = TracingDelegate(glue: self)
      DP3TTracing.delegate = self.delegate
      DP3TTracing.startTracing(completionHandler: { result in
      switch result {
        case .success:
          DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
              self.sync({_ in }, rejecter: {_,_,_ in })
          }
          self.isActivated = true;
          resolve(self.EN_SUCCEEDED);
          NSLog("DP3T START SUCCESS")

        case let .failure(error):
          NSLog("Error starting tracing: "+error.localizedDescription)
          if case DP3TTracingError.userAlreadyMarkedAsInfected = error {
            resolve(self.EN_FAILED);
          } else {
            resolve(self.EN_CANCELLED);
          }
      }
    })
  }

  @objc func stop(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard #available(iOS 12.5, *) else { return }

    DP3TTracing.stopTracing()
    TracingLocalPush.shared.removeSyncWarningTriggers()
    NSLog("DP3TGLUE: Tracing stopped.")
    self.isActivated = false;
    resolve(self.SUCCESS);
  }

  @objc func clearNotifications(){
    TracingLocalPush.shared.clearNotifications()
  }

  @objc func getStatus(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock) {
      guard isSupported else { return }
      guard #available(iOS 12.5, *) else { return }

      let state = DP3TTracing.status;
      resolve(wrapState(state));
  }

  @objc func getInfo(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock) {
    let OSVersion = UIDevice.current.systemVersion;
    let deviceModel = UIDevice.modelName;
    let versionName = Bundle.appVersion;
    let versionCode = Bundle.buildNumber;

    let dict = [
      "OSVersion": OSVersion,
      "deviceModel": deviceModel,
      "versionName": versionName,
      "versionCode": versionCode
    ];

    resolve(dict);
  }

  @objc func isENSupported(
    _ resolve:@escaping RCTPromiseResolveBlock,
    rejecter reject:@escaping RCTPromiseRejectBlock) {
      resolve(self.isSupported);
  }

  @objc func sync(
    _ resolve:@escaping RCTPromiseResolveBlock,
    rejecter reject:@escaping RCTPromiseRejectBlock) {
      guard #available(iOS 12.5, *) else { return }

      DP3TTracing.sync { result in
        switch result {
        case let .failure(e):
          switch(e) {
          case .networkingError(error: let error):
            switch(error){
            case .networkSessionError(error: let error2):
              NSLog("Sync. Networking networkSessionError error "+error2.localizedDescription)
            case .notHTTPResponse:
              NSLog("Sync. Networking notHTTPResponse error ")
            case .HTTPFailureResponse(status: let status):
              NSLog("Sync. Networking HTTPFailureResponse error \(status)")
            case .noDataReturned:
              NSLog("Sync. Networking noDataReturned error ")
            case .couldNotParseData(error: let error2, origin: let origin):
              NSLog("Sync. Networking couldNotParseData error "+error2.localizedDescription+" "+origin.description)
            case .couldNotEncodeBody:
              NSLog("Sync. Networking couldNotEncodeBody error ")
            case .timeInconsistency(shift: let shift):
              NSLog("Sync. Networking timeInconsistency error "+shift.description)
            case .jwtSignatureError(code: let code, debugDescription: let debugDescription):
              NSLog("Sync. Networking jwtSignatureError error "+code.description+" "+debugDescription)
            }
          case .caseSynchronizationError(errors: let errors):
            NSLog("Sync. caseSynchronization error "+errors.description)
          case .bluetoothTurnedOff:
            NSLog("Sync. Bluetooth error ")
          case .permissonError:
            NSLog("Sync. Permission error ")
          case .userAlreadyMarkedAsInfected:
            NSLog("Sync. User already marked as infected.")
          case .cancelled:
            NSLog("Sync. Cancelled.")
          case .exposureNotificationError(error: let error):
            NSLog("Sync. EN error."+error.localizedDescription)
          case .authorizationUnknown:
            NSLog("Sync. Authorization unkown.")
          }
          reject(self.UNKNOWN_EXCEPTION, e.localizedDescription, e);

        case .success:
          TracingLocalPush.shared.resetSyncWarningTriggers(lastSuccess: Date())
          resolve(self.SUCCESS);
        case .skipped:
          NSLog("Sync was skipped.")
          TracingLocalPush.shared.resetSyncWarningTriggers(lastSuccess: Date())
          resolve(self.SUCCESS);
        }
      }
  }

  @objc func exposed(code: String,
                     resolver resolve:@escaping RCTPromiseResolveBlock,
                     rejecter reject:@escaping RCTPromiseRejectBlock) {

    ReportingManager.shared.report(covidCode: code, isFakeRequest: false) { (problem) in
      if problem != nil {
        NSLog("Exposed submission failed. " + problem.debugDescription);

        let error = problem!
        switch(error){
          case .invalidCode:
            reject(self.INVALID_CODE_EXCEPTION, self.INVALID_CODE_EXCEPTION, NetworkError.networkError);
          case .failure:
            reject(self.UNKNOWN_HOST_EXCEPTION, self.UNKNOWN_HOST_EXCEPTION, NetworkError.networkError);
          default:
            reject(self.UNKNOWN_EXCEPTION, self.UNKNOWN_EXCEPTION, NetworkError.networkError);
        }
     } else {
        NSLog("Exposed submission success.")
        resolve(self.SUCCESS)
      }
    }
  }

  @objc func resetInfectionStatus(_ resolve:@escaping RCTPromiseResolveBlock,
                                  rejecter reject:@escaping RCTPromiseRejectBlock) {
    guard #available(iOS 12.5, *) else { return }

    DP3TTracing.resetInfectionStatus()
    resolve(self.SUCCESS);
  }

  @objc func resetExposureDays(_ resolve:@escaping RCTPromiseResolveBlock,
                               rejecter reject:@escaping RCTPromiseRejectBlock) {
    guard #available(iOS 12.5, *) else { return }

    DP3TTracing.resetExposureDays()
    resolve(self.SUCCESS);
  }
}

extension TracingManagerGlue: DP3TBackgroundHandler {
  public func didScheduleBackgrounTask() {
    NSLog("Background tasks scheduled.")
  }

  public func performBackgroundTasks(completionHandler: @escaping (Bool) -> Void) {
    NSLog("Background tasks performing.")
    let group = DispatchGroup()
    group.enter()
    TracingLocalPush.shared.resetSyncWarningTriggers(lastSuccess: Date())
    FakePublishManager.shared.runTask {
      group.leave()
    }
    group.enter()
    ParametersManager.shared.runTask{
      group.leave()
    }
    group.notify(queue: .global(qos: .background)) {
        completionHandler(true)
    }
  }
}
