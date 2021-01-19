/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { take, select, takeLatest, put, call, fork, delay } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Platform, AppState } from 'react-native';

import Storage from '@app/services/storage';
import Configuration from '@app/services/configuration';
import i18n from '@app/services/i18n';
import TracingManager, { ERRORS } from '@app/services/tracing';

import modalsActions, { modalsTypes } from '@app/redux/modals';
import { isProtectorModalOpen } from '@app/redux/modals/selectors';
import startupActions, { startupTypes } from '@app/redux/startup';
import accountActions, { accountTypes, TRACING_RESULTS } from '@app/redux/account';
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

    // Check if has previous theme configuration
    const hasTheme = yield call([Storage, 'hasItem'], 'theme');

    if (hasTheme) {
      const theme = yield call([Storage, 'getItem'], 'theme');
      yield put(accountActions.setTheme(theme));
    }

    // Check if OS version is supported
    if (Platform.OS === 'ios') {
      const isSupported = yield call(TracingManager.isENSupported);

      if (! isSupported) {
        // Navigate to unsupported screen
        yield put(startupActions.setUnsupported(true));
        return;
      }
    }

    // Check if has previous configuration
    const hasSignUpDate = yield call([Storage, 'hasItem'], 'signup_date');

    if (! hasSignUpDate) {
      // Navigate to onboarding
      yield put(onboardingActions.setOnboarding(true));
      return;
    }

    // Check if tracing was enabled
    const isTracingEnabled = yield call(TracingManager.isTracingEnabled);

    // Get previous stored state
    const signUpDate = yield call([Storage, 'getItem'], 'signup_date', '');
    const status = JSON.parse(yield call([Storage, 'getItem'], 'status', '{}'));

    // Update account redux
    yield put(accountActions.setSignUpDate(signUpDate));
    yield put(accountActions.updateStatus(status));

    // Navigate to home
    yield put(onboardingActions.setOnboarding(false));

    // Check if is UI mode
    if (Configuration.UI) {
      const tracing = yield call([Storage, 'getItem'], 'tracing_enabled', 'false');
      yield put(accountActions.setTracingEnabled(tracing === 'true'));
      yield put(accountActions.startTracing());
      return;
    }

    // Check if tracing was enabled
    if (! isTracingEnabled) {
      // Set tracing deactivated
      yield put(accountActions.setTracingEnabled(false));
      return;
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
          const isProtectorOpen = yield select(isProtectorModalOpen);
          if (isProtectorOpen) {
            yield delay(200);
            yield put(modalsActions.closeProtectorModal());
            yield take(modalsTypes.PROTECTOR_MODAL_CLOSED);
          }

          try {
            if (! Configuration.UI) {
              yield call(TracingManager.sync);

              // Get status
              const status = yield call(TracingManager.getStatus);
              yield put(accountActions.updateStatus(status));
            }
          } catch (error) {
            // Sync error. Probably exposure check limit reached.
            console.log(error);
          }
        } else if (nextState === 'inactive') {
          const isProtectorOpen = yield select(isProtectorModalOpen);
          if (! isProtectorOpen) {
            yield put(modalsActions.openProtectorModal());
            yield take(modalsTypes.PROTECTOR_MODAL_OPEN);
          }
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
