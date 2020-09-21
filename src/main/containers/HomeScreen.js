/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React from 'react';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import Home from '@main/components/Home';

import NavigationService from '@app/services/navigation';
import Configuration from '@app/services/configuration';
import i18n from '@app/services/i18n';
import TrackingManager from '@app/services/tracking';
import Linking from '@app/services/linking';

import accountActions from '@app/redux/account';
import {
  getInfectionStatus,
  getLastSync,
  isTrackingEnabled,
  hasBluetoothDisabledError,
  hasLocationDisabledError,
  hasBatteryOptimizerError,
  hasExposureNotificationsDisabledError,
} from '@app/redux/account/selectors';

import AppRoutes from '@app/navigation/routes';

export default function HomeScreen () {
  const dispatch = useDispatch();

  const trackingEnabled = useSelector(isTrackingEnabled);
  const infectionStatus = useSelector(getInfectionStatus);
  const hasBluetoothError = useSelector(hasBluetoothDisabledError);
  const hasLocationError = useSelector(hasLocationDisabledError);
  const hasBatteryError = useSelector(hasBatteryOptimizerError);
  const hasExposureNotificationsError = useSelector(hasExposureNotificationsDisabledError);

  let error = {
    status: false,
    title: '',
    message: '',
    accessibility: {
      label: '',
      hint: '',
    },
    icon: '',
    onPress: () => {},
    clickable: false,
  };

  if (hasExposureNotificationsError || ! trackingEnabled) {
    error = {
      status: true,
      title: i18n.translate('screens.home.errors.gaen.title'),
      message: i18n.translate('screens.home.errors.gaen.message'),
      accessibility: {
        label: i18n.translate('screens.home.errors.gaen.accessibility.label'),
        hint: i18n.translate('screens.home.errors.gaen.accessibility.hint'),
      },
      icon: 'gaen_disconnected',
      onPress: Platform.select({
        android: () => dispatch(accountActions.startTracking()),
        ios: () => Linking.openURL('app-settings://'),
      }),
      clickable: true,
    };
  } else if (hasBluetoothError) {
    error = {
      status: true,
      title: i18n.translate('screens.home.errors.bluetooth.title'),
      message: i18n.translate('screens.home.errors.bluetooth.message'),
      accessibility: {
        label: i18n.translate('screens.home.errors.bluetooth.accessibility.label'),
        hint: i18n.translate('screens.home.errors.bluetooth.accessibility.hint'),
      },
      icon: 'bluetooth_disconnected',
      onPress: () => TrackingManager.requestBluetoothService(),
      clickable: Platform.OS === 'android',
    };
  } else if (hasLocationError) {
    error = {
      status: true,
      title: i18n.translate('screens.home.errors.location.title'),
      message: i18n.translate('screens.home.errors.location.message'),
      accessibility: {
        label: i18n.translate('screens.home.errors.location.accessibility.label'),
        hint: i18n.translate('screens.home.errors.location.accessibility.hint'),
      },
      icon: 'location_disconnected',
      onPress: () => RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({}),
      clickable: Platform.OS === 'android',
    };
  } else if (hasBatteryError) {
    error = {
      status: true,
      title: i18n.translate('screens.home.errors.battery.title'),
      message: i18n.translate('screens.home.errors.battery.message'),
      accessibility: {
        label: i18n.translate('screens.home.errors.battery.accessibility.label'),
        hint: i18n.translate('screens.home.errors.battery.accessibility.hint'),
      },
      icon: 'battery_optimized',
      onPress: () => TrackingManager.requestIgnoreBatteryOptimizationsPermission(),
      clickable: Platform.OS === 'android',
    };
  }

  const onLongPress = () => {
    if (Configuration.UI) {
      dispatch(
        accountActions.setInfectionStatus(infectionStatus === 2 ? 0 : infectionStatus + 1),
      );
    }
  };

  const props = {
    infectionStatus,
    onLongPress,
    lastSync: useSelector(getLastSync),
    error,
    onPress: () => NavigationService.navigate(AppRoutes.SETTINGS),
  };

  return (
    <Home {...props} />
  );
}
