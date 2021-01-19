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
import accountActions, { TRACING_RESULTS } from '@app/redux/account';
import TracingManager, { ERRORS } from '@app/services/tracing';

import { AUTO } from '@app/common/theme';

import { languages } from '@app/services/i18n';
import Storage from '@app/services/storage';

import {
  startup,
} from '@app/sagas/startup';

// Mock storage file
jest.mock('@app/services/storage');
jest.mock('@app/services/tracing');

describe('Startup Sagas', () => {
  describe('Startup', () => {
    afterEach(() => {
      Platform.OS = 'android';
      jest.resetAllMocks();
    });
    it('should navigate to unsupported when device does not support EN', async () => {
      // Prepare
      Platform.OS = 'ios';
      TracingManager.isENSupported.mockImplementation(() => false);
      Storage.getItem.mockImplementation(() => Promise.resolve(languages.PT.languageTag));
      Storage.hasItem.mockImplementation((item) => {
        if (item === "language") {
          return Promise.resolve(true);
        }
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
      expect(Storage.hasItem).toHaveBeenCalledWith('theme');
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
        startupActions.setUnsupported(true),
        startupActions.setAppLaunched(true),
      ]);
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
      expect(Storage.hasItem).toHaveBeenCalledWith('theme');
      expect(Storage.hasItem).toHaveBeenCalledWith('signup_date');
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
        onboardingActions.setOnboarding(true),
        startupActions.setAppLaunched(true),
      ]);
    });
    it('should restore last saved configurations when with tracing disabled', async () => {
      // Prepare
      const signUpDate = new Moment().toJSON();
      const status = {
        infectionStatus: 0,
        errors: [],
        lastSyncDate: new Moment().toJSON(),
        exposureDays: [],
      };

      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(false));
      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'language') {
          return languages.PT.languageTag;
        }

        if (arg === 'theme') {
          return AUTO;
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
      expect(TracingManager.isTracingEnabled).toHaveBeenCalled();

      expect(Storage.hasItem).toHaveBeenCalledTimes(3);
      expect(Storage.hasItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(2, 'theme');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(3, 'signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(4);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'theme');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(4, 'status', '{}');

      expect(dispatched).toHaveLength(7);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
        accountActions.setTheme(AUTO),
        accountActions.setSignUpDate(signUpDate),
        accountActions.updateStatus(status),
        onboardingActions.setOnboarding(false),
        accountActions.setTracingEnabled(false),
        startupActions.setAppLaunched(true),
      ]);
    });
    it('should restore last saved configurations when with tracing enabled and start tracing returns success', async () => {
      // Prepare
      const signUpDate = new Moment().toJSON();
      const status = {
        infectionStatus: 0,
        errors: [],
        lastSyncDate: new Moment().toJSON(),
        exposureDays: [],
      };

      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'language') {
          return languages.PT.languageTag;
        }

        if (arg === 'theme') {
          return AUTO;
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
      channel.put(accountActions.startTracingResult(TRACING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(TracingManager.isTracingEnabled).toHaveBeenCalled();

      expect(Storage.hasItem).toHaveBeenCalledTimes(3);
      expect(Storage.hasItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(2, 'theme');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(3, 'signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(4);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'theme');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(4, 'status', '{}');

      expect(dispatched).toHaveLength(8);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
        accountActions.setTheme(AUTO),
        accountActions.setSignUpDate(signUpDate),
        accountActions.updateStatus(status),
        onboardingActions.setOnboarding(false),
        accountActions.startTracing(),
        accountActions.setTracingEnabled(true),
        startupActions.setAppLaunched(true),
      ]);
    });
    it('should restore last saved configurations when with tracing enabled and start tracing returns GAEN error', async () => {
      // Prepare
      const signUpDate = new Moment().toJSON();
      const status = {
        infectionStatus: 0,
        errors: [],
        lastSyncDate: new Moment().toJSON(),
        exposureDays: [],
      };

      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'language') {
          return languages.PT.languageTag;
        }

        if (arg === 'theme') {
          return AUTO;
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
      channel.put(accountActions.startTracingResult(TRACING_RESULTS.GAEN));
      await saga.toPromise();

      // Assert
      expect(TracingManager.isTracingEnabled).toHaveBeenCalled();

      expect(Storage.hasItem).toHaveBeenCalledTimes(3);
      expect(Storage.hasItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(2, 'theme');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(3, 'signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(4);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'theme');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(4, 'status', '{}');

      expect(dispatched).toHaveLength(9);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
        accountActions.setTheme(AUTO),
        accountActions.setSignUpDate(signUpDate),
        accountActions.updateStatus(status),
        onboardingActions.setOnboarding(false),
        accountActions.startTracing(),
        accountActions.setTracingEnabled(false),
        accountActions.setErrors([ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED]),
        startupActions.setAppLaunched(true),
      ]);
    });
    it('should restore last saved configurations when with tracing enabled and start tracing returns failed', async () => {
      // Prepare
      const signUpDate = new Moment().toJSON();
      const status = {
        infectionStatus: 0,
        errors: [],
        lastSyncDate: new Moment().toJSON(),
        exposureDays: [],
      };

      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
      Storage.hasItem.mockImplementation(() => Promise.resolve(true));
      Storage.getItem.mockImplementation((arg) => {
        if (arg === 'language') {
          return languages.PT.languageTag;
        }

        if (arg === 'theme') {
          return AUTO;
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
      channel.put(accountActions.startTracingResult(TRACING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(TracingManager.isTracingEnabled).toHaveBeenCalled();

      expect(Storage.hasItem).toHaveBeenCalledTimes(3);
      expect(Storage.hasItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(2, 'theme');
      expect(Storage.hasItem).toHaveBeenNthCalledWith(3, 'signup_date');

      expect(Storage.getItem).toHaveBeenCalledTimes(4);
      expect(Storage.getItem).toHaveBeenNthCalledWith(1, 'language');
      expect(Storage.getItem).toHaveBeenNthCalledWith(2, 'theme');
      expect(Storage.getItem).toHaveBeenNthCalledWith(3, 'signup_date', '');
      expect(Storage.getItem).toHaveBeenNthCalledWith(4, 'status', '{}');

      expect(dispatched).toHaveLength(8);
      expect(dispatched).toEqual([
        accountActions.setLanguage(languages.PT),
        accountActions.setTheme(AUTO),
        accountActions.setSignUpDate(signUpDate),
        accountActions.updateStatus(status),
        onboardingActions.setOnboarding(false),
        accountActions.startTracing(),
        accountActions.setTracingEnabled(false),
        startupActions.setAppLaunched(true),
      ]);
    });
  });
});
