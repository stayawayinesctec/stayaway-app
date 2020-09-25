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
  'OPEN_NETWORK_MODAL',
  'NETWORK_MODAL_OPEN',
  'CLOSE_NETWORK_MODAL',
  'NETWORK_MODAL_CLOSED',
  'OPEN_SERVER_ERROR_MODAL',
  'SERVER_ERROR_MODAL_OPEN',
  'CLOSE_SERVER_ERROR_MODAL',
  'SERVER_ERROR_MODAL_CLOSED',
  'OPEN_TOO_MUCH_REQUESTS_MODAL',
  'TOO_MUCH_REQUESTS_MODAL_OPEN',
  'CLOSE_TOO_MUCH_REQUESTS_MODAL',
  'TOO_MUCH_REQUESTS_MODAL_CLOSED',
  'OPEN_INVALID_CODE_MODAL',
  'INVALID_CODE_MODAL_OPEN',
  'CLOSE_INVALID_CODE_MODAL',
  'INVALID_CODE_MODAL_CLOSED',
  'OPEN_EXPIRED_CODE_MODAL',
  'EXPIRED_CODE_MODAL_OPEN',
  'CLOSE_EXPIRED_CODE_MODAL',
  'EXPIRED_CODE_MODAL_CLOSED',
  'OPEN_LOADING_MODAL',
  'LOADING_MODAL_OPEN',
  'CLOSE_LOADING_MODAL',
  'LOADING_MODAL_CLOSED',
  'OPEN_PROTECTOR_MODAL',
  'PROTECTOR_MODAL_OPEN',
  'CLOSE_PROTECTOR_MODAL',
  'PROTECTOR_MODAL_CLOSED',
]);

const creators = createActions(
  types.OPEN_NETWORK_MODAL,
  types.NETWORK_MODAL_OPEN,
  types.CLOSE_NETWORK_MODAL,
  types.NETWORK_MODAL_CLOSED,
  types.OPEN_SERVER_ERROR_MODAL,
  types.SERVER_ERROR_MODAL_OPEN,
  types.CLOSE_SERVER_ERROR_MODAL,
  types.SERVER_ERROR_MODAL_CLOSED,
  types.OPEN_TOO_MUCH_REQUESTS_MODAL,
  types.TOO_MUCH_REQUESTS_MODAL_OPEN,
  types.CLOSE_TOO_MUCH_REQUESTS_MODAL,
  types.TOO_MUCH_REQUESTS_MODAL_CLOSED,
  types.OPEN_INVALID_CODE_MODAL,
  types.INVALID_CODE_MODAL_OPEN,
  types.CLOSE_INVALID_CODE_MODAL,
  types.INVALID_CODE_MODAL_CLOSED,
  types.OPEN_EXPIRED_CODE_MODAL,
  types.EXPIRED_CODE_MODAL_OPEN,
  types.CLOSE_EXPIRED_CODE_MODAL,
  types.EXPIRED_CODE_MODAL_CLOSED,
  types.OPEN_LOADING_MODAL,
  types.LOADING_MODAL_OPEN,
  types.CLOSE_LOADING_MODAL,
  types.LOADING_MODAL_CLOSED,
  types.OPEN_PROTECTOR_MODAL,
  types.PROTECTOR_MODAL_OPEN,
  types.CLOSE_PROTECTOR_MODAL,
  types.PROTECTOR_MODAL_CLOSED,
);

export const initialState = {
  network: false,
  server_error: false,
  too_much_requests: false,
  invalid_code: false,
  expired_code: false,
  loading: false,
  protector: false,
};

export const reducer = handleActions(
  {
    [types.OPEN_NETWORK_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: true,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.CLOSE_NETWORK_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.OPEN_SERVER_ERROR_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: true,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.CLOSE_SERVER_ERROR_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.OPEN_TOO_MUCH_REQUESTS_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: true,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.CLOSE_TOO_MUCH_REQUESTS_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.OPEN_INVALID_CODE_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: true,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.CLOSE_INVALID_CODE_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.OPEN_EXPIRED_CODE_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: true,
        loading: false,
        protector: false,
      }),
    [types.CLOSE_EXPIRED_CODE_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
    [types.OPEN_LOADING_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: true,
        protector: false,
      }),
    [types.CLOSE_LOADING_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
      [types.OPEN_PROTECTOR_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: true,
      }),
    [types.CLOSE_PROTECTOR_MODAL]: (state) =>
      Object.freeze({
        ...state,
        network: false,
        server_error: false,
        too_much_requests: false,
        invalid_code: false,
        expired_code: false,
        loading: false,
        protector: false,
      }),
  },
  initialState,
);

export const modalsTypes = types;

export default creators;
