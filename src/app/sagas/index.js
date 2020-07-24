/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { call, fork } from 'redux-saga/effects';

// Sagas
import startupSagas from '@app/sagas/startup';
import accountSagas from '@app/sagas/account';
import servicesSagas from '@app/sagas/services';
import permissionsSagas from '@app/sagas/permissions';

export function* watch() {
  yield fork(startupSagas);
  yield fork(accountSagas);
  yield fork(servicesSagas);
  yield fork(permissionsSagas);
}

export default function* root() {
  try {
    yield call(watch);
  } catch (error) {
    console.log(error);
  }
}
