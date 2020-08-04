/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { createSelector } from 'reselect';
import pickBy from 'lodash.pickby';

import {
  BATTERY_PERMISSION,
} from '@app/redux/permissions';

export const hasBatteryPermission = createSelector(
  state => state.permissions,
  permissions => permissions[BATTERY_PERMISSION],
);

export const getGrantedPermissions = createSelector(
  state => state.permissions,
  permissions => pickBy(permissions, permission => permission),
);

export const getDeniedPermissions = createSelector(
  state => state.permissions,
  permissions => pickBy(permissions, permission => !permission),
);

export default {
  hasBatteryPermission,
  getGrantedPermissions,
  getDeniedPermissions,
};
