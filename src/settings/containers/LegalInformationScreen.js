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

import LegalInformation from '@settings/components/LegalInformation';

import NavigationService from '@app/services/navigation';

import AppRoutes from '@app/navigation/routes';

export default function TechnicalSheetScreen () {
  const props = {
    onPressTermsOfUse: () => NavigationService.navigate(AppRoutes.TERMS_OF_USE),
    onPressPrivacyPolicy: () => NavigationService.navigate(AppRoutes.PRIVACY_POLICY),
    onPressTechnicalSheet: () => NavigationService.navigate(AppRoutes.TECHNICAL_SHEET),
    onClose: () => NavigationService.navigate(AppRoutes.INFO),
  };

  return (
    <LegalInformation {...props} />
  );
}
