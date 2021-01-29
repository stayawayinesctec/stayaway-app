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
import { ViewPropTypes } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import NativeCheckBox from '@react-native-community/checkbox';

import { useTheme } from '@app/contexts/Theme';

import { sizes } from '@app/common/theme';

export default function CheckBox(props) {
  const { style, ...otherProps } = props;

  const { colors } = useTheme();

  return (
    <NativeCheckBox
      tintColors={{true: colors.checkBoxTintTrueColor, false: colors.checkBoxTintFalseColor}}
      boxType='circle'
      lineWidth={sizes.size1}
      tintColor={colors.checkBoxTintTrueColor}
      onCheckColor={colors.checkBoxOnCheckColor}
      onFillColor={colors.checkBoxOnFillColor}
      onTintColor={colors.checkBoxOnTintColor}
      {...otherProps}
    />
  );
}

CheckBox.defaultProps = {
  style: {},
};

CheckBox.propTypes = {
  style: ViewPropTypes.style,
};
