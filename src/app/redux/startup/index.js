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
]);

const creators = createActions(
  types.STARTUP,
  types.SET_APP_LAUNCHED,
);

export const initialState = {
  launched: false,
};

export const reducer = handleActions(
  {
    [types.SET_APP_LAUNCHED]: (state, { payload: launched }) =>
      Object.freeze({
        ...state,
        launched,
      }),
  },
  initialState,
);

export const startupTypes = types;

export default creators;
