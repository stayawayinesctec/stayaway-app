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

import Debug from '@settings/components/Debug';

import NavigationService from '@app/services/navigation';

import { getStatus, getSignUpDate } from '@app/redux/account/selectors';

import AppRoutes from '@app/navigation/routes';

export default function DebugScreen () {
  const props = {
    signUp: useSelector(getSignUpDate),
    status: useSelector(getStatus),
    onClose: () => NavigationService.navigate(AppRoutes.INFO),
  };

  return (
    <Debug {...props} />
  );
}
