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
  'SET_NETWORK_STATUS',
  'REGISTER_LISTENERS',
  'LISTENERS_REGISTERED',
  'BLUETOOTH_LISTENER_REGISTERED',
  'LOCATION_LISTENER_REGISTERED',
  'NETWORK_LISTENER_REGISTERED',
  'BATTERY_OPTIMIZATION_LISTENER_REGISTERED',
]);

const creators = createActions(
  types.SET_NETWORK_STATUS,
  types.REGISTER_LISTENERS,
  types.LISTENERS_REGISTERED,
  types.BLUETOOTH_LISTENER_REGISTERED,
  types.LOCATION_LISTENER_REGISTERED,
  types.NETWORK_LISTENER_REGISTERED,
  types.BATTERY_OPTIMIZATION_LISTENER_REGISTERED,
);

export const initialState = {
  network: false,
};

export const reducer = handleActions(
  {
      [types.SET_NETWORK_STATUS]: (state, { payload: network }) =>
      Object.freeze({
        ...state,
        network,
      }),
  },
  initialState,
);

export const servicesTypes = types;

export default creators;
