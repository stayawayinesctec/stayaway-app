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
import { Platform, Share } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import Home from '@main/components/Home';

import Icon from '@app/common/components/Icon';

import NavigationService from '@app/services/navigation';
import Configuration from '@app/services/configuration';
import i18n from '@app/services/i18n';
import TracingManager, { INFECTION_STATUS } from '@app/services/tracing';
import Linking from '@app/services/linking';

import { iconSizes } from '@app/common/theme';

import accountActions from '@app/redux/account';
import {
  getInfectionStatus,
  getLastSync,
  isTracingEnabled,
  hasBluetoothDisabledError,
  hasLocationDisabledError,
  hasBatteryOptimizerError,
  hasExposureNotificationsDisabledError,
} from '@app/redux/account/selectors';

import AppRoutes from '@app/navigation/routes';

export default function HomeScreen () {
  const dispatch = useDispatch();

  const tracingEnabled = useSelector(isTracingEnabled);
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
    icon: () => {},
    onPress: () => {},
  };

  if (infectionStatus !== INFECTION_STATUS.INFECTED) {
    if (hasExposureNotificationsError) {
      error = {
        status: true,
        title: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.title`),
        message: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.message`),
        icon: (colors) => <Icon name='gaen_disconnected' width={iconSizes.size32} height={iconSizes.size32} tintColor={colors.iconMainTintColor} />,
        main: {
          label: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.label`),
          accessibility: {
            label: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.accessibility.label`),
            hint: i18n.translate(`screens.home.errors.gaen.${Platform.OS}.accessibility.hint`),
          },
          onPress: () => dispatch(accountActions.enableExposureNotifications()),
        },
      };
    } else if (! tracingEnabled) {
      error = {
        status: true,
        title: i18n.translate('screens.home.errors.tracing.title'),
        message: i18n.translate('screens.home.errors.tracing.message'),
        icon: (colors) => <Icon name='gaen_disconnected' width={iconSizes.size32} height={iconSizes.size32} tintColor={colors.iconMainTintColor} />,
        main: {
          label: i18n.translate('screens.home.errors.tracing.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.tracing.accessibility.label'),
            hint: i18n.translate('screens.home.errors.tracing.accessibility.hint'),
          },
          onPress: () => dispatch(accountActions.startTracing()),
        },
      };
    } else if (hasBluetoothError) {
      error = {
        status: true,
        title: i18n.translate(`screens.home.errors.bluetooth.${Platform.OS}.title`),
        message: i18n.translate(`screens.home.errors.bluetooth.${Platform.OS}.message`),
        icon: (colors) => <Icon name='bluetooth_disconnected' width={iconSizes.size17} height={iconSizes.size28} tintColor={colors.iconMainTintColor} />,
        main: {
          label: i18n.translate(`screens.home.errors.bluetooth.${Platform.OS}.label`),
          accessibility: {
            label: i18n.translate(`screens.home.errors.${Platform.OS}.bluetooth.accessibility.label`),
            hint: i18n.translate(`screens.home.errors.${Platform.OS}.bluetooth.accessibility.hint`),
          },
          onPress: Platform.select({
            android: () => TracingManager.requestBluetoothService(),
            ios: () => Linking.openURL('App-prefs:root=Bluetooth'),
          }),
        },
      };
    } else if (hasLocationError) {
      error = {
        status: true,
        title: i18n.translate('screens.home.errors.location.title'),
        message: i18n.translate('screens.home.errors.location.message'),
        icon: (colors) => <Icon name='location_disconnected' width={iconSizes.size23} height={iconSizes.size26} tintColor={colors.iconMainTintColor} />,
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
        icon: (colors) => <Icon name='battery_optimized' width={iconSizes.size14} height={iconSizes.size28} tintColor={colors.iconMainTintColor} />,
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

  const onLongPressSettings = () => {
    if (Configuration.UI) {
      dispatch(
        accountActions.setInfectionStatus(infectionStatus === 2 ? 0 : infectionStatus + 1),
      );
    }
  };

  const props = {
    infectionStatus,
    lastSync: useSelector(getLastSync),
    error,
    onPressSettings: () => NavigationService.navigate(AppRoutes.SETTINGS),
    onPressShare: () => Share.share({
      title: i18n.translate('common.dialogs.share.subject'),
      message: i18n.translate('common.dialogs.share.message', { app_store: i18n.translate('common.links.stores.app_store'), play_store: i18n.translate('common.links.stores.play_store')}),
    }, {
      dialogTitle: i18n.translate('common.dialogs.share.subject'),
      subject: i18n.translate('common.dialogs.share.subject'),
    }),
    onLongPressSettings,
  };

  return (
    <Home {...props} />
  );
}
