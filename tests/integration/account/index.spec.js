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
import { Platform, Alert } from 'react-native';
import Moment from 'moment';
import RNRestart from 'react-native-restart';
import SplashScreen from 'react-native-splash-screen';

import Linking from '@app/services/linking';
import NavigationService from '@app/services/navigation';
import TracingManager, { ERRORS, GAEN_RESULTS, INFECTION_STATUS } from '@app/services/tracing';
import i18n, { languages } from '@app/services/i18n';

import AppRoutes from '@app/navigation/routes';

import accountActions, { TRACING_RESULTS } from '@app/redux/account';
import permissionsActions from '@app/redux/permissions';
import onboardingActions from '@app/redux/onboarding';
import modalsActions from '@app/redux/modals';

import {
  setupNewAccount,
  watchTracingStatus,
  startTracing,
  submitDiagnosis,
  switchTracing,
  updateStatus,
  setErrors,
  setInfectionStatus,
  updateLanguage,
  enableExposureNotifications,
} from '@app/sagas/account';

// Mock storage file
jest.mock('@app/services/linking');
jest.mock('@app/services/navigation');
jest.mock('@app/services/tracing');

describe('Account Sagas', () => {
  const defaultStatus = {
    lastSyncDate: 0,
    infectionStatus: 0,
    exposureDays: [],
    errors: [],
  };

  describe('Setup New Account', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should request permissions when they were not already granted', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
       }, setupNewAccount);
      channel.put(permissionsActions.checkAllPermissionsResult(false));
      channel.put(permissionsActions.requestAllPermissionsResult(true));

      // Assert
      expect(dispatched).toHaveLength(5);
      expect(dispatched).toEqual([
        accountActions.setupNewAccountPending(),
        accountActions.updateStatus(defaultStatus),
        permissionsActions.checkAllPermissions(),
        permissionsActions.requestAllPermissions(),
        accountActions.startTracing(),
      ]);
    });

    it('should not request permissions when they were already granted', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
       }, setupNewAccount);
      channel.put(permissionsActions.checkAllPermissionsResult(true));

      // Assert
      expect(dispatched).toHaveLength(4);
      expect(dispatched).toEqual([
        accountActions.setupNewAccountPending(),
        accountActions.updateStatus(defaultStatus),
        permissionsActions.checkAllPermissions(),
        accountActions.startTracing(),
      ]);
    });

    it('should start tracing when startTracing returns success', async () => {
      // Prepare
      NavigationService.navigate.mockImplementation(() => {});

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
       }, setupNewAccount);
      channel.put(permissionsActions.checkAllPermissionsResult(true));
      channel.put(accountActions.startTracing(TRACING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(NavigationService.navigate).toHaveBeenCalled();
      expect(NavigationService.navigate).toHaveBeenCalledWith(AppRoutes.APP);
      expect(dispatched).toHaveLength(8);
      expect(dispatched).toEqual(expect.arrayContaining([
        accountActions.setupNewAccountPending(),
        accountActions.updateStatus(defaultStatus),
        permissionsActions.checkAllPermissions(),
        accountActions.startTracing(),
        accountActions.setTracingEnabled(true),
        onboardingActions.setOnboarding(false),
        accountActions.setupNewAccountDone(),
      ]));
    });
    it('should not start tracing when startTracing returns failed', async () => {
      // Prepare
      NavigationService.navigate.mockImplementation(() => {});

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
       }, setupNewAccount);
      channel.put(permissionsActions.checkAllPermissionsResult(true));
      channel.put(accountActions.startTracing(TRACING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(NavigationService.navigate).toHaveBeenCalled();
      expect(NavigationService.navigate).toHaveBeenCalledWith(AppRoutes.APP);
      expect(dispatched).toHaveLength(8);
      expect(dispatched).toEqual(expect.arrayContaining([
        accountActions.setupNewAccountPending(),
        accountActions.updateStatus(defaultStatus),
        permissionsActions.checkAllPermissions(),
        accountActions.startTracing(),
        accountActions.setTracingEnabled(false),
        onboardingActions.setOnboarding(false),
        accountActions.setupNewAccountDone(),
      ]));
    });
    it('should not start tracing and report error when startTracing returns gaen', async () => {
      // Prepare
      NavigationService.navigate.mockImplementation(() => {});

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
       }, setupNewAccount);
      channel.put(permissionsActions.checkAllPermissionsResult(true));
      channel.put(accountActions.startTracing(TRACING_RESULTS.GAEN));
      await saga.toPromise();

      // Assert
      expect(NavigationService.navigate).toHaveBeenCalled();
      expect(NavigationService.navigate).toHaveBeenCalledWith(AppRoutes.APP);
      expect(dispatched).toHaveLength(9);
      expect(dispatched).toEqual(expect.arrayContaining([
        accountActions.setupNewAccountPending(),
        accountActions.updateStatus(defaultStatus),
        permissionsActions.checkAllPermissions(),
        accountActions.startTracing(),
        accountActions.setTracingEnabled(false),
        accountActions.setErrors([ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED]),
        onboardingActions.setOnboarding(false),
        accountActions.setupNewAccountDone(),
      ]));
    });
  });
  describe('Watch Tracing Status', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should update status when event is emitted', async () => {
      // Prepare
      let emitter;
      TracingManager.addUpdateEventListener.mockImplementation((callback) => {
        emitter = callback;
      });

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
       }, watchTracingStatus);

      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Emit tracing event
      emitter(defaultStatus);

      // Assert
      expect(TracingManager.addUpdateEventListener).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.tracingStatusListenerRegistered(),
        accountActions.updateStatus(defaultStatus),
      ]);
    });
  });
  describe('Start Tracing', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should register tracing status listener when start returns success', async () => {
      // Prepare
      TracingManager.start.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_SUCCEEDED));
      TracingManager.sync.mockImplementation(() => Promise.resolve());
      TracingManager.getStatus.mockImplementation(() => Promise.resolve(defaultStatus));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startTracing);
      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      channel.put(accountActions.tracingStatusListenerRegistered());

      // Await for start
      await new Promise((resolve) => setTimeout(resolve, 10));


      // Assert
      expect(TracingManager.start).toHaveBeenCalled();
      expect(TracingManager.sync).toHaveBeenCalled();
      expect(TracingManager.getStatus).toHaveBeenCalled();
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.tracingStatusListenerRegistered(),
        accountActions.updateStatus(defaultStatus),
        accountActions.startTracingResult(TRACING_RESULTS.SUCCESS),
      ]);
    });
    it('should not register tracing status listener when start returns cancelled', async () => {
      // Prepare
      TracingManager.start.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_CANCELLED));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startTracing).toPromise();
      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      channel.put(accountActions.tracingStatusListenerRegistered());

      // Await for start
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Assert
      expect(TracingManager.start).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18n.translate('common.dialogs.gaen.enable.title'),
        i18n.translate('common.dialogs.gaen.enable.description'),
        [
          {
            text: i18n.translate('common.actions.ok'),
            style: 'default',
          },
        ],
      );
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.tracingStatusListenerRegistered(),
        accountActions.startTracingResult(TRACING_RESULTS.GAEN),
      ]);
    });
    it('should not register tracing status listener when start throws an error', async () => {
      // Prepare
      TracingManager.start.mockImplementation(() => Promise.reject(GAEN_RESULTS.EN_FAILED));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startTracing).toPromise();
      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      channel.put(accountActions.tracingStatusListenerRegistered());

      // Await for start
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Assert
      expect(TracingManager.start).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.tracingStatusListenerRegistered(),
        accountActions.startTracingResult(TRACING_RESULTS.FAILED),
      ]);
    });
    it('should stop tracing status listener when stop tracing actions is dispatched', async () => {
      // Prepare
      TracingManager.start.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_SUCCEEDED));
      TracingManager.getStatus.mockImplementation(() => Promise.resolve(defaultStatus));
      TracingManager.sync.mockImplementation(() => Promise.resolve());

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startTracing);
      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      channel.put(accountActions.tracingStatusListenerRegistered());
      channel.put(accountActions.stopTracing());
      await saga.toPromise();

      // Assert
      expect(TracingManager.start).toHaveBeenCalled();
      expect(TracingManager.getStatus).toHaveBeenCalled();
      expect(TracingManager.stop).toHaveBeenCalled();
      expect(TracingManager.sync).toHaveBeenCalled();
      expect(dispatched).toHaveLength(4);
      expect(dispatched).toEqual([
        accountActions.tracingStatusListenerRegistered(),
        accountActions.updateStatus(defaultStatus),
        accountActions.startTracingResult(TRACING_RESULTS.SUCCESS),
        accountActions.stopTracingResult(TRACING_RESULTS.SUCCESS),
      ]);
    });
  });
  describe('Submit Diagnosis', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    const code = '123123123123';
    it('should report code when exposed returns success', async () => {
      // Prepare
      TracingManager.exposed.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_SUCCEEDED));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          services: {
            network: true,
          },
        }),
      }, submitDiagnosis, { payload: code });
      channel.put(accountActions.updateStatusResult());
      channel.put(modalsActions.networkModalOpen());
      channel.put(modalsActions.loadingModalClosed());
      await saga.toPromise();

      // Assert
      expect(TracingManager.removeUpdateEventListener).toHaveBeenCalled();
      expect(TracingManager.exposed).toHaveBeenCalled();
      expect(TracingManager.exposed).toHaveBeenCalledWith(code);
      expect(dispatched).toHaveLength(6);
      expect(dispatched).toEqual([
        accountActions.submitDiagnosisPending(),
        modalsActions.openLoadingModal(),
        accountActions.setInfectionStatus(INFECTION_STATUS.INFECTED),
        accountActions.setTracingEnabled(false),
        accountActions.submitDiagnosisDone(),
        modalsActions.closeLoadingModal(),
      ]);
    });
    it('should not report code when exposed returns cancelled', async () => {
      // Prepare
      TracingManager.exposed.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_CANCELLED));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          services: {
            network: true,
          },
        }),
      }, submitDiagnosis, { payload: code });
      channel.put(modalsActions.networkModalOpen());
      channel.put(modalsActions.loadingModalClosed());
      await saga.toPromise();

      // Assert
      expect(Alert.alert).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18n.translate('common.dialogs.gaen.export.title'),
        i18n.translate('common.dialogs.gaen.export.description'),
        [
          {
            text: i18n.translate('common.actions.ok'),
            style: 'default',
          },
        ],
      );
      expect(TracingManager.exposed).toHaveBeenCalled();
      expect(TracingManager.exposed).toHaveBeenCalledWith(code);
      expect(dispatched).toHaveLength(4);
      expect(dispatched).toEqual([
        accountActions.submitDiagnosisPending(),
        modalsActions.openLoadingModal(),
        accountActions.submitDiagnosisDone(),
        modalsActions.closeLoadingModal(),
      ]);
    });
    it('should not report code when exposed throws an error', async () => {
      // Prepare
      TracingManager.exposed.mockImplementation(() => Promise.reject(GAEN_RESULTS.EN_FAILED));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          services: {
            network: true,
          },
        }),
      }, submitDiagnosis, { payload: code });
      channel.put(modalsActions.networkModalOpen());
      channel.put(modalsActions.loadingModalClosed());
      channel.put(modalsActions.serverErrorModalOpen());
      await saga.toPromise();

      // Assert
      expect(TracingManager.exposed).toHaveBeenCalled();
      expect(TracingManager.exposed).toHaveBeenCalledWith(code);
      expect(dispatched).toHaveLength(6);
      expect(dispatched).toEqual([
        accountActions.submitDiagnosisPending(),
        modalsActions.openLoadingModal(),
        accountActions.submitDiagnosisDone(),
        modalsActions.closeLoadingModal(),
        accountActions.submitDiagnosisError(i18n.translate('common.errors.general')),
        modalsActions.openServerErrorModal(),
      ]);
    });
  });
  describe('Switch Tracing', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should stop tracing when tracing is enabled', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            tracingEnabled: true,
          },
        }),
      }, switchTracing);
      channel.put(accountActions.stopTracingResult(TRACING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.stopTracing(),
        accountActions.setTracingEnabled(false),
        accountActions.setErrors([]),
      ]);
    });
    it('should start tracing when all permissions are granted and start tracing returns success', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            tracingEnabled: false,
          },
        }),
      }, switchTracing);
      channel.put(permissionsActions.checkAllPermissionsResult(true));
      channel.put(accountActions.startTracingResult(TRACING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        permissionsActions.checkAllPermissions(),
        accountActions.startTracing(),
        accountActions.setTracingEnabled(true),
      ]);
    });
    it('should not start tracing when permissions are denied', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            tracingEnabled: false,
          },
        }),
      }, switchTracing);
      channel.put(permissionsActions.checkAllPermissionsResult(false));
      channel.put(permissionsActions.requestAllPermissionsResult(false));
      await saga.toPromise();

      // Assert
      expect(Alert.alert).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18n.translate('common.dialogs.permissions.title'),
        i18n.translate('common.dialogs.permissions.description'),
        [
          {
            text: i18n.translate('common.actions.ok'),
            style: 'default',
          },
        ],
      );
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        permissionsActions.checkAllPermissions(),
        permissionsActions.requestAllPermissions(),
        accountActions.setTracingEnabled(false),
      ]);
    });
    it('should not start tracing when start tracing not returns success', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            tracingEnabled: false,
          },
        }),
      }, switchTracing);
      channel.put(permissionsActions.checkAllPermissionsResult(true));
      channel.put(accountActions.startTracingResult(TRACING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        permissionsActions.checkAllPermissions(),
        accountActions.startTracing(),
        accountActions.setTracingEnabled(false),
      ]);
    });
  });
  describe('Update Status', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should update status on redux', async () => {
      // Prepare
      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(false));
      const newState = {
        lastSyncDate: Moment().toJSON(),
        infectionStatus: 2,
        exposureDays: [],
        errors: [],
      };

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            status: defaultStatus,
          },
        }),
      }, updateStatus, { payload: newState }).toPromise();

      // Assert
      expect(TracingManager.isTracingEnabled).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.setStatus(newState),
        accountActions.updateStatusResult(newState),
      ]);
    });
    it('should deactivate tracing enabled when GAEN is deactivated', async () => {
      // Prepare
      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
      const newState = {
        lastSyncDate: Moment().toJSON(),
        infectionStatus: 2,
        exposureDays: [],
        errors: [
          ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED,
        ],
      };

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, updateStatus, { payload: newState }).toPromise();

      // Assert
      expect(TracingManager.isTracingEnabled).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.setTracingEnabled(false),
        accountActions.setStatus(newState),
        accountActions.updateStatusResult(newState),
      ]);
    });
    it('should activate tracing enabled when GAEN is activated and tracing is enabled', async () => {
      // Prepare
      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
      const newState = {
        lastSyncDate: Moment().toJSON(),
        infectionStatus: 2,
        exposureDays: [],
        errors: [],
      };

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, updateStatus, { payload: newState }).toPromise();

      // Assert
      expect(TracingManager.isTracingEnabled).toHaveBeenCalled();
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.setTracingEnabled(true),
        accountActions.setStatus(newState),
        accountActions.updateStatusResult(newState),
      ]);
    });
    it('should reset infection status when last exposure was 14 days ago', async () => {
      // Prepare
      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(false));
      const newState = {
        lastSyncDate: Moment().toJSON(),
        infectionStatus: 1,
        exposureDays: [{
          exposedDate: Moment().startOf('day').subtract(15, 'days'),
        }],
        errors: [],
      };

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            status: defaultStatus,
          },
        }),
      }, updateStatus, { payload: newState }).toPromise();

      // Assert
      expect(TracingManager.isTracingEnabled).toHaveBeenCalled();
      expect(TracingManager.resetExposureDays).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.setStatus(newState),
        accountActions.updateStatusResult(newState),
      ]);
    });
    it('should not reset infection status when last exposure was not 14 days ago', async () => {
      // Prepare
      TracingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(false));
      const newState = {
        lastSyncDate: Moment().toJSON(),
        infectionStatus: 1,
        exposureDays: [{
          exposedDate: Moment().startOf('day').subtract(13, 'days'),
        }],
        errors: [],
      };

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            status: defaultStatus,
          },
        }),
      }, updateStatus, { payload: newState }).toPromise();

      // Assert
      expect(TracingManager.isTracingEnabled).toHaveBeenCalled();
      expect(TracingManager.resetExposureDays).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.setStatus(newState),
        accountActions.updateStatusResult(newState),
      ]);
    });
  });
  describe('Set Errors', () => {
    it('should set errors on redux', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            status: defaultStatus,
          },
        }),
      }, setErrors, { payload: [] }).toPromise();

      // Assert
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        accountActions.updateStatus(({
          ...defaultStatus,
          errors: [],
        })),
      ]);
    });
  });
  describe('Set Infection Status', () => {
    it('should set infection status on redux', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            status: defaultStatus,
          },
        }),
      }, setInfectionStatus, { payload: INFECTION_STATUS.EXPOSED }).toPromise();

      // Assert
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        accountActions.updateStatus(({
          ...defaultStatus,
          errors: [],
          infectionStatus: INFECTION_STATUS.EXPOSED,
        })),
      ]);
    });
  });
  describe('Update Language', () => {
    it('should set language and restart device', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, updateLanguage, { payload: languages.PT.languageTag }).toPromise();

      // Assert
      expect(SplashScreen.show).toHaveBeenCalled();
      expect(RNRestart.Restart).toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([accountActions.setLanguage(languages.PT)]);
    });
  });

  describe('Enable Exposure Notifications', () => {
    it('should start tracing on Android', async () => {
      // Prepare
      Platform.OS = 'android';

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, enableExposureNotifications);
      channel.put(accountActions.startTracingResult(TRACING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(Linking.openURL).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([accountActions.startTracing()]);
    });
    it('should start tracing on iOS and start returns success', async () => {
      // Prepare
      Platform.OS = 'ios';

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, enableExposureNotifications);
      channel.put(accountActions.startTracingResult(TRACING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(Linking.openURL).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([accountActions.startTracing()]);
    });
    it('should start tracing on iOS and start returns fails', async () => {
      // Prepare
      Platform.OS = 'ios';
      Linking.openURL.mockImplementation(() => Promise.resolve());

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, enableExposureNotifications);
      channel.put(accountActions.startTracingResult(TRACING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(Linking.openURL).toHaveBeenCalled();
      expect(Linking.openURL).toHaveBeenCalledWith('app-settings://');
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([accountActions.startTracing()]);
    });
  });
});
