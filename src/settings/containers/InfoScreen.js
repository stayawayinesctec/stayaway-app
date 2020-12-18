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

import { themes as commonThemes } from '@app/common/theme';

import {
  isTracingEnabled,
  isInfected,
  getLanguage,
  getTheme,
} from '@app/redux/account/selectors';
import accountActions from '@app/redux/account';
import modalActions from '@app/redux/modals';

import AppRoutes from '@app/navigation/routes';

import TracingManager from '@app/services/tracing';

export default function InfoScreen () {
  const dispatch = useDispatch();
  const tracingEnabled = useSelector(isTracingEnabled);
  const language = useSelector(getLanguage);
  const theme = useSelector(getTheme);

  const [appVersion, setAppVersion] = useState('');
  const [appBuild, setAppBuild] = useState('');

  useEffect(() => {
    TracingManager.getInfo()
    .then(({
      versionName,
      versionCode,
    }) => {
      setAppVersion(versionName);
      setAppBuild(versionCode);
    });
  });

  const props = {
    tracingEnabled,
    language,
    theme,
    appVersion,
    appBuild,
    isInfected: useSelector(isInfected),
    onClose: () => NavigationService.navigate(AppRoutes.HOME),
    onPressTracing: () => dispatch(accountActions.switchTracing()),
    onPressLanguage: ({id: choosedLanguage, label}) => {
      if (choosedLanguage) {
        if (choosedLanguage !== language.languageTag) {
          dispatch(accountActions.updateLanguage(languages[label].languageTag));
        }

        return;
      }

      if (languages.EN.languageTag === language.languageTag) {
        dispatch(accountActions.updateLanguage(languages.PT.languageTag));
        return;
      }

      dispatch(accountActions.updateLanguage(languages.EN.languageTag));
    },
    onPressTheme: ({id: choosedTheme}) => {
      if (choosedTheme) {
        if (choosedTheme !== theme) {
          dispatch(accountActions.setTheme(choosedTheme));
        }

        return;
      }

      if (theme === commonThemes.names.light) {
        dispatch(accountActions.setTheme(commonThemes.names.dark));
        return;
      }

      dispatch(accountActions.setTheme(commonThemes.names.light));
    },
    onPressSupport: () => dispatch(modalActions.openContactModal()),
    onPressHowToUse: () => {
      NavigationService.navigate(AppRoutes.HOW_TO_USE);
    },
    onPressFaqs: () => Linking.openURL(i18n.translate('common.links.faqs')),
    onPressLegalInformation: () => NavigationService.navigate(AppRoutes.LEGAL_INFORMATION),
    onPressDebug: () => NavigationService.navigate(AppRoutes.DEBUG),
  };

  return <Info {...props} />;
}
