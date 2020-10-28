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

import Icon from '@app/common/components/Icon';

import NavigationService from '@app/services/navigation';
import Configuration from '@app/services/configuration';
import i18n from '@app/services/i18n';
import TrackingManager, { INFECTION_STATUS } from '@app/services/tracking';
import Linking from '@app/services/linking';

import { iconSizes } from '@app/common/theme';

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
    icon: undefined,
    onPress: () => {},
  };

  if (infectionStatus !== INFECTION_STATUS.INFECTED) {
    if (hasExposureNotificationsError) {
      error = {
        status: true,
        title: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.title`),
        message: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.message`),
        icon: <Icon name='gaen_disconnected' width={iconSizes.size32} height={iconSizes.size32} />,
        main: {
          label: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.label`),
          accessibility: {
            label: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.accessibility.label`),
            hint: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.accessibility.hint`),
          },
          onPress: () => dispatch(accountActions.enableExposureNotifications()),
        },
      };
    } else if (! trackingEnabled) {
      error = {
        status: true,
        title: i18n.translate('screens.home.errors.tracking.title'),
        message: i18n.translate('screens.home.errors.tracking.message'),
        icon: <Icon name='gaen_disconnected' width={iconSizes.size32} height={iconSizes.size32} />,
        main: {
          label: i18n.translate('screens.home.errors.tracking.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.tracking.accessibility.label'),
            hint: i18n.translate('screens.home.errors.tracking.accessibility.hint'),
          },
          onPress: () => dispatch(accountActions.startTracking()),
        },
      };
    } else if (hasBluetoothError) {
      error = {
        status: true,
        title: i18n.translate(`screens.home.errors.bluetooth.${Platform.OS}.title`),
        message: i18n.translate(`screens.home.errors.bluetooth.${Platform.OS}.message`),
        icon: <Icon name='bluetooth_disconnected' width={iconSizes.size17} height={iconSizes.size28} />,
        main: {
          label: i18n.translate(`screens.home.errors.bluetooth.${Platform.OS}.label`),
          accessibility: {
            label: i18n.translate(`screens.home.errors.${Platform.OS}.bluetooth.accessibility.label`),
            hint: i18n.translate(`screens.home.errors.${Platform.OS}.bluetooth.accessibility.hint`),
          },
          onPress: Platform.select({
            android: () => TrackingManager.requestBluetoothService(),
            ios: () => Linking.openURL('App-prefs:root=Bluetooth'),
          }),
        },
      };
    } else if (hasLocationError) {
      error = {
        status: true,
        title: i18n.translate('screens.home.errors.location.title'),
        message: i18n.translate('screens.home.errors.location.message'),
        icon: <Icon name='location_disconnected' width={iconSizes.size23} height={iconSizes.size26} />,
        main: {
          label: i18n.translate('screens.home.errors.location.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.location.accessibility.label'),
            hint: i18n.translate('screens.home.errors.location.accessibility.hint'),
          },
          onPress: () => RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({}),
        },
      };
    } else if (hasBatteryError) {
      error = {
        status: true,
        title: i18n.translate('screens.home.errors.battery.title'),
        message: i18n.translate('screens.home.errors.battery.message'),
        submessage: i18n.translate('screens.home.errors.battery.submessage'),
        icon: <Icon name='battery_optimized' width={iconSizes.size14} height={iconSizes.size28} />,
        main: {
          label: i18n.translate('screens.home.errors.battery.actions.main.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.battery.actions.main.accessibility.label'),
            hint: i18n.translate('screens.home.errors.battery.actions.main.accessibility.hint'),
          },
          onPress: () => dispatch(accountActions.requestIgnoreBatteryOptimizations()),
        },
        alternative: {
          label: i18n.translate('screens.home.errors.battery.actions.alternative.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.label'),
            hint: i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.hint'),
          },
          onPress: () => Linking.openURL(i18n.translate('common.links.faqs')),
        },
      };
    }
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
