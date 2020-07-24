/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { Dimensions } from 'react-native';

export const SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

export function isUnderIPhoneX() {
  return height < guidelineBaseHeight || width < guidelineBaseWidth;
}

export function getSize() {
  if (height <= 568) {
    return SIZES.small;
  }

  if (height <= 1024) {
    return SIZES.medium;
  }

  return SIZES.large;
}

export function getSubmitImageSize() {
  if (height <= 650) {
    return 200;
  }

  if (height <= 700) {
    return 250;
  }

  if (height <=750) {
    return 300;
  }

  return 350;
}

export function getDimensions() {
  return {
    width: shortDimension,
    height: longDimension,
    size: getSize(),
  };
}

export function scale(size) {
  return shortDimension / guidelineBaseWidth * size;
}

export function verticalScale(size) {
  return longDimension / guidelineBaseHeight * size;
}

export function moderateScale(size, factor = 0.5) {
  return size + ( scale(size) - size ) * factor;
}

export default {
  width: shortDimension,
  height: longDimension,
  size: getSize(),
  getSubmitImageSize: getSubmitImageSize(),
  scale,
  verticalScale,
  moderateScale,
  isUnderIPhoneX,
};
