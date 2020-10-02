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

import { languages } from '@app/services/i18n';

import onboardingActions from '@app/redux/onboarding';
import startupActions from '@app/redux/startup';
import accountActions, { TRACKING_RESULTS } from '@app/redux/account';
import TrackingManager, { ERRORS } from '@app/services/tracking';

import Storage from '@app/services/storage';

import {
  startup,
} from '@app/sagas/startup';

// Mock storage file
jest.mock('@app/services/storage');
jest.mock('@app/services/tracking');

describe('Startup Sagas', () => {
  describe('Startup', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should navigate to onboarding when is a new user', async () => {
      // Prepare
      Storage.getItem.mockImplementation(() => Promise.resolve(languages.PT.languageTag));
      Storage.hasItem.mockImplementation((item) => {
        if (item === "language") {
          return Promise.resolve(true);
        }

        return Promise.resolve(false);
      });

      // Execute
      const dispatched = [];
      await runSaga({
        dispatch: (action) => dispatched.push(action),
      }, startup).toPromise();

      // Assert
      expect(Storage.getItem).toHaveBeenCalled();
      expect(Storage.hasItem).toHaveBeenCalled();
      expect(Storage.getItem).toHaveBeenCalledWith('language');
      expect(Storage.hasItem).toHaveBeenCalledWith('language');
      expect(Storage.hasItem).toHaveBeenCalledWith('signup_date');
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
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

      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(false));
      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'language') {
          return languages.PT.languageTag;
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
      await saga.toPromise();

      // Assert
      expect(TrackingManager.isTracingEnabled).toHaveBeenCalled();

      expect(Storage.hasItem).toHaveBeenCalledTimes(2);
      expect(Storage.hasItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(2, 'signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(3);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'status', '{}');

      expect(dispatched).toHaveLength(6);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
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

      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'language') {
          return languages.PT.languageTag;
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
      channel.put(accountActions.startTrackingResult(TRACKING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(TrackingManager.isTracingEnabled).toHaveBeenCalled();

      expect(Storage.hasItem).toHaveBeenCalledTimes(2);
      expect(Storage.hasItem).toHaveBeenNthCalledWith(1,'language');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(2,'signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(3);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'status', '{}');

      expect(dispatched).toHaveLength(7);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
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

      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'language') {
          return languages.PT.languageTag;
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
      channel.put(accountActions.startTrackingResult(TRACKING_RESULTS.GAEN));
      await saga.toPromise();

      // Assert
      expect(TrackingManager.isTracingEnabled).toHaveBeenCalled();

      expect(Storage.hasItem).toHaveBeenCalledTimes(2);
      expect(Storage.hasItem).toHaveBeenNthCalledWith(1,'language');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(2,'signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(3);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'status', '{}');

      expect(dispatched).toHaveLength(8);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
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

      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'language') {
          return languages.PT.languageTag;
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
      channel.put(accountActions.startTrackingResult(TRACKING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(TrackingManager.isTracingEnabled).toHaveBeenCalled();

      expect(Storage.hasItem).toHaveBeenCalledTimes(2);
      expect(Storage.hasItem).toHaveBeenNthCalledWith(1,'language');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(2,'signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(3);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'status', '{}');

      expect(dispatched).toHaveLength(7);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
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
