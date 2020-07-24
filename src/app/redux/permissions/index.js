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
import mirrorCreator from 'mirror-creator';
import { createActions, handleActions } from 'redux-actions';

export const BATTERY_PERMISSION = 'battery';
export const NOTIFICATIONS_PERMISSION = 'notifications';

const types = mirrorCreator([
  'CHECK_PERMISSION',
  'CHECK_ALL_PERMISSIONS',
  'CHECK_ALL_PERMISSIONS_RESULT',
  'REQUEST_PERMISSION',
  'REQUEST_ALL_PERMISSIONS',
  'REQUEST_ALL_PERMISSIONS_RESULT',
  'PERMISSION_GRANTED',
  'PERMISSION_DENIED',
  'ALL_PERMISSIONS_GRANTED',
]);

const creators = createActions(
  types.CHECK_PERMISSION,
  types.CHECK_ALL_PERMISSIONS,
  types.CHECK_ALL_PERMISSIONS_RESULT,
  types.REQUEST_PERMISSION,
  types.REQUEST_ALL_PERMISSIONS,
  types.REQUEST_ALL_PERMISSIONS_RESULT,
  types.PERMISSION_GRANTED,
  types.PERMISSION_DENIED,
  types.ALL_PERMISSIONS_GRANTED,
);

export const initialState = {
  ...Platform.select({
    ios: {
      [NOTIFICATIONS_PERMISSION]: false,
    },
    android: {
      [BATTERY_PERMISSION]: false,
    },
  }),
};

export const reducer = handleActions(
  {
    [types.PERMISSION_GRANTED]: (state, { payload: name}) =>
      Object.freeze({
        ...state,
        [name]: true,
      }),
    [types.PERMISSION_DENIED]: (state, { payload: name}) =>
      Object.freeze({
        ...state,
        [name]: false,
      }),
  },
  initialState,
);

export const permissionsTypes = types;

export default creators;
