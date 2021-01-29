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
import { Text as NativeText } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { colors as commonColors, fontSizes, lineHeights, fontWeights } from '@app/common/theme';

export default function Text(props) {
  const {
    textAlign,
    weight,
    children,
    size,
    textColor,
    numberOfLines,
    style,
    height,
    onPress,
    underline,
    ...otherProps
  } = props;

  const fontSize = fontSizes[size];
  const fontWeight = fontWeights[weight];
  const lineHeight = height || lineHeights[size];

  const { colors } = useTheme();

  const memoizedStyle = useMemo(() => ({
    ...style,
    textAlign,
    color: textColor || colors.textColor,
    fontSize,
    fontWeight,
    lineHeight,
    textDecorationLine: underline ? 'underline' : 'none',
  }));

  return (
    <NativeText
      numberOfLines={numberOfLines}
      style={memoizedStyle}
      accessibilityRole='text'
      onPress={onPress}
      {...otherProps}
    >
      {children}
    </NativeText>
  );
}

Text.defaultProps = {
  weight: 'normal',
  size: 'normal',
  textColor: '',
  textAlign: 'left',
  numberOfLines: 0,
  height: undefined,
  style: {},
  onPress: undefined,
  underline: false,
};

Text.propTypes = {
  textAlign: PropTypes.string,
  textColor: PropTypes.oneOf(['', ...commonColors]),
  size: PropTypes.oneOf(Object.keys(fontSizes)),
  weight: PropTypes.oneOf(Object.keys(fontWeights)),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
  onPress: PropTypes.func,
  underline: PropTypes.bool,
  style: NativeText.propTypes.style,
  numberOfLines: PropTypes.number,
  height: PropTypes.number,
};
