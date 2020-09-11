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
import { runSaga } from 'redux-saga';
import { RESULTS, requestNotifications, checkNotifications } from 'react-native-permissions';

import TrackingManager from '@app/services/tracking';

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

// Mock storage file
jest.mock('@app/services/tracking');

describe('Permissions Sagas', () => {
  describe('Check Notifications Permission', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return granted', async () => {
      // Prepare
      checkNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.GRANTED }));

      // Execute
      const dispatched = [];
      const result = await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkNotificationsPermission).toPromise();

      // Assert
      expect(result).toBe(RESULTS.GRANTED);
      expect(checkNotifications).toHaveBeenCalled();
    });
    it('should return denied', async () => {
      // Prepare
      checkNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.DENIED }));

      // Execute
      const dispatched = [];
      const result = await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkNotificationsPermission).toPromise();

      // Assert
      expect(result).toBe(RESULTS.DENIED);
      expect(checkNotifications).toHaveBeenCalled();
    });
  });
  describe('Check Batttery Permission', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return granted', async () => {
      // Prepare
      TrackingManager.isIgnoringBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(true));

      // Execute
      const dispatched = [];
      const result = await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkBatteryPermission).toPromise();

      // Assert
      expect(result).toBe(RESULTS.GRANTED);
      expect(TrackingManager.isIgnoringBatteryOptimizationsPermission).toHaveBeenCalled();
    });

    it('should return denied', async () => {
      // Prepare
      TrackingManager.isIgnoringBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(false));

      // Execute
      const dispatched = [];
      const result = await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkBatteryPermission).toPromise();

      // Assert
      expect(result).toBe(RESULTS.DENIED);
      expect(TrackingManager.isIgnoringBatteryOptimizationsPermission).toHaveBeenCalled();
    });
  });
  describe('Check Permission', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return granted when checking notifications permission', async () => {
      // Prepare
      checkNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.GRANTED }));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkPermission, { payload: NOTIFICATIONS_PERMISSION }).toPromise();

      // Assert
      expect(checkNotifications).toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION),
      ]);
    });
    it('should return denied when checking notifications permission', async () => {
      // Prepare
      checkNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.DENIED }));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkPermission, { payload: NOTIFICATIONS_PERMISSION }).toPromise();

      // Assert
      expect(checkNotifications).toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        permissionsActions.permissionDenied(NOTIFICATIONS_PERMISSION),
      ]);
    });
  });
  describe('Check All Permission', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return check notifications on iOS and return granted', async () => {
      // Prepare
      Platform.OS = 'ios';
      checkNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.GRANTED }));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkAllPermissions).toPromise();

      // Assert
      expect(checkNotifications).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION),
        permissionsActions.checkAllPermissionsResult(true),
      ]);
    });
    it('should return check notifications on iOS and return denied', async () => {
      // Prepare
      Platform.OS = 'ios';
      checkNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.DENIED }));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkAllPermissions).toPromise();

      // Assert
      expect(checkNotifications).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        permissionsActions.permissionDenied(NOTIFICATIONS_PERMISSION),
        permissionsActions.checkAllPermissionsResult(false),
      ]);
    });

    it('should return check battery permission on Android and return granted', async () => {
      // Prepare
      Platform.OS = 'android';
      TrackingManager.isIgnoringBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(true));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkAllPermissions).toPromise();

      // Assert
      expect(TrackingManager.isIgnoringBatteryOptimizationsPermission).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        permissionsActions.permissionGranted(BATTERY_PERMISSION),
        permissionsActions.checkAllPermissionsResult(true),
      ]);
    });
    it('should return check battery permission on Android and return denied', async () => {
      // Prepare
      Platform.OS = 'android';
      TrackingManager.isIgnoringBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(false));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, checkAllPermissions).toPromise();

      // Assert
      expect(TrackingManager.isIgnoringBatteryOptimizationsPermission).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        permissionsActions.permissionDenied(BATTERY_PERMISSION),
        permissionsActions.checkAllPermissionsResult(false),
      ]);
    });
  });
  describe('Request Notifications Permission', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return granted', async () => {
      // Prepare
      requestNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.GRANTED }));

      // Execute
      const dispatched = [];
      const result = await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestNotificationsPermission).toPromise();

      // Assert
      expect(result).toBe(RESULTS.GRANTED);
      expect(requestNotifications).toHaveBeenCalled();
    });
    it('should return denied', async () => {
      // Prepare
      requestNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.DENIED }));

      // Execute
      const dispatched = [];
      const result = await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestNotificationsPermission).toPromise();

      // Assert
      expect(result).toBe(RESULTS.DENIED);
      expect(requestNotifications).toHaveBeenCalled();
    });
  });
  describe('Requet Batttery Permission', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return granted', async () => {
      // Prepare
      TrackingManager.isIgnoringBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(false));
      TrackingManager.requestIgnoreBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(true));

      // Execute
      const dispatched = [];
      const result = await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestBatteryPermission).toPromise();

      // Assert
      expect(result).toBe(RESULTS.GRANTED);
      expect(TrackingManager.isIgnoringBatteryOptimizationsPermission).toHaveBeenCalled();
      expect(TrackingManager.requestIgnoreBatteryOptimizationsPermission).toHaveBeenCalled();
    });

    it('should return denied', async () => {
      // Prepare
      TrackingManager.isIgnoringBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(false));
      TrackingManager.requestIgnoreBatteryOptimizationsPermission.mockImplementation(() => Promise.reject(false));

      // Execute
      const dispatched = [];
      const result = await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestBatteryPermission).toPromise();

      // Assert
      expect(result).toBe(RESULTS.DENIED);
      expect(TrackingManager.isIgnoringBatteryOptimizationsPermission).toHaveBeenCalled();
      expect(TrackingManager.requestIgnoreBatteryOptimizationsPermission).toHaveBeenCalled();
    });
  });
  describe('Request Permission', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return granted when requesting notifications permission', async () => {
      // Prepare
      requestNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.GRANTED }));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestPermission, { payload: NOTIFICATIONS_PERMISSION }).toPromise();

      // Assert
      expect(requestNotifications).toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION),
      ]);
    });
    it('should return denied when requesting notifications permission', async () => {
      // Prepare
      requestNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.DENIED }));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestPermission, { payload: NOTIFICATIONS_PERMISSION }).toPromise();

      // Assert
      expect(requestNotifications).toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        permissionsActions.permissionDenied(NOTIFICATIONS_PERMISSION),
      ]);
    });
  });
  describe('Request All Permission', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return request notifications on iOS and return granted', async () => {
      // Prepare
      Platform.OS = 'ios';
      requestNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.GRANTED }));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestAllPermissions).toPromise();

      // Assert
      expect(requestNotifications).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        permissionsActions.permissionGranted(NOTIFICATIONS_PERMISSION),
        permissionsActions.requestAllPermissionsResult(true),
      ]);
    });
    it('should return request notifications on iOS and return denied', async () => {
      // Prepare
      Platform.OS = 'ios';
      requestNotifications.mockImplementation(() => Promise.resolve({ status: RESULTS.DENIED }));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestAllPermissions).toPromise();

      // Assert
      expect(requestNotifications).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        permissionsActions.permissionDenied(NOTIFICATIONS_PERMISSION),
        permissionsActions.requestAllPermissionsResult(false),
      ]);
    });

    it('should return request battery permission on Android and return granted', async () => {
      // Prepare
      Platform.OS = 'android';
      TrackingManager.isIgnoringBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(false));
      TrackingManager.requestIgnoreBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(true));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestAllPermissions).toPromise();

      // Assert
      expect(TrackingManager.isIgnoringBatteryOptimizationsPermission).toHaveBeenCalled();
      expect(TrackingManager.requestIgnoreBatteryOptimizationsPermission).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        permissionsActions.permissionGranted(BATTERY_PERMISSION),
        permissionsActions.requestAllPermissionsResult(true),
      ]);
    });
    it('should return request battery permission on Android and return denied', async () => {
      // Prepare
      Platform.OS = 'android';
      TrackingManager.isIgnoringBatteryOptimizationsPermission.mockImplementation(() => Promise.resolve(false));
      TrackingManager.requestIgnoreBatteryOptimizationsPermission.mockImplementation(() => Promise.reject(false));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, requestAllPermissions).toPromise();

      // Assert
      expect(TrackingManager.isIgnoringBatteryOptimizationsPermission).toHaveBeenCalled();
      expect(TrackingManager.requestIgnoreBatteryOptimizationsPermission).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        permissionsActions.permissionDenied(BATTERY_PERMISSION),
        permissionsActions.requestAllPermissionsResult(false),
      ]);
    });
  });
});
