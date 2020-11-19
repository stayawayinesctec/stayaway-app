/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Info from '@settings/components/Info';

import Linking from '@app/services/linking';
import NavigationService from '@app/services/navigation';
import i18n, { languages } from '@app/services/i18n';

import {
  isTrackingEnabled,
  isInfected,
  getLanguage,
  getTheme,
} from '@app/redux/account/selectors';
import accountActions from '@app/redux/account';

import AppRoutes from '@app/navigation/routes';

import TrackingManager from '@app/services/tracking';

export default function InfoScreen () {
  const dispatch = useDispatch();
  const trackingEnabled = useSelector(isTrackingEnabled);
  const language = useSelector(getLanguage);
  const themeName = useSelector(getTheme);

  const [appVersion, setAppVersion] = useState('');
  const [appBuild, setAppBuild] = useState('');
  const [model, setModel] = useState('');
  const [OS, setOS] = useState('');
  const supportEmail = i18n.translate('common.emails.support');
  const subject = i18n.translate('common.dialogs.support.subject');
  const body = i18n.translate('common.dialogs.support.body', {
    version: i18n.translate('screens.settings.version', { version: appVersion, build: appBuild }),
    OS: `${Platform.OS} ${OS}`,
    model,
  });

  useEffect(() => {
    TrackingManager.getInfo()
    .then(({
      OSVersion,
      deviceModel,
      versionName,
      versionCode,
    }) => {
      setAppVersion(versionName);
      setAppBuild(versionCode);
      setOS(OSVersion);
      setModel(deviceModel);
    });
  });

  const getSupportEmailFormat = () => `mailto:${supportEmail}?subject=${subject}&body=${body}`;

  const props = {
    trackingEnabled,
    language,
    themeName,
    appVersion,
    appBuild,
    isInfected: useSelector(isInfected),
    onClose: () => NavigationService.navigate(AppRoutes.HOME),
    onPressTracking: () => dispatch(accountActions.switchTracking()),
    onPressLanguage: () => {
      if (languages.EN.languageTag === language.languageTag) {
        dispatch(accountActions.updateLanguage(languages.PT.languageTag));
      } else {
        dispatch(accountActions.updateLanguage(languages.EN.languageTag));
      }
    },
    onPressTheme: (themeName) => () => {
      dispatch(accountActions.updateTheme(themeName));
    },
    onPressSupport: () => Linking.openURL(getSupportEmailFormat()),
    onPressHowToUse: () => {
      NavigationService.navigate(AppRoutes.HOW_TO_USE);
    },
    onPressFaqs: () => Linking.openURL(i18n.translate('common.links.faqs')),
    onPressLegalInformation: () => NavigationService.navigate(AppRoutes.LEGAL_INFORMATION),
    onPressDebug: () => NavigationService.navigate(AppRoutes.DEBUG),
  };

  return <Info {...props} />;
}
