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
import { Platform, Alert, Linking } from 'react-native';
import Moment from 'moment';
import RNRestart from 'react-native-restart';
import SplashScreen from 'react-native-splash-screen';

import NavigationService from '@app/services/navigation';
import TrackingManager, { ERRORS, GAEN_RESULTS, INFECTION_STATUS } from '@app/services/tracking';
import i18n, { languages } from '@app/services/i18n';

import AppRoutes from '@app/navigation/routes';

import accountActions, { TRACKING_RESULTS } from '@app/redux/account';
import permissionsActions from '@app/redux/permissions';
import onboardingActions from '@app/redux/onboarding';
import modalsActions from '@app/redux/modals';

import {
  setupNewAccount,
  watchTrackingStatus,
  startTracking,
  submitDiagnosis,
  switchTracking,
  updateStatus,
  setErrors,
  setInfectionStatus,
  updateLanguage,
  enableExposureNotifications,
} from '@app/sagas/account';

// Mock storage file
jest.mock('@app/services/navigation');
jest.mock('@app/services/tracking');

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
        accountActions.startTracking(),
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
        accountActions.startTracking(),
      ]);
    });

    it('should start tracking when startTracking returns success', async () => {
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
      channel.put(accountActions.startTracking(TRACKING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(NavigationService.navigate).toHaveBeenCalled();
      expect(NavigationService.navigate).toHaveBeenCalledWith(AppRoutes.APP);
      expect(dispatched).toHaveLength(8);
      expect(dispatched).toEqual(expect.arrayContaining([
        accountActions.setupNewAccountPending(),
        accountActions.updateStatus(defaultStatus),
        permissionsActions.checkAllPermissions(),
        accountActions.startTracking(),
        accountActions.setTrackingEnabled(true),
        onboardingActions.setOnboarding(false),
        accountActions.setupNewAccountDone(),
      ]));
    });
    it('should not start tracking when startTracking returns failed', async () => {
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
      channel.put(accountActions.startTracking(TRACKING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(NavigationService.navigate).toHaveBeenCalled();
      expect(NavigationService.navigate).toHaveBeenCalledWith(AppRoutes.APP);
      expect(dispatched).toHaveLength(8);
      expect(dispatched).toEqual(expect.arrayContaining([
        accountActions.setupNewAccountPending(),
        accountActions.updateStatus(defaultStatus),
        permissionsActions.checkAllPermissions(),
        accountActions.startTracking(),
        accountActions.setTrackingEnabled(false),
        onboardingActions.setOnboarding(false),
        accountActions.setupNewAccountDone(),
      ]));
    });
    it('should not start tracking and report error when startTracking returns gaen', async () => {
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
      channel.put(accountActions.startTracking(TRACKING_RESULTS.GAEN));
      await saga.toPromise();

      // Assert
      expect(NavigationService.navigate).toHaveBeenCalled();
      expect(NavigationService.navigate).toHaveBeenCalledWith(AppRoutes.APP);
      expect(dispatched).toHaveLength(9);
      expect(dispatched).toEqual(expect.arrayContaining([
        accountActions.setupNewAccountPending(),
        accountActions.updateStatus(defaultStatus),
        permissionsActions.checkAllPermissions(),
        accountActions.startTracking(),
        accountActions.setTrackingEnabled(false),
        accountActions.setErrors([ERRORS[Platform.OS].GAEN_UNEXPECTEDLY_DISABLED]),
        onboardingActions.setOnboarding(false),
        accountActions.setupNewAccountDone(),
      ]));
    });
  });
  describe('Watch Tracking Status', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should update status when event is emitted', async () => {
      // Prepare
      let emitter;
      TrackingManager.addUpdateEventListener.mockImplementation((callback) => {
        emitter = callback;
      });

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
       }, watchTrackingStatus);

      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Emit tracking event
      emitter(defaultStatus);

      // Assert
      expect(TrackingManager.addUpdateEventListener).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.trackingStatusListenerRegistered(),
        accountActions.updateStatus(defaultStatus),
      ]);
    });
  });
  describe('Start Tracking', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should register tracking status listener when start returns success', async () => {
      // Prepare
      TrackingManager.start.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_SUCCEEDED));
      TrackingManager.sync.mockImplementation(() => Promise.resolve());
      TrackingManager.getStatus.mockImplementation(() => Promise.resolve(defaultStatus));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startTracking);
      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      channel.put(accountActions.trackingStatusListenerRegistered());

      // Await for start
      await new Promise((resolve) => setTimeout(resolve, 10));


      // Assert
      expect(TrackingManager.start).toHaveBeenCalled();
      expect(TrackingManager.sync).toHaveBeenCalled();
      expect(TrackingManager.getStatus).toHaveBeenCalled();
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.trackingStatusListenerRegistered(),
        accountActions.updateStatus(defaultStatus),
        accountActions.startTrackingResult(TRACKING_RESULTS.SUCCESS),
      ]);
    });
    it('should not register tracking status listener when start returns cancelled', async () => {
      // Prepare
      TrackingManager.start.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_CANCELLED));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startTracking).toPromise();
      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      channel.put(accountActions.trackingStatusListenerRegistered());

      // Await for start
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Assert
      expect(TrackingManager.start).toHaveBeenCalled();
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
        accountActions.trackingStatusListenerRegistered(),
        accountActions.startTrackingResult(TRACKING_RESULTS.GAEN),
      ]);
    });
    it('should not register tracking status listener when start throws an error', async () => {
      // Prepare
      TrackingManager.start.mockImplementation(() => Promise.reject(GAEN_RESULTS.EN_FAILED));

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startTracking).toPromise();
      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      channel.put(accountActions.trackingStatusListenerRegistered());

      // Await for start
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Assert
      expect(TrackingManager.start).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.trackingStatusListenerRegistered(),
        accountActions.startTrackingResult(TRACKING_RESULTS.FAILED),
      ]);
    });
    it('should stop tracking status listener when stop tracking actions is dispatched', async () => {
      // Prepare
      TrackingManager.start.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_SUCCEEDED));
      TrackingManager.getStatus.mockImplementation(() => Promise.resolve(defaultStatus));
      TrackingManager.sync.mockImplementation(() => Promise.resolve());

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, startTracking);
      // Await for watcher to be registered
      await new Promise((resolve) => setTimeout(resolve, 10));

      channel.put(accountActions.trackingStatusListenerRegistered());
      channel.put(accountActions.stopTracking());
      await saga.toPromise();

      // Assert
      expect(TrackingManager.start).toHaveBeenCalled();
      expect(TrackingManager.getStatus).toHaveBeenCalled();
      expect(TrackingManager.stop).toHaveBeenCalled();
      expect(TrackingManager.sync).toHaveBeenCalled();
      expect(dispatched).toHaveLength(4);
      expect(dispatched).toEqual([
        accountActions.trackingStatusListenerRegistered(),
        accountActions.updateStatus(defaultStatus),
        accountActions.startTrackingResult(TRACKING_RESULTS.SUCCESS),
        accountActions.stopTrackingResult(TRACKING_RESULTS.SUCCESS),
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
      TrackingManager.exposed.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_SUCCEEDED));

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
      expect(TrackingManager.removeUpdateEventListener).toHaveBeenCalled();
      expect(TrackingManager.exposed).toHaveBeenCalled();
      expect(TrackingManager.exposed).toHaveBeenCalledWith(code);
      expect(dispatched).toHaveLength(7);
      expect(dispatched).toEqual([
        accountActions.submitDiagnosisPending(),
        modalsActions.openLoadingModal(),
        accountActions.setInfectionStatus(INFECTION_STATUS.INFECTED),
        accountActions.setErrors([]),
        accountActions.setTrackingEnabled(false),
        accountActions.submitDiagnosisDone(),
        modalsActions.closeLoadingModal(),
      ]);
    });
    it('should not report code when exposed returns cancelled', async () => {
      // Prepare
      TrackingManager.exposed.mockImplementation(() => Promise.resolve(GAEN_RESULTS.EN_CANCELLED));

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
      expect(TrackingManager.exposed).toHaveBeenCalled();
      expect(TrackingManager.exposed).toHaveBeenCalledWith(code);
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
      TrackingManager.exposed.mockImplementation(() => Promise.reject(GAEN_RESULTS.EN_FAILED));

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
      expect(TrackingManager.exposed).toHaveBeenCalled();
      expect(TrackingManager.exposed).toHaveBeenCalledWith(code);
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
  describe('Switch Tracking', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should stop tracking when tracking is enabled', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      await runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            trackingEnabled: true,
          },
        }),
      }, switchTracking).toPromise();

      // Assert
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        accountActions.stopTracking(),
        accountActions.setTrackingEnabled(false),
        accountActions.setErrors([]),
      ]);
    });
    it('should start tracking when all permissions are granted and start tracking returns success', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            trackingEnabled: false,
          },
        }),
      }, switchTracking);
      channel.put(permissionsActions.checkAllPermissionsResult(true));
      channel.put(accountActions.startTrackingResult(TRACKING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        permissionsActions.checkAllPermissions(),
        accountActions.startTracking(),
        accountActions.setTrackingEnabled(true),
      ]);
    });
    it('should not start tracking when permissions are denied', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            trackingEnabled: false,
          },
        }),
      }, switchTracking);
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
        accountActions.setTrackingEnabled(false),
      ]);
    });
    it('should not start tracking when start tracking not returns success', async () => {
      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          account: {
            trackingEnabled: false,
          },
        }),
      }, switchTracking);
      channel.put(permissionsActions.checkAllPermissionsResult(true));
      channel.put(accountActions.startTrackingResult(TRACKING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(dispatched).toHaveLength(3);
      expect(dispatched).toEqual([
        permissionsActions.checkAllPermissions(),
        accountActions.startTracking(),
        accountActions.setTrackingEnabled(false),
      ]);
    });
  });
  describe('Update Status', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should update status on redux', async () => {
      // Prepare
      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(false));
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
      expect(TrackingManager.isTracingEnabled).toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        accountActions.setStatus(newState),
      ]);
    });
    it('should deactivate tracking enabled when GAEN is deactivated', async () => {
      // Prepare
      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
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
      expect(TrackingManager.isTracingEnabled).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.setTrackingEnabled(false),
        accountActions.setStatus(newState),
      ]);
    });
    it('should activate tracking enabled when GAEN is activated and tracking is enabled', async () => {
      // Prepare
      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(true));
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
      expect(TrackingManager.isTracingEnabled).toHaveBeenCalled();
      expect(dispatched).toHaveLength(2);
      expect(dispatched).toEqual([
        accountActions.setTrackingEnabled(true),
        accountActions.setStatus(newState),
      ]);
    });
    it('should reset infection status when last exposure was 15 days ago', async () => {
      // Prepare
      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(false));
      const newState = {
        lastSyncDate: Moment().toJSON(),
        infectionStatus: 1,
        exposureDays: [{
          exposedDate: Moment().startOf('day').subtract(16, 'days'),
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
      expect(TrackingManager.isTracingEnabled).toHaveBeenCalled();
      expect(TrackingManager.resetInfectionStatus).toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        accountActions.setStatus(newState),
      ]);
    });
    it('should not reset infection status when last exposure was not 15 days ago', async () => {
      // Prepare
      TrackingManager.isTracingEnabled.mockImplementation(() => Promise.resolve(false));
      const newState = {
        lastSyncDate: Moment().toJSON(),
        infectionStatus: 1,
        exposureDays: [{
          exposedDate: Moment().startOf('day').subtract(14, 'days'),
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
      expect(TrackingManager.isTracingEnabled).toHaveBeenCalled();
      expect(TrackingManager.resetInfectionStatus).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([
        accountActions.setStatus(newState),
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
        accountActions.setStatus(({
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
        accountActions.setStatus(({
          ...defaultStatus,
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
    it('should start tracking on Android', async () => {
      // Prepare
      Platform.OS = 'android';

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, enableExposureNotifications);
      channel.put(accountActions.startTrackingResult(TRACKING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(Linking.openURL).not.toHaveBeenCalled();
      expect(Linking.canOpenURL).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([accountActions.startTracking()]);
    });
    it('should start tracking on iOS and start returns success', async () => {
      // Prepare
      Platform.OS = 'ios';

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, enableExposureNotifications);
      channel.put(accountActions.startTrackingResult(TRACKING_RESULTS.SUCCESS));
      await saga.toPromise();

      // Assert
      expect(Linking.openURL).not.toHaveBeenCalled();
      expect(Linking.canOpenURL).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([accountActions.startTracking()]);
    });
    it('should start tracking on iOS and start returns fails', async () => {
      // Prepare
      Platform.OS = 'ios';
      Linking.canOpenURL.mockImplementation(() => Promise.resolve(true));
      Linking.openURL.mockImplementation(() => Promise.resolve());

      // Execute
      const channel = stdChannel();
      const dispatched = [];
      const saga = runSaga({
        channel,
        dispatch: (action) => dispatched.push(action),
      }, enableExposureNotifications);
      channel.put(accountActions.startTrackingResult(TRACKING_RESULTS.FAILED));
      await saga.toPromise();

      // Assert
      expect(Linking.openURL).toHaveBeenCalled();
      expect(Linking.canOpenURL).toHaveBeenCalled();
      expect(Linking.openURL).toHaveBeenCalledWith('app-settings://');
      expect(dispatched).toHaveLength(1);
      expect(dispatched).toEqual([accountActions.startTracking()]);
    });
  });
});
