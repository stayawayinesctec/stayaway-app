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

const types = mirrorCreator([
  'STARTUP',
  'SET_APP_LAUNCHED',
  'SET_UNSUPPORTED',
]);

const creators = createActions(
  types.STARTUP,
  types.SET_APP_LAUNCHED,
  types.SET_UNSUPPORTED,
);

export const initialState = {
  launched: false,
  unsupported: false,
};

export const reducer = handleActions(
  {
    [types.SET_APP_LAUNCHED]: (state, { payload: launched }) =>
      Object.freeze({
        ...state,
        launched,
      }),
    [types.SET_UNSUPPORTED]: (state, { payload: unsupported }) =>
      Object.freeze({
        ...state,
        unsupported,
      }),
  },
  initialState,
);

export const startupTypes = types;

export default creators;
