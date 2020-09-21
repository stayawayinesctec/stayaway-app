/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

export const INFECTION_STATUS = {
  HEALTHY: 0,
  EXPOSED: 1,
  INFECTED: 2,
};

export const GAEN_STATUS = {
  AVAILABLE: 0,
  UPDATE_REQUIRED: 1,
  UNAVAILABLE: 2,
};

export const GAEN_RESULTS = {
  EN_SUCCEEDED: 'EN_SUCCEEDED',
  EN_FAILED: 'EN_FAILED',
  EN_CANCELLED: 'EN_CANCELLED',
};

export const ERRORS = {
  ios: {
    LOCATION_SERVICE_DISABLED: 0,
		BLE_DISABLED: 1,
		BLE_NOT_SUPPORTED: 2,
		GAEN_NOT_AVAILABLE: 3,
		GAEN_UNEXPECTEDLY_DISABLED: 4,
		BATTERY_OPTIMIZER_ENABLED: 5,
		SYNC_ERROR_SERVER: 6,
		SYNC_ERROR_NETWORK: 7,
		SYNC_ERROR_NO_SPACE: 8,
		SYNC_ERROR_SSLTLS: 9,
		SYNC_ERROR_TIMING: 10,
		SYNC_ERROR_SIGNATURE: 11,
		SYNC_ERROR_API_EXCPETION: 12,
    UNKNOWN_HOST_EXCEPTION: 13,
    UNKNOWN_EXCEPTION: 14,
    INVALID_CODE_EXCEPTION: 15,
    USER_MARKED_AS_INFECTED: 16,
  },
  android: {
    LOCATION_SERVICE_DISABLED: 0,
		BLE_DISABLED: 1,
		BLE_NOT_SUPPORTED: 2,
		GAEN_NOT_AVAILABLE: 3,
		GAEN_UNEXPECTEDLY_DISABLED: 4,
		BATTERY_OPTIMIZER_ENABLED: 5,
		SYNC_ERROR_SERVER: 6,
		SYNC_ERROR_NETWORK: 7,
		SYNC_ERROR_NO_SPACE: 8,
		SYNC_ERROR_SSLTLS: 9,
		SYNC_ERROR_TIMING: 10,
		SYNC_ERROR_SIGNATURE: 11,
		SYNC_ERROR_API_EXCPETION: 12,
    UNKNOWN_HOST_EXCEPTION: 13,
    UNKNOWN_EXCEPTION: 14,
    INVALID_CODE_EXCEPTION: 15,
  },
};

export const EVENTS = {
  ios: {
    UPDATE_EVENT: 'fct.inesctec.stayaway.ios.sdk.UPDATE_EVENT',
  },
  android: {
    LOCATION_SERVICE_CHANGED: 'fct.inesctec.stayaway.android.sdk.LOCATION_SERVICE_CHANGED',
    BLUETOOTH_SERVICE_CHANGED: 'fct.inesctec.stayaway.android.sdk.BLUETOOTH_SERVICE_CHANGED',
    BATTERY_OPTIMIZATION_CHANGED: 'fct.inesctec.stayaway.android.sdk.BATTERY_OPTIMIZATION_CHANGED',
    UPDATE_EVENT: 'fct.inesctec.stayaway.android.sdk.UPDATE_EVENT',
  },
};

const start = jest.fn();
const stop = jest.fn();
const isTracingEnabled = jest.fn();
const getStatus = jest.fn();
const exposed = jest.fn();
const addUpdateEventListener = jest.fn();
const removeUpdateEventListener = jest.fn();
const resetInfectionStatus = jest.fn();
const isIgnoringBatteryOptimizationsPermission = jest.fn();
const requestIgnoreBatteryOptimizationsPermission = jest.fn();

export default {
  start,
  stop,
  isTracingEnabled,
  getStatus,
  exposed,
  addUpdateEventListener,
  removeUpdateEventListener,
  resetInfectionStatus,
  isIgnoringBatteryOptimizationsPermission,
  requestIgnoreBatteryOptimizationsPermission,
};
