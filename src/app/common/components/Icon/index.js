/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useMemo } from 'react';
import SvgIcon from 'react-native-svg-icon';

import { themes as commonThemes } from '@app/common/theme';

import { useTheme } from '@app/contexts/Theme';

import darkSvgs from './svgs_dark';
import lightSvgs from './svgs_light';

export default function Icon(props) {
  const { name } = useTheme();

  const svgs = useMemo(() => name === commonThemes.names.light ? lightSvgs : darkSvgs, [name]);

  return (
    <SvgIcon {...props} svgs={svgs} />
  );
}
