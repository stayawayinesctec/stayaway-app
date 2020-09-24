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

export const TRACKING_RESULTS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  GAEN: 'GAEN',
};

const types = mirrorCreator([
  'SET_SIGN_UP_DATE',
  'SET_TRACKING_ENABLED',
  'SET_STATUS',
  'SET_ERRORS',
  'SET_INFECTION_STATUS',
  'SET_LANGUAGE',
  'ENABLE_EXPOSURE_NOTIFICATIONS',
  'UPDATE_STATUS',
  'UPDATE_LANGUAGE',
  'SETUP_NEW_ACCOUNT_REQUEST',
  'SETUP_NEW_ACCOUNT_PENDING',
  'SETUP_NEW_ACCOUNT_ERROR',
  'SETUP_NEW_ACCOUNT_DONE',
  'START_TRACKING',
  'START_TRACKING_RESULT',
  'STOP_TRACKING',
  'STOP_TRACKING_RESULT',
  'SUBMIT_DIAGNOSIS_REQUEST',
  'SUBMIT_DIAGNOSIS_PENDING',
  'SUBMIT_DIAGNOSIS_ERROR',
  'SUBMIT_DIAGNOSIS_DONE',
  'SWITCH_TRACKING',
  'TRACKING_STATUS_LISTENER_REGISTERED',
]);

export const creators = createActions(
  types.SET_SIGN_UP_DATE,
  types.SET_TRACKING_ENABLED,
  types.SET_STATUS,
  types.SET_ERRORS,
  types.SET_INFECTION_STATUS,
  types.SET_LANGUAGE,
  types.ENABLE_EXPOSURE_NOTIFICATIONS,
  types.UPDATE_STATUS,
  types.UPDATE_LANGUAGE,
  types.SETUP_NEW_ACCOUNT_REQUEST,
  types.SETUP_NEW_ACCOUNT_PENDING,
  types.SETUP_NEW_ACCOUNT_DONE,
  types.START_TRACKING,
  types.START_TRACKING_RESULT,
  types.STOP_TRACKING,
  types.STOP_TRACKING_RESULT,
  types.SUBMIT_DIAGNOSIS_REQUEST,
  types.SUBMIT_DIAGNOSIS_PENDING,
  types.SUBMIT_DIAGNOSIS_ERROR,
  types.SUBMIT_DIAGNOSIS_DONE,
  types.SWITCH_TRACKING,
  types.TRACKING_STATUS_LISTENER_REGISTERED,
);

export const initialState = {
  signUpDate: '',
  trackingEnabled: false,
  status: {},
  settingUpNewAccount: {
    loading: false,
  },
  submittingDiagnosis: {
    loading: false,
    error: '',
  },
  language: {},
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
    [types.SET_TRACKING_ENABLED]: (state, { payload: trackingEnabled }) => {
      Storage.setItem('tracking_enabled', trackingEnabled.toString());

      return Object.freeze({
        ...state,
        trackingEnabled,
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
