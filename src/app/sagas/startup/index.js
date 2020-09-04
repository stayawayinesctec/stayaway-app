/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { take, select, takeLatest, put, call, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { AppState, Platform } from 'react-native';

import Storage from '@app/services/storage';
import Configuration from '@app/services/configuration';
import TrackingManager, { ERRORS } from '@app/services/tracking';
import i18n from '@app/services/i18n';

import modalsActions, { modalsTypes } from '@app/redux/modals';
import startupActions, { startupTypes } from '@app/redux/startup';
import accountActions, { accountTypes, TRACKING_RESULTS } from '@app/redux/account';
import onboardingActions from '@app/redux/onboarding';
import { isOnboarding } from '@app/redux/onboarding/selectors';

export function* startup() {
  try {
    // Check if has previous language configuration
    const hasLanguage = yield call([Storage, 'hasItem'], 'language');

    if (hasLanguage) {
      const languageTag = yield call([Storage, 'getItem'], 'language');
      const language = i18n.setI18nConfig(languageTag);
      yield put(accountActions.setLanguage(language));
    } else {
      const language = i18n.setDefaultI18nConfig();
      yield put(accountActions.setLanguage(language));
    }

    // Check if has previous configuration
    const hasSignUpDate = yield call([Storage, 'hasItem'], 'signup_date');

    if (! hasSignUpDate) {
      // Navigate to onboarding
      yield put(onboardingActions.setOnboarding(true));
      return;
    }

    // Get previous stored state
    const trackingEnabled = yield call([Storage, 'getItem'], 'tracking_enabled', 'false');
    const signUpDate = yield call([Storage, 'getItem'], 'signup_date', '');
    const status = JSON.parse(yield call([Storage, 'getItem'], 'status', '{}'));

    // Update account redux
    yield put(accountActions.setSignUpDate(signUpDate));
    yield put(accountActions.updateStatus(status));

    // Navigate to home
    yield put(onboardingActions.setOnboarding(false));

    // Check if tracking was enabled
    if (trackingEnabled !== 'true') {
      // Set tracking deactivated
      yield put(accountActions.setTrackingEnabled(false));
      return;
    }

    if (Configuration.UI) {
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
  } finally {
    // Set app launched
    yield put(startupActions.setAppLaunched(true));
  }
}

function* watchStartup() {
  yield takeLatest(startupTypes.STARTUP, startup);
}

function* watchAppStateChange() {
  const channel = eventChannel((emitter) => {
    AppState.addEventListener('change', emitter);
    return () => AppState.removeEventListener('change', emitter);
  });

  try {
    let previousState = 'unknown';

    while (true) {
      const nextState = yield take(channel);
      const onboarding = yield select(isOnboarding);

      if (! onboarding && previousState !== nextState) {
        if (nextState === 'active') {
          yield put(modalsActions.closeProtectorModal());
          yield take(modalsTypes.PROTECTOR_MODAL_CLOSED);

          try {
            if (! Configuration.UI) {
              yield call(TrackingManager.sync);

              // Get status
              const status = yield call(TrackingManager.getStatus);
              yield put(accountActions.updateStatus(status));
            }
          } catch (error) {
            // Sync error. Probably exposure check limit reached.
            console.log(error);
          }
        } else if (nextState === 'inactive') {
          yield put(modalsActions.openProtectorModal());
          yield take(modalsTypes.PROTECTOR_MODAL_OPEN);
        }
      }

      previousState = nextState;
    }
  } finally {
    channel.close();
  }
}

export default function* root() {
  yield fork(watchStartup);
  yield fork(watchAppStateChange);
}
