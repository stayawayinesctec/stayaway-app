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
import { useSelector } from 'react-redux';

import Info from '@settings/components/Info';

import Linking from '@app/services/linking';
import NavigationService from '@app/services/navigation';
import i18n from '@app/services/i18n';

import {
  isTrackingEnabled,
  isInfected,
} from '@app/redux/account/selectors';

import AppRoutes from '@app/navigation/routes';

export default function InfoScreen () {
  const trackingEnabled = useSelector(isTrackingEnabled);

  const props = {
    trackingEnabled,
    isInfected: useSelector(isInfected),
    onClose: () => NavigationService.navigate(AppRoutes.HOME),
    onPressTracking: () => NavigationService.navigate(AppRoutes.TRACKING),
    onPressHowToUse: () => {
      NavigationService.navigate(AppRoutes.HOW_TO_USE);
    },
    onPressFaqs: () => Linking.openURL(i18n.translate('common.links.faqs')),
    onPressTermsOfUse: () => Linking.openURL(i18n.translate('common.links.terms_of_use')),
    onPressPrivacyPolicy: () => Linking.openURL(i18n.translate('common.links.privacy_policy')),
    onPressTechnicalSheet: () => NavigationService.navigate(AppRoutes.TECHNICAL_SHEET),
    onPressDebug: () => NavigationService.navigate(AppRoutes.DEBUG),
  };

  return <Info {...props} />;
}
