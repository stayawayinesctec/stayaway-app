/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import mirrorCreator from 'mirror-creator';
import { createActions, handleActions } from 'redux-actions';

import Storage from '@app/services/storage';

import { AUTO } from '@app/common/theme';

export const TRACING_RESULTS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  GAEN: 'GAEN',
};

const types = mirrorCreator([
  'SET_SIGN_UP_DATE',
  'SET_TRACING_ENABLED',
  'SET_STATUS',
  'SET_ERRORS',
  'SET_INFECTION_STATUS',
  'SET_LANGUAGE',
  'SET_THEME',
  'ENABLE_EXPOSURE_NOTIFICATIONS',
  'UPDATE_STATUS',
  'UPDATE_STATUS_RESULT',
  'UPDATE_LANGUAGE',
  'SETUP_NEW_ACCOUNT_REQUEST',
  'SETUP_NEW_ACCOUNT_PENDING',
  'SETUP_NEW_ACCOUNT_ERROR',
  'SETUP_NEW_ACCOUNT_DONE',
  'START_TRACING',
  'START_TRACING_RESULT',
  'STOP_TRACING',
  'STOP_TRACING_RESULT',
  'SUBMIT_DIAGNOSIS_REQUEST',
  'SUBMIT_DIAGNOSIS_PENDING',
  'SUBMIT_DIAGNOSIS_ERROR',
  'SUBMIT_DIAGNOSIS_DONE',
  'SWITCH_TRACING',
  'TRACING_STATUS_LISTENER_REGISTERED',
  'REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
]);

export const creators = createActions(
  types.SET_SIGN_UP_DATE,
  types.SET_TRACING_ENABLED,
  types.SET_STATUS,
  types.SET_ERRORS,
  types.SET_INFECTION_STATUS,
  types.SET_LANGUAGE,
  types.SET_THEME,
  types.ENABLE_EXPOSURE_NOTIFICATIONS,
  types.UPDATE_STATUS,
  types.UPDATE_STATUS_RESULT,
  types.UPDATE_LANGUAGE,
  types.SETUP_NEW_ACCOUNT_REQUEST,
  types.SETUP_NEW_ACCOUNT_PENDING,
  types.SETUP_NEW_ACCOUNT_DONE,
  types.START_TRACING,
  types.START_TRACING_RESULT,
  types.STOP_TRACING,
  types.STOP_TRACING_RESULT,
  types.SUBMIT_DIAGNOSIS_REQUEST,
  types.SUBMIT_DIAGNOSIS_PENDING,
  types.SUBMIT_DIAGNOSIS_ERROR,
  types.SUBMIT_DIAGNOSIS_DONE,
  types.SWITCH_TRACING,
  types.TRACING_STATUS_LISTENER_REGISTERED,
  types.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
);

export const initialState = {
  signUpDate: '',
  tracingEnabled: false,
  status: {},
  settingUpNewAccount: {
    loading: false,
  },
  submittingDiagnosis: {
    loading: false,
    error: '',
  },
  language: {},
  theme: AUTO,
};

export const reducer = handleActions(
  {
    [types.SET_SIGN_UP_DATE]: (state, { payload: signUpDate }) => {
      Storage.setItem('signup_date', signUpDate);

      return Object.freeze({
        ...state,
        signUpDate,
      });
    },
    [types.SET_TRACING_ENABLED]: (state, { payload: tracingEnabled }) => {
      Storage.setItem('tracing_enabled', tracingEnabled.toString());

      return Object.freeze({
        ...state,
        tracingEnabled,
      });
    },
    [types.SET_STATUS]: (state, { payload: status }) => {
      Storage.setItem('status', JSON.stringify(status));

      return Object.freeze({
        ...state,
        status,
      });
    },
    [types.SET_LANGUAGE]: (state, { payload: language }) => {
      Storage.setItem('language', language.languageTag);

      return Object.freeze({
        ...state,
        language,
      });
    },
    [types.SET_THEME]: (state, { payload: theme }) => {
      Storage.setItem('theme', theme);

      return Object.freeze({
        ...state,
        theme,
      });
    },
    [types.SUBMIT_DIAGNOSIS_PENDING]: (state) => (
      Object.freeze({
        ...state,
        submittingDiagnosis: {
          loading: true,
          error: '',
        },
      })
    ),
    [types.SUBMIT_DIAGNOSIS_ERROR]: (state, { payload: error }) => (
      Object.freeze({
        ...state,
        submittingDiagnosis: {
          loading: false,
          error,
        },
      })
    ),
    [types.SUBMIT_DIAGNOSIS_DONE]: (state) => (
      Object.freeze({
        ...state,
        submittingDiagnosis: {
          loading: false,
          error: '',
        },
      })
    ),
    [types.SETUP_NEW_ACCOUNT_PENDING]: (state) => (
      Object.freeze({
        ...state,
        settingUpNewAccount: {
          loading: true,
        },
      })
    ),
    [types.SETUP_NEW_ACCOUNT_DONE]: (state) => (
      Object.freeze({
        ...state,
        settingUpNewAccount: {
          loading: false,
        },
      })
    ),
  },
  initialState,
);

export const accountTypes = types;

export default creators;
