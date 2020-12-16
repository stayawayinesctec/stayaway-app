/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { takeLatest, put, call, fork, take, cancel, delay, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import Moment from 'moment';
import { Alert, Platform } from 'react-native';
import RNRestart from 'react-native-restart';
import SplashScreen from 'react-native-splash-screen';

import NavigationService from '@app/services/navigation';
import Configuration from '@app/services/configuration';
import TracingManager, { ERRORS, GAEN_RESULTS, INFECTION_STATUS } from '@app/services/tracing';
import i18n from '@app/services/i18n';
import Linking from '@app/services/linking';

import AppRoutes from '@app/navigation/routes';

import modalsActions, { modalsTypes } from '@app/redux/modals';
import accountActions, { accountTypes, TRACING_RESULTS } from '@app/redux/account';
import onboardingActions from '@app/redux/onboarding';
import { isTracingEnabled, getStatus } from '@app/redux/account/selectors';
import permissionsActions, { permissionsTypes } from '@app/redux/permissions';

export function* setupNewAccount() {
  yield put(accountActions.setupNewAccountPending());

  // Set default state
  yield put(accountActions.updateStatus({
    lastSyncDate: 0,
    infectionStatus: 0,
    exposureDays: [],
    errors: [],
  }));

  // Check if permissions are all granted
  yield put(permissionsActions.checkAllPermissions());
  const { payload: allPermissionsGranted } = yield take(permissionsTypes.CHECK_ALL_PERMISSIONS_RESULT);

  if (! allPermissionsGranted) {
    // Request permissions
    yield put(permissionsActions.requestAllPermissions());
    yield take(permissionsTypes.REQUEST_ALL_PERMISSIONS_RESULT);
  }

  // Start tracing manager
  if (Configuration.UI) {
    yield put(accountActions.updateStatus({
      lastSyncDate: Moment().toJSON(),
      infectionStatus: 0,
      exposureDays: [],
      errors: [],
    }));
  }

  yield put(accountActions.startTracing());
  const { payload } = yield take(accountTypes.START_TRACING_RESULT);

  if (payload === TRACING_RESULTS.SUCCESS) {
    // Set tracing activated
    yield put(accountActions.setTracingEnabled(true));
  } else if (payload === TRACING_RESULTS.GAEN) {
    yield put(accountActions.setTracingEnabled(false));

    // Add tracing error
    yield put(accountActions.setErrors([ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED]));
  } else {
    yield put(accountActions.setTracingEnabled(false));
  }

  // Update new account redux
  yield put(accountActions.setSignUpDate(Moment().toJSON()));

  // Delay 1 second
  yield delay(1000);

  // Navigate to home
  yield put(onboardingActions.setOnboarding(false));
  yield put(accountActions.setupNewAccountDone());
  NavigationService.navigate(AppRoutes.APP);
}

export function* watchTracingStatus() {
  // Set event listener value
  const channel = eventChannel((emitter) => {
    TracingManager.addUpdateEventListener(emitter);
    return () => TracingManager.removeUpdateEventListener();
  });

  try {
    yield put(accountActions.tracingStatusListenerRegistered());

    while (true) {
      const status = yield take(channel);
      console.log(status);

      // Update redux store
      yield put(accountActions.updateStatus(status));
    }
  } catch (error) {
    // Do nothing
    console.log(error);
  }
}

export function* startTracing() {
  if (Configuration.UI) {
    yield put(accountActions.setTracingEnabled(true));
    yield put(accountActions.startTracingResult(TRACING_RESULTS.SUCCESS));
    yield take(accountTypes.STOP_TRACING);
    yield put(accountActions.stopTracingResult(TRACING_RESULTS.SUCCESS));
    return;
  }

  const watcher = yield fork(watchTracingStatus);

  // Wait for listener to registered
  yield take(accountTypes.TRACING_STATUS_LISTENER_REGISTERED);
  try {
    const result = yield call(TracingManager.start);

    if (result === GAEN_RESULTS.EN_CANCELLED) {
      if (Platform.OS === 'android') {
        // Show alert
        Alert.alert(
          i18n.translate('common.dialogs.gaen.enable.title'),
          i18n.translate('common.dialogs.gaen.enable.description'),
          [
            {
              text: i18n.translate('common.actions.ok'),
              style: 'default',
            },
          ],
        );
      }

      yield put(accountActions.startTracingResult(TRACING_RESULTS.GAEN));
      yield cancel(watcher);
      return;
    }

    try {
      yield call(TracingManager.sync);

      // Get status
      const status = yield call(TracingManager.getStatus);
      yield put(accountActions.updateStatus(status));
    } catch (error) {
      // Sync error. Probably exposure check limit reached.
      // Clear errors
      yield put(accountActions.setErrors([]));
      console.log(error);
    }

    yield put(accountActions.startTracingResult(TRACING_RESULTS.SUCCESS));
  } catch (error) {
    console.log(error);
    yield put(accountActions.startTracingResult(TRACING_RESULTS.FAILED));
    yield cancel(watcher);
    return;
  }

  try {
    yield take(accountTypes.STOP_TRACING);
    yield cancel(watcher);
    yield call(TracingManager.stop);
    yield put(accountActions.stopTracingResult(TRACING_RESULTS.SUCCESS));
  } catch (error) {
    console.log(error);
    yield put(accountActions.stopTracingResult('ERROR'));
  }
}

export function* submitDiagnosis({ payload: code }) {
  // Open loading modal
  yield put(accountActions.submitDiagnosisPending());
  yield put(modalsActions.openLoadingModal());
  yield take(modalsTypes.LOADING_MODAL_OPEN);

  try {
    if (Configuration.UI) {
      // Delay 1.5 seconds
      yield delay(1500);

      // Mark as infected
      yield put(accountActions.setInfectionStatus(INFECTION_STATUS.INFECTED));

      // Stop tracing
      yield put(accountActions.setTracingEnabled(false));

      yield put(accountActions.submitDiagnosisDone());
      yield put(modalsActions.closeLoadingModal());
      yield take(modalsTypes.LOADING_MODAL_CLOSED);

      return;
    }

    // Submit exposed code
    const result = yield call(TracingManager.exposed, code);

    if (result === GAEN_RESULTS.EN_CANCELLED) {
      if (Platform.OS === 'android') {
        // Show alert
        Alert.alert(
          i18n.translate('common.dialogs.gaen.export.title'),
          i18n.translate('common.dialogs.gaen.export.description'),
          [
            {
              text: i18n.translate('common.actions.ok'),
              style: 'default',
            },
          ],
        );
      }

      yield put(accountActions.submitDiagnosisDone());
      yield put(modalsActions.closeLoadingModal());
      yield take(modalsTypes.LOADING_MODAL_CLOSED);
      return;
    }

    // Update status
    yield put(accountActions.setInfectionStatus(INFECTION_STATUS.INFECTED));
    yield take(accountTypes.UPDATE_STATUS_RESULT);

    // Stop tracing
    yield call(TracingManager.removeUpdateEventListener);
    yield put(accountActions.setTracingEnabled(false));

    yield put(accountActions.submitDiagnosisDone());
    yield put(modalsActions.closeLoadingModal());
    yield take(modalsTypes.LOADING_MODAL_CLOSED);
  } catch (error) {
    console.log(error);

    yield put(accountActions.submitDiagnosisDone());
    yield put(modalsActions.closeLoadingModal());
    yield take(modalsTypes.LOADING_MODAL_CLOSED);

    if (error.message === ERRORS[Platform.OS].UNKNOWN_HOST_EXCEPTION.toString()) {
      yield put(accountActions.submitDiagnosisError(i18n.translate('common.errors.network')));
      yield put(modalsActions.openNetworkModal());
      yield take(modalsTypes.NETWORK_MODAL_OPEN);
    } else if (error.message === ERRORS[Platform.OS].INVALID_CODE_EXCEPTION.toString()) {
      yield put(accountActions.submitDiagnosisError(i18n.translate('common.errors.submit.code')));
      yield put(modalsActions.openInvalidCodeModal());
      yield take(modalsTypes.INVALID_CODE_MODAL_OPEN);
    } else {
      yield put(accountActions.submitDiagnosisError(i18n.translate('common.errors.general')));
      yield put(modalsActions.openServerErrorModal());
      yield take(modalsTypes.SERVER_ERROR_MODAL_OPEN);
    }
  }
}

export function* switchTracing() {
  const tracingEnabled = yield select(isTracingEnabled);
  if (tracingEnabled) {
    yield put(accountActions.stopTracing());
    yield take(accountTypes.STOP_TRACING_RESULT);
    yield put(accountActions.setTracingEnabled(false));
    yield put(accountActions.setErrors([]));
    return;
  }

  // Ensure permissions are all granted
  yield put(permissionsActions.checkAllPermissions());
  const { payload: allPermissionsGranted } = yield take(permissionsTypes.CHECK_ALL_PERMISSIONS_RESULT);

  if (! allPermissionsGranted) {
    // Request permissions
    yield put(permissionsActions.requestAllPermissions());
    const { payload: allPermissionsAllowed } = yield take(permissionsTypes.REQUEST_ALL_PERMISSIONS_RESULT);

    if (! allPermissionsAllowed) {
      if (Platform.OS === 'android') {
        // Show alert
        Alert.alert(
          i18n.translate('common.dialogs.permissions.title'),
          i18n.translate('common.dialogs.permissions.description'),
          [
            {
              text: i18n.translate('common.actions.ok'),
              style: 'default',
            },
          ],
        );
      }

      // Set tracing deactivated
      yield put(accountActions.setTracingEnabled(false));
      return;
    }
  }

  // Start tracing manager
  yield put(accountActions.startTracing());
  const { payload } = yield take(accountTypes.START_TRACING_RESULT);

  if (payload === TRACING_RESULTS.SUCCESS) {
    // Set tracing activated
    yield put(accountActions.setTracingEnabled(true));
  } else {
    yield put(accountActions.setTracingEnabled(false));
  }
}

export function* updateStatus({ payload: status }) {
  if (! Configuration.UI) {
    // Check if user has been exposed
    if (status.infectionStatus === INFECTION_STATUS.EXPOSED) {
      const { exposureDays = [] } = status;

      // Get last exposure day
      if (exposureDays.length > 0) {
        const { exposedDate } = exposureDays[exposureDays.length - 1];

        // Check if has passed 14 days after last exposure
        const fourteenDaysAgo = Moment().startOf('day').subtract(14, 'days');
        if (Moment(exposedDate).isBefore(fourteenDaysAgo)) {
          yield call(TracingManager.resetExposureDays);
        }
      }
    }

    // Check GAEN toggle
    if (status.errors.includes(ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED)) {
      yield put(accountActions.setTracingEnabled(false));
    } else {
      const tracingEnabled = yield call(TracingManager.isTracingEnabled);

      if (tracingEnabled) {
        yield put(accountActions.setTracingEnabled(true));
      }
    }
  }

  // Update redux store
  yield put(accountActions.setStatus(status));

  yield put(accountActions.updateStatusResult(status));
}

export function* setErrors({ payload: errors }) {
  const status = yield select(getStatus);

  yield put(accountActions.updateStatus({
    ...status,
    errors,
  }));
}

export function* setInfectionStatus({ payload: infectionStatus }) {
  const status = yield select(getStatus);

  let { errors } = status;
  if (infectionStatus === INFECTION_STATUS.INFECTED) {
    errors = [];
  };

  yield put(accountActions.updateStatus({
    ...status,
    infectionStatus,
    errors,
  }));
}

export function* updateLanguage({ payload: languageTag }) {
  const language = i18n.setI18nConfig(languageTag);
  yield put(accountActions.setLanguage(language));
  SplashScreen.show();
  RNRestart.Restart();
}

export function* enableExposureNotifications() {
  yield put(accountActions.startTracing());
  const { payload } = yield take(accountTypes.START_TRACING_RESULT);

  if (payload !== TRACING_RESULTS.SUCCESS) {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings://');
    }
  }
}

export function* requestIgnoreBatteryOptimizations() {
  yield call(TracingManager.requestIgnoreBatteryOptimizationsPermission);
}

function* watchSetupNewAccount() {
  yield takeLatest(accountTypes.SETUP_NEW_ACCOUNT_REQUEST, setupNewAccount);
}

function* watchStartTracing() {
  yield takeLatest(accountTypes.START_TRACING, startTracing);
}

function* watchSubmitDiagnosisRequests() {
  yield takeLatest(accountTypes.SUBMIT_DIAGNOSIS_REQUEST, submitDiagnosis);
}

function* watchSwitchTracing() {
  yield takeLatest(accountTypes.SWITCH_TRACING, switchTracing);
}

function* watchUpdateStatus() {
  yield takeLatest(accountTypes.UPDATE_STATUS, updateStatus);
}

function* watchSetErrors() {
  yield takeLatest(accountTypes.SET_ERRORS, setErrors);
}

function* watchSetInfectionStatus() {
  yield takeLatest(accountTypes.SET_INFECTION_STATUS, setInfectionStatus);
}

function* watchUpdateLanguage() {
  yield takeLatest(accountTypes.UPDATE_LANGUAGE, updateLanguage);
}

function* watchEnableExposureNotifications() {
  yield takeLatest(accountTypes.ENABLE_EXPOSURE_NOTIFICATIONS, enableExposureNotifications);
}

function* watchRequestIgnoreBatteryOptimizations() {
  yield takeLatest(accountTypes.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, requestIgnoreBatteryOptimizations);
}

export default function* root() {
  yield fork(watchSetupNewAccount);
  yield fork(watchStartTracing);
  yield fork(watchSubmitDiagnosisRequests);
  yield fork(watchSwitchTracing);
  yield fork(watchUpdateStatus);
  yield fork(watchSetErrors);
  yield fork(watchSetInfectionStatus);
  yield fork(watchUpdateLanguage);
  yield fork(watchEnableExposureNotifications);
  yield fork(watchRequestIgnoreBatteryOptimizations);
}
