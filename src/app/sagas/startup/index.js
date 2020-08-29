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

import startupActions, { startupTypes } from '@app/redux/startup';
import accountActions, { accountTypes, START_TRACKING_RESULTS } from '@app/redux/account';
import onboardingActions from '@app/redux/onboarding';
import { isOnboarding } from '@app/redux/onboarding/selectors';

function* startup() {
  try {
    // Set i18 initial config
    i18n.setI18nConfig();

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

      if (payload === START_TRACKING_RESULTS.SUCCESS) {
        // Set tracking activated
        yield put(accountActions.setTrackingEnabled(true));
      } else if (payload === START_TRACKING_RESULTS.GAEN) {
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
    let previousState = '';

    while (true) {
      const nextState = yield take(channel);
      const onboarding = yield select(isOnboarding);

      if (previousState !== nextState) {
        if (onboarding || Configuration.UI) {
          return;
        }

        if (nextState === 'active') {
          yield call(TrackingManager.sync);
          const status = yield call(TrackingManager.getStatus);
          console.log(status);

          // Update redux store
          yield put(accountActions.updateStatus(status));
        }

        previousState = nextState;
      }
    }
  } finally {
    channel.close();
  }
}

export default function* root() {
  yield fork(watchStartup);
  yield fork(watchAppStateChange);
}
