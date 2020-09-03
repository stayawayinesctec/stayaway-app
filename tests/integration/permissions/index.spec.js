import { runSaga } from 'redux-saga';
import { put, take } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { RESULTS } from 'react-native-permissions';

import {
  checkNotificationsPermission,
  checkBatteryPermission,
  checkPermission,
  checkAllPermissions,
  requestNotificationsPermission,
  requestBatteryPermission,
  requestPermission,
  requestAllPermissions,
} from '@app/sagas/permissions';

import permissionsActions, {
  NOTIFICATIONS_PERMISSION,
  BATTERY_PERMISSION,
} from '@app/redux/permissions';

describe('Permissions Sagas', () => {
  it('check notifications permission should return granted', async () => {
    // Execute
    const dispatched = [];
    const result = await runSaga({
      dispatch: (action) => dispatched.push(action),
    }, checkNotificationsPermission);

    // Assert
    expect(result.result()).toBe(RESULTS.GRANTED);
  });
  it('check battery permission should return granted', async () => {
    // Execute
    const dispatched = [];
    const result = await runSaga({
      dispatch: (action) => dispatched.push(action),
    }, checkBatteryPermission);

    // Assert
    expect(result.result()).toBe(RESULTS.GRANTED);
  });
  describe('check permission should return granted', () => {
    it('when called with notifications permission', async () => {
      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkPermission, { payload: NOTIFICATIONS_PERMISSION});

      // Assert
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION)]);
    });
    it('when called with battery permission', async () => {
      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkPermission, { payload: BATTERY_PERMISSION});

      // Assert
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([permissionsActions.permissionGranted(BATTERY_PERMISSION)]);
    });
  });
  it('check all permissions should return battery permission granted', async () => {
    // Execute
    const dispatched = [];
    await runSaga({
      dispatch: (action) => dispatched.push(action),
    }, checkAllPermissions);

    // Assert
    expect(dispatched).toHaveLength(2);
    expect(dispatched).toEqual([
      permissionsActions.permissionGranted(BATTERY_PERMISSION),
      permissionsActions.checkAllPermissionsResult(true),
    ]);
  });
  it('request notifications permission should return granted', async () => {
    // Execute
    const dispatched = [];
    const result = await runSaga({
      dispatch: (action) => dispatched.push(action),
    }, requestNotificationsPermission);

    // Assert
    expect(result.result()).toBe(RESULTS.GRANTED);
  });
  it('request battery permission should return granted', async () => {
    // Execute
    const dispatched = [];
    const result = await runSaga({
      dispatch: (action) => dispatched.push(action),
    }, requestBatteryPermission);

    // Assert
    expect(result.result()).toBe(RESULTS.GRANTED);
  });
  describe('request permission should return granted', () => {
    it('when called with notifications permission', async () => {
      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestPermission, { payload: NOTIFICATIONS_PERMISSION});

      // Assert
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION)]);
    });
    it('when called with battery permission', async () => {
      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestPermission, { payload: BATTERY_PERMISSION});

      // Assert
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([permissionsActions.permissionGranted(BATTERY_PERMISSION)]);
    });
  });
  it('request all permissions should return battery permission granted', async () => {
    // Execute
    const dispatched = [];
    await runSaga({
      dispatch: (action) => dispatched.push(action),
    }, requestAllPermissions);

    // Assert
    expect(dispatched).toHaveLength(2);
    expect(dispatched).toEqual([
      permissionsActions.permissionGranted(BATTERY_PERMISSION),
      permissionsActions.requestAllPermissionsResult(true),
    ]);
  });
});
