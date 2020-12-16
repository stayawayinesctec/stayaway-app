/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { Platform, StatusBar } from 'react-native';

import Scalling, { isUnderIPhoneX, SIZES } from '@app/common/utils/scalling';

export default {
  screenWidth: Scalling.width,
  screenHeight: Scalling.height,
  navBarHeight: Platform.select({
    ios: 64,
    android: 54,
  }),
  statusBarHeight: Platform.select({
    ios: isUnderIPhoneX() ? 20 : 44,
    android: StatusBar.currentHeight,
  }),
  size1: 1,
  size2: Scalling.size === SIZES.small ? 1 : 2,
  size3: Scalling.size === SIZES.small ? 2 : 3,
  size4: Scalling.size === SIZES.small ? 2 : 4,
  size5: Scalling.size === SIZES.small ? 5 : 4,
  size6: Scalling.size === SIZES.small ? 3 : 6,
  size8: Scalling.size === SIZES.small ? 4 : 8,
  size10: Scalling.size === SIZES.small ? 5 : 10,
  size12: Scalling.size === SIZES.small ? 6 : 12,
  size14: Scalling.size === SIZES.small ? 7 : 14,
  size16: Scalling.size === SIZES.small ? 8 : 16,
  size18: Scalling.size === SIZES.small ? 10 : 18,
  size20: Scalling.size === SIZES.small ? 12 : 20,
  size22: Scalling.size === SIZES.small ? 14 : 22,
  size24: Scalling.size === SIZES.small ? 16 : 24,
  size25: Scalling.size === SIZES.small ? 17 : 25,
  size26: Scalling.size === SIZES.small ? 18 : 26,
  size27: Scalling.size === SIZES.small ? 19 : 27,
  size30: Scalling.size === SIZES.small ? 22 : 30,
  size32: Scalling.size === SIZES.small ? 24 : 32,
  size34: Scalling.size === SIZES.small ? 28 : 34,
  size38: Scalling.size === SIZES.small ? 38 : 34,
  size40: Scalling.size === SIZES.small ? 36 : 40,
  size44: Scalling.size === SIZES.small ? 38 : 44,
  size48: Scalling.size === SIZES.small ? 40 : 48,
};
