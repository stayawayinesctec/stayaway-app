/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { takeLatest, put, call, fork } from 'redux-saga/effects';
import { Platform } from 'react-native';
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';

import permissionsActions, {
  NOTIFICATIONS_PERMISSION,
  BATTERY_PERMISSION,
  permissionsTypes,
} from '@app/redux/permissions';

import TrackingManager from '@app/services/tracking';

export function* checkNotificationsPermission() {
  const { status } = yield call(checkNotifications);

  return status;
}

export function* checkBatteryPermission() {
  const result = yield call(TrackingManager.isIgnoringBatteryOptimizationsPermission);

  if (result) {
    return RESULTS.GRANTED;
  }

  return RESULTS.DENIED;
}

export function* checkPermission({ payload: permission }) {
  if (permission === NOTIFICATIONS_PERMISSION) {
    // Request notifications permission
    const notificationsResult = yield call(checkNotificationsPermission);

    if (notificationsResult === RESULTS.GRANTED) {
      yield put(permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION));
    } else {
      yield put(permissionsActions.permissionDenied(NOTIFICATIONS_PERMISSION));
    }

    return;
  }

  if (permission === BATTERY_PERMISSION) {
    // Request battery permission
    const batteryResult = yield call(checkBatteryPermission);

    if (batteryResult === RESULTS.GRANTED) {
      yield put(permissionsActions.permissionGranted(BATTERY_PERMISSION));
    } else {
      yield put(permissionsActions.permissionDenied(BATTERY_PERMISSION));
    }
  }
}

export function* checkAllPermissions() {
  if (Platform.OS === 'ios') {
    // Request notifications permission
    const notificationsResult = yield call(checkNotificationsPermission);

    if (notificationsResult === RESULTS.GRANTED) {
      yield put(permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION));
    } else {
      yield put(permissionsActions.permissionDenied(NOTIFICATIONS_PERMISSION));
      yield put(permissionsActions.checkAllPermissionsResult(false));
      return;
    }
  } else {
    // Request battery permission
    const batteryResult = yield call(checkBatteryPermission);

    if (batteryResult === RESULTS.GRANTED) {
      yield put(permissionsActions.permissionGranted(BATTERY_PERMISSION));
    } else {
      yield put(permissionsActions.permissionDenied(BATTERY_PERMISSION));
      yield put(permissionsActions.checkAllPermissionsResult(false));
      return;
    }
  }

  yield put(permissionsActions.checkAllPermissionsResult(true));
}

export function* requestNotificationsPermission() {
  const { status } = yield call(requestNotifications, ['alert', 'badge', 'sound']);

  return status;
}

export function* requestBatteryPermission() {
  try {
    if (! (yield call(TrackingManager.isIgnoringBatteryOptimizationsPermission))) {
        yield call(TrackingManager.requestIgnoreBatteryOptimizationsPermission);
    }

    return RESULTS.GRANTED;
  } catch (error) {
    return RESULTS.DENIED;
  }
}

export function* requestPermission({ payload: permission }) {
  if (permission === NOTIFICATIONS_PERMISSION) {
    // Request notifications permission
    const notificationsResult = yield call(requestNotificationsPermission);

    if (notificationsResult === RESULTS.GRANTED) {
      yield put(permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION));
    } else {
      yield put(permissionsActions.permissionDenied(NOTIFICATIONS_PERMISSION));
    }

    return;
  }

  if (permission === BATTERY_PERMISSION) {
    // Request battery permission
    const batteryResult = yield call(requestBatteryPermission);

    if (batteryResult === RESULTS.GRANTED) {
      yield put(permissionsActions.permissionGranted(BATTERY_PERMISSION));
    } else {
      yield put(permissionsActions.permissionDenied(BATTERY_PERMISSION));
    }
  }
}

export function* requestAllPermissions() {
  if (Platform.OS === 'ios') {
    // Request notifications permission
    const notificationsResult = yield call(requestNotificationsPermission);

    if (notificationsResult === RESULTS.GRANTED) {
      yield put(permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION));
    } else {
      yield put(permissionsActions.permissionDenied(NOTIFICATIONS_PERMISSION));
      yield put(permissionsActions.requestAllPermissionsResult(false));
      return;
    }
  } else {
    // Request battery permission
    const batteryResult = yield call(requestBatteryPermission);

    if (batteryResult === RESULTS.GRANTED) {
      yield put(permissionsActions.permissionGranted(BATTERY_PERMISSION));
    } else {
      yield put(permissionsActions.permissionDenied(BATTERY_PERMISSION));
      yield put(permissionsActions.requestAllPermissionsResult(false));
      return;
    }
  }

  yield put(permissionsActions.requestAllPermissionsResult(true));
}

export function* watchCheckPermission() {
  yield takeLatest(permissionsTypes.CHECK_PERMISSION, checkPermission);
}

export function* watchCheckAllPermissions() {
  yield takeLatest(permissionsTypes.CHECK_ALL_PERMISSIONS, checkAllPermissions);
}

export function* watchRequestPermission() {
  yield takeLatest(permissionsTypes.REQUEST_PERMISSION, requestPermission);
}

export function* watchRequestAllPermissions() {
  yield takeLatest(permissionsTypes.REQUEST_ALL_PERMISSIONS, requestAllPermissions);
}

export default function* root() {
  yield fork(watchCheckPermission);
  yield fork(watchCheckAllPermissions);
  yield fork(watchRequestPermission);
  yield fork(watchRequestAllPermissions);
}
