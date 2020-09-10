/**
  * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
  *
  * This Source Code Form is subject to the terms of the European Union
  * Public License, v. 1.2. If a copy of the EUPL was not distributed with
  * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
  *
  * SPDX-License-Identifier: EUPL-1.2
  */

import { runSaga, channel as stdChannel } from 'redux-saga';
import { Platform } from 'react-native';

import Moment from 'moment';

import onboardingActions from '@app/redux/onboarding';
import startupActions from '@app/redux/startup';
import accountActions, { TRACKING_RESULTS } from '@app/redux/account';
import servicesActions from '@app/redux/services';
import { ERRORS } from '@app/services/tracking';

import Storage from '@app/services/storage';

import {
  startup,
} from '@app/sagas/startup';

// Mock storage file
jest.mock('@app/services/storage');

describe('Startup Sagas', () => {
  describe('Startup', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should navigate to onboarding when is a new user', async () => {
      // Prepare
      Storage.hasItem.mockImplementation(() => Promise.resolve(false));

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, startup).toPromise();

      // Assert
      expect(Storage.hasItem).toHaveBeenCalled();
      expect(Storage.hasItem).toHaveBeenCalledWith('signup_date');
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        onboardingActions.setOnboarding(true),
        startupActions.setAppLaunched(true),
      ]);
    });
    it('should restore last saved configurations when with tracking disabled', async () => {
      // Prepare
      const signUpDate = new Moment().toJSON();
      const status = {
        infectionStatus: 0,
        errors: [],
        lastSyncDate: new Moment().toJSON(),
        exposureDays: [],
      };

      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'tracking_enabled') {
          return 'false';
        }

        if (arg === 'signup_date') {
          return signUpDate;
        }

        if (arg === 'status') {
          return JSON.stringify(status);
        }
      });

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        }, startup);
      channel.put(servicesActions.listenersRegistered());
      await saga.toPromise();

      // Assert
      expect(Storage.hasItem).toHaveBeenCalled();
      expect(Storage.hasItem).toHaveBeenCalledWith('signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(3);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'tracking_enabled', 'false');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'status', '{}');

      expect(dispatched).toHaveLength(6);
      expect(dispatched).toEqual([
        servicesActions.registerListeners(),
        accountActions.setSignUpDate(signUpDate),
        accountActions.updateStatus(status),
        onboardingActions.setOnboarding(false),
        accountActions.setTrackingEnabled(false),
        startupActions.setAppLaunched(true),
      ]);
    });
    it('should restore last saved configurations when with tracking enabled and start tracking returns success', async () => {
      // Prepare
      const signUpDate = new Moment().toJSON();
      const status = {
        infectionStatus: 0,
        errors: [],
        lastSyncDate: new Moment().toJSON(),
        exposureDays: [],
      };

      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'tracking_enabled') {
          return 'true';
        }

        if (arg === 'signup_date') {
          return signUpDate;
        }

        if (arg === 'status') {
          return JSON.stringify(status);
        }
      });

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        }, startup);
      channel.put(servicesActions.listenersRegistered());
      channel.put(accountActions.startTracking(TRACKING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(Storage.hasItem).toHaveBeenCalled();
      expect(Storage.hasItem).toHaveBeenCalledWith('signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(3);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'tracking_enabled', 'false');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'status', '{}');

      expect(dispatched).toHaveLength(7);
      expect(dispatched).toEqual([
        servicesActions.registerListeners(),
        accountActions.setSignUpDate(signUpDate),
        accountActions.updateStatus(status),
        onboardingActions.setOnboarding(false),
        accountActions.startTracking(),
        accountActions.setTrackingEnabled(true),
        startupActions.setAppLaunched(true),
      ]);
    });
    it('should restore last saved configurations when with tracking enabled and start tracking returns GAEN error', async () => {
      // Prepare
      const signUpDate = new Moment().toJSON();
      const status = {
        infectionStatus: 0,
        errors: [],
        lastSyncDate: new Moment().toJSON(),
        exposureDays: [],
      };

      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'tracking_enabled') {
          return 'true';
        }

        if (arg === 'signup_date') {
          return signUpDate;
        }

        if (arg === 'status') {
          return JSON.stringify(status);
        }
      });

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startup);
      channel.put(servicesActions.listenersRegistered());
      channel.put(accountActions.startTracking(TRACKING_RESULTS.GAEN));
      await saga.toPromise();

      // Assert
      expect(Storage.hasItem).toHaveBeenCalled();
      expect(Storage.hasItem).toHaveBeenCalledWith('signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(3);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'tracking_enabled', 'false');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'status', '{}');

      expect(dispatched).toHaveLength(8);
      expect(dispatched).toEqual([
        servicesActions.registerListeners(),
        accountActions.setSignUpDate(signUpDate),
        accountActions.updateStatus(status),
        onboardingActions.setOnboarding(false),
        accountActions.startTracking(),
        accountActions.setTrackingEnabled(false),
        accountActions.setErrors([ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED]),
        startupActions.setAppLaunched(true),
      ]);
    });
    it('should restore last saved configurations when with tracking enabled and start tracking returns failed', async () => {
      // Prepare
      const signUpDate = new Moment().toJSON();
      const status = {
        infectionStatus: 0,
        errors: [],
        lastSyncDate: new Moment().toJSON(),
        exposureDays: [],
      };

      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'tracking_enabled') {
          return 'true';
        }

        if (arg === 'signup_date') {
          return signUpDate;
        }

        if (arg === 'status') {
          return JSON.stringify(status);
        }
      });

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startup);
      channel.put(servicesActions.listenersRegistered());
      channel.put(accountActions.startTracking(TRACKING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(Storage.hasItem).toHaveBeenCalled();
      expect(Storage.hasItem).toHaveBeenCalledWith('signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(3);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'tracking_enabled', 'false');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'status', '{}');

      expect(dispatched).toHaveLength(7);
      expect(dispatched).toEqual([
        servicesActions.registerListeners(),
        accountActions.setSignUpDate(signUpDate),
        accountActions.updateStatus(status),
        onboardingActions.setOnboarding(false),
        accountActions.startTracking(),
        accountActions.setTrackingEnabled(false),
        startupActions.setAppLaunched(true),
      ]);
    });
  });
});
