/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { take, takeLatest, put, call, fork, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import NetInfo from "@react-native-community/netinfo";

import modalsActions from '@app/redux/modals';
import { isNetworkModalOpen } from '@app/redux/modals/selectors';
import servicesActions, { servicesTypes } from '@app/redux/services';

function* watchNetwork() {
  // Get initial value
  const { isConnected: networkOn } = yield call([NetInfo, 'fetch']);
  yield put(servicesActions.setNetworkStatus(networkOn));

  // Set event listener value
  const channel = eventChannel((emitter) => {
    return NetInfo.addEventListener(emitter);
  });

  try {
    yield put(servicesActions.networkListenerRegistered());

    while (true) {
      const { isConnected: connected } = yield take(channel);
      yield put(servicesActions.setNetworkStatus(connected));

      // If connected and network modal open, dismiss it
      const networkOpen = yield select(isNetworkModalOpen);
      if (connected && networkOpen) {
        yield put(modalsActions.setNetworkModal(false));
      }
    }
  } finally {
    channel.close();
  }
}

function* registerListeners() {
  // Shared watchers
  const watchers = [
    fork(watchNetwork),
  ];

  // Shared listeners
  const listeners = [
    take(servicesTypes.NETWORK_LISTENER_REGISTERED),
  ];

  // Register watchers
  yield all(watchers);

  // Wait for listeners to be setuped
  yield all(listeners);

  yield put(servicesActions.listenersRegistered());
}

function* watchRegisterListeners() {
  yield takeLatest(servicesTypes.REGISTER_LISTENERS, registerListeners);
}

export default function* root() {
  yield fork(watchRegisterListeners);
}
