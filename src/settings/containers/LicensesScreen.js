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

import Licenses from '@settings/components/Licenses';

import NavigationService from '@app/services/navigation';

import licenses from '@root/licenses.json';

import AppRoutes from '@app/navigation/routes';

export default function LicensesScreen () {
  const props = {
    onClose: () => NavigationService.navigate(AppRoutes.LEGAL_INFORMATION),
    licenses,
  };

  return (
    <Licenses {...props} />
  );
}
