/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { Platform } from 'react-native';
import RNTooltips from 'react-native-tooltips';

import { colors as commonColors, fontSizes } from '@app/common/theme';

const POSITION = {
  LEFT: 1,
  RIGHT: 2,
  TOP: 3,
  BOTTOM: 4,
};

const DEFAULTS = {
  position: POSITION.TOP,
  tintColor: commonColors.grayLightest,
  textColor: commonColors.blueLightest,
  size: 'small',
  autoHide: true,
  clickToHide: true,
  shadow: true,
  arrow: true,
  gravity: 2,
  onHide: () => {},
  duration: Platform.select({
    ios: 4,
    android: 4000,
  }),
  corner: Platform.select({
    ios: 0,
    android: 30,
  }),
};

function getConfig(config) {
  const props = {
    ...DEFAULTS,
    ...config,
  };

  props.size = fontSizes[props.size];

  return props;
}

function show(
  text = '',
  target,
  parent,
  config = {},
) {
  const props = getConfig(config);

  return RNTooltips.Show(
    target,
    parent,
    {
      text,
      ...props,
    },
  );
}

function hide(target) {
  return RNTooltips.Dismiss(target);
}

export default {
  show,
  hide,
};
