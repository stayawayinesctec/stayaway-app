/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { Platform } from 'react-native';
import { createSelector } from 'reselect';
import Moment from 'moment';

import { INFECTION_STATUS, ERRORS } from '@app/services/tracking';

const SERVICE_ERRORS = [
  ERRORS[Platform.OS].BLE_DISABLED,
  ERRORS[Platform.OS].LOCATION_SERVICE_DISABLED,
  ERRORS[Platform.OS].BATTERY_OPTIMIZER_ENABLED,
  ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED,
];

export const getSignUpDate = createSelector(
  state => state.account,
  account => Moment(account.signUpDate),
);

export const isTrackingEnabled = createSelector(
  state => state.account,
  account => account.trackingEnabled,
);

export const getStatus = createSelector(
  state => state.account,
  account => account.status,
);

export const getLastSync = createSelector(
  state => state.account,
  account => account.status.lastSyncDate === 0 ? 0 : Moment(account.status.lastSyncDate),
);

export const isHealthy = createSelector(
  state => state.account,
  account => account.status.infectionStatus === INFECTION_STATUS.HEALTHY,
);

export const isExposed = createSelector(
  state => state.account,
  account => account.status.infectionStatus === INFECTION_STATUS.EXPOSED,
);

export const isInfected = createSelector(
  state => state.account,
  account => account.status.infectionStatus === INFECTION_STATUS.INFECTED,
);

export const getInfectionStatus = createSelector(
  state => state.account,
  account => account.status.infectionStatus,
);

export const isSubmittingDianosis = createSelector(
  state => state.account,
  account => account.submittingDiagnosis.loading,
);

export const getSubmittingDiagnosisError = createSelector(
  state => state.account,
  account => account.submittingDiagnosis.error,
);

export const isSettingUpNewAccount = createSelector(
  state => state.account,
  account => account.settingUpNewAccount.loading,
);

export const getErrors = createSelector(
  state => state.account,
  account => account.status?.errors || [],
);

export const hasErrors = createSelector(
  state => state.account,
  account => account.status?.errors?.length > 0,
);

export const hasServicesErrors = createSelector(
  state => state.account,
  account => account.status?.errors?.some(error => SERVICE_ERRORS.includes(error)),
);

export const hasBluetoothDisabledError = createSelector(
  state => state.account,
  account => account.status?.errors?.includes(ERRORS[Platform.OS].BLE_DISABLED),
);

export const hasLocationDisabledError = createSelector(
  state => state.account,
  account => account.status?.errors?.includes(ERRORS[Platform.OS].LOCATION_SERVICE_DISABLED),
);

export const hasBatteryOptimizerError = createSelector(
  state => state.account,
  account => account.status?.errors?.includes(ERRORS[Platform.OS].BATTERY_OPTIMIZER_ENABLED),
);

export const hasExposureNotificationsDisabledError = createSelector(
  state => state.account,
  account => account.status?.errors?.includes(ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED),
);

export const getLanguage = createSelector(
  state => state.account,
  account => account.language,
);

export const getTheme = createSelector(
  state => state.account,
  account => account.theme,
);

export default {
  getSignUpDate,
  isTrackingEnabled,
  getStatus,
  getLastSync,
  getInfectionStatus,
  isHealthy,
  isExposed,
  isInfected,
  isSubmittingDianosis,
  getSubmittingDiagnosisError,
  isSettingUpNewAccount,
  hasServicesErrors,
  hasBluetoothDisabledError,
  hasLocationDisabledError,
  hasBatteryOptimizerError,
  hasExposureNotificationsDisabledError,
  getErrors,
  getLanguage,
  getTheme,
};
