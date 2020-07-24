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

import Tracking from '@settings/components/Tracking';

import NavigationService from '@app/services/navigation';

import accountActions from '@app/redux/account';
import { isTrackingEnabled } from '@app/redux/account/selectors';

import AppRoutes from '@app/navigation/routes';

export default function TrackingScreen () {
  const dispatch = useDispatch();

  const trackingEnabled = useSelector(isTrackingEnabled);

  const props = {
    trackingEnabled,
    onClose: () => NavigationService.navigate(AppRoutes.INFO),
    onPress: () => dispatch(accountActions.switchTracking()),
  };

  return (
    <Tracking {...props} />
  );
}
