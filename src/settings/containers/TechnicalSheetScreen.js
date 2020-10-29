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

import TechnicalSheet from '@settings/components/TechnicalSheet';

import Linking from '@app/services/linking';

import NavigationService from '@app/services/navigation';
import i18n from '@app/services/i18n';

import AppRoutes from '@app/navigation/routes';

export default function TechnicalSheetScreen () {
  const props = {
    onPressCoordinator: () => Linking.openURL(i18n.translate('common.links.inesctec')),
    onPressISPUP: () => Linking.openURL(i18n.translate('common.links.ispup')),
    onPressKeyruptive: () => Linking.openURL(i18n.translate('common.links.keyruptive')),
    onPressUbirider: () => Linking.openURL(i18n.translate('common.links.ubirider')),
    onPressSPMS: () => Linking.openURL(i18n.translate('common.links.spms')),
    onClose: () => NavigationService.navigate(AppRoutes.LEGAL_INFORMATION),
  };

  return (
    <TechnicalSheet {...props} />
  );
}
