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

import Operation from '@settings/components/Operation';

import NavigationService from '@app/services/navigation';

import AppRoutes from '@app/navigation/routes';

export default function OperationScreen () {
  const props = {
    onPress: () => NavigationService.navigate(AppRoutes.INFO),
    onClose: () => NavigationService.navigate(AppRoutes.INFO),
  };

  return <Operation {...props} />;
}
