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
import { useSelector, useDispatch } from 'react-redux';
import VersionNumber from 'react-native-version-number';

import Info from '@settings/components/Info';

import Linking from '@app/services/linking';
import NavigationService from '@app/services/navigation';
import i18n, { languages } from '@app/services/i18n';

import {
  isTrackingEnabled,
  isInfected,
  getLanguage,
} from '@app/redux/account/selectors';
import accountActions from '@app/redux/account';

import AppRoutes from '@app/navigation/routes';

export default function InfoScreen () {
  const dispatch = useDispatch();
  const trackingEnabled = useSelector(isTrackingEnabled);
  const language = useSelector(getLanguage);

  const props = {
    trackingEnabled,
    language,
    version: VersionNumber.appVersion,
    build: VersionNumber.buildVersion,
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
    onPressHowToUse: () => {
      NavigationService.navigate(AppRoutes.HOW_TO_USE);
    },
    onPressFaqs: () => Linking.openURL(i18n.translate('common.links.faqs')),
    onPressLegalInformation: () => NavigationService.navigate(AppRoutes.LEGAL_INFORMATION),
    onPressDebug: () => NavigationService.navigate(AppRoutes.DEBUG),
  };

  return <Info {...props} />;
}
