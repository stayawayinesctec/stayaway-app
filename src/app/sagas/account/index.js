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
import TrackingManager, { ERRORS, GAEN_RESULTS, INFECTION_STATUS } from '@app/services/tracking';
import i18n from '@app/services/i18n';
import Linking from '@app/services/linking';

import AppRoutes from '@app/navigation/routes';

import modalsActions, { modalsTypes } from '@app/redux/modals';
import accountActions, { accountTypes, TRACKING_RESULTS } from '@app/redux/account';
import onboardingActions from '@app/redux/onboarding';
import { isTrackingEnabled, getStatus } from '@app/redux/account/selectors';
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

  // Start tracking manager
  if (Configuration.UI) {
    yield put(accountActions.updateStatus({
      lastSyncDate: Moment().toJSON(),
      infectionStatus: 0,
      exposureDays: [],
      errors: [],
    }));

    yield put(accountActions.setTrackingEnabled(true));
  } else {
    yield put(accountActions.startTracking());
    const { payload } = yield take(accountTypes.START_TRACKING_RESULT);

    if (payload === TRACKING_RESULTS.SUCCESS) {
      // Set tracking activated
      yield put(accountActions.setTrackingEnabled(true));
    } else if (payload === TRACKING_RESULTS.GAEN) {
      yield put(accountActions.setTrackingEnabled(false));

      // Add tracking error
      yield put(accountActions.setErrors([ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED]));
    } else {
      yield put(accountActions.setTrackingEnabled(false));
    }
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

export function* watchTrackingStatus() {
  // Set event listener value
  const channel = eventChannel((emitter) => {
    TrackingManager.addUpdateEventListener(emitter);
    return () => TrackingManager.removeUpdateEventListener();
  });

  try {
    yield put(accountActions.trackingStatusListenerRegistered());

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

export function* startTracking() {
  const watcher = yield fork(watchTrackingStatus);

  // Wait for listener to registered
  yield take(accountTypes.TRACKING_STATUS_LISTENER_REGISTERED);
  try {
    const result = yield call(TrackingManager.start);

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

      yield put(accountActions.startTrackingResult(TRACKING_RESULTS.GAEN));
      yield cancel(watcher);
      return;
    }

    yield call(TrackingManager.sync);

    // Get status
    const status = yield call(TrackingManager.getStatus);
    yield put(accountActions.updateStatus(status));

    yield put(accountActions.startTrackingResult(TRACKING_RESULTS.SUCCESS));
  } catch (error) {
    console.log(error);
    yield put(accountActions.startTrackingResult(TRACKING_RESULTS.FAILED));
    yield cancel(watcher);
    return;
  }

  try {
    yield take(accountTypes.STOP_TRACKING);
    yield cancel(watcher);
    yield call(TrackingManager.stop);
    yield put(accountActions.stopTrackingResult(TRACKING_RESULTS.SUCCESS));
  } catch (error) {
    console.log(error);
    yield put(accountActions.stopTrackingResult('ERROR'));
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

      yield put(accountActions.submitDiagnosisDone());
      yield put(modalsActions.closeLoadingModal());
      yield take(modalsTypes.LOADING_MODAL_CLOSED);

      // Mark as infected
      yield put(accountActions.updateStatus({
        lastSyncDate: Moment().toJSON(),
        infectionStatus: 2,
        exposureDays: [],
        errors: [],
      }));

      return;
    }

    // Submit exposed code
    const result = yield call(TrackingManager.exposed, code);

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
    yield put(accountActions.setErrors([]));

    // Stop tracing
    yield call(TrackingManager.removeUpdateEventListener);
    yield put(accountActions.setTrackingEnabled(false));

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

export function* switchTracking() {
  const trackingEnabled = yield select(isTrackingEnabled);
  if (trackingEnabled) {
    yield put(accountActions.stopTracking());
    yield put(accountActions.setTrackingEnabled(false));
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

      // Set tracking deactivated
      yield put(accountActions.setTrackingEnabled(false));
      return;
    }
  }

  // Start tracking manager
  if (Configuration.UI) {
    yield put(accountActions.setTrackingEnabled(true));
  } else {
    yield put(accountActions.startTracking());
    const { payload } = yield take(accountTypes.START_TRACKING_RESULT);

    if (payload === TRACKING_RESULTS.SUCCESS) {
      // Set tracking activated
      yield put(accountActions.setTrackingEnabled(true));
    } else {
      yield put(accountActions.setTrackingEnabled(false));
    }
  }
}

export function* updateStatus({ payload: status }) {
  // Check if user has been exposed
  if (status.infectionStatus === INFECTION_STATUS.EXPOSED) {
    const { exposureDays = [] } = status;

    // Get last exposure day
    if (exposureDays.length > 0) {
      const { exposedDate } = exposureDays[exposureDays.length - 1];

      // Check if has passed 15 days after last exposure
      const fifteenDaysAgo = Moment().startOf('day').subtract(15, 'days');
      if (Moment(exposedDate).isBefore(fifteenDaysAgo)) {
        yield call(TrackingManager.resetInfectionStatus);
      }
    }
  }

  // Check GAEN toggle
  if (status.errors.includes(ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED)) {
    yield put(accountActions.setTrackingEnabled(false));
  } else {
    const isTracingEnabled = yield call(TrackingManager.isTracingEnabled);

    if (isTracingEnabled) {
      yield put(accountActions.setTrackingEnabled(true));
    }
  }

  // Update redux store
  yield put(accountActions.setStatus(status));
}

export function* setErrors({ payload: errors }) {
  const status = yield select(getStatus);

  yield put(accountActions.setStatus({
    ...status,
    errors,
  }));
}

export function* setInfectionStatus({ payload: infectionStatus }) {
  const status = yield select(getStatus);

  yield put(accountActions.setStatus({
    ...status,
    infectionStatus,
  }));
}

export function* updateLanguage({ payload: languageTag }) {
  const language = i18n.setI18nConfig(languageTag);
  yield put(accountActions.setLanguage(language));
  SplashScreen.show();
  RNRestart.Restart();
}

export function* enableExposureNotifications() {
  yield put(accountActions.startTracking());
  const { payload } = yield take(accountTypes.START_TRACKING_RESULT);

  if (payload !== TRACKING_RESULTS.SUCCESS) {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings://');
    }
  }
}

function* watchSetupNewAccount() {
  yield takeLatest(accountTypes.SETUP_NEW_ACCOUNT_REQUEST, setupNewAccount);
}

function* watchStartTracking() {
  yield takeLatest(accountTypes.START_TRACKING, startTracking);
}

function* watchSubmitDiagnosisRequests() {
  yield takeLatest(accountTypes.SUBMIT_DIAGNOSIS_REQUEST, submitDiagnosis);
}

function* watchSwitchTracking() {
  yield takeLatest(accountTypes.SWITCH_TRACKING, switchTracking);
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

function* watchenableExposureNotifications() {
  yield takeLatest(accountTypes.ENABLE_EXPOSURE_NOTIFICATIONS, enableExposureNotifications);
}

export default function* root() {
  yield fork(watchSetupNewAccount);
  yield fork(watchStartTracking);
  yield fork(watchSubmitDiagnosisRequests);
  yield fork(watchSwitchTracking);
  yield fork(watchUpdateStatus);
  yield fork(watchSetErrors);
  yield fork(watchSetInfectionStatus);
  yield fork(watchUpdateLanguage);
  yield fork(watchenableExposureNotifications);
}
