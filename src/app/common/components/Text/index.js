/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { PureComponent as Component } from 'react';
import { Text as NativeText } from 'react-native';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { colors as commonColors, fontSizes, lineHeights, fontWeights } from '@app/common/theme';

export default class Text extends Component {
  render() {
    const {
      textAlign,
      weight,
      children,
      size,
      textColor,
      numberOfLines,
      style,
      height,
      ...otherProps
    } = this.props;

    const fontSize = fontSizes[size];
    const fontWeight = fontWeights[weight];
    const lineHeight = height || lineHeights[size];

    return (
      <ThemeConsumer>
        {({colors}) => (
          <NativeText
            numberOfLines={numberOfLines}
            style={{
              ...style,
              textAlign,
              color: textColor || colors.textColor,
              fontSize,
              fontWeight,
              lineHeight,
            }}
            accessibilityRole='text'
            {...otherProps}
          >
            {children}
          </NativeText>
        )}
      </ThemeConsumer>
    );
  }
}

Text.defaultProps = {
  weight: 'normal',
  size: 'normal',
  textColor: '',
  textAlign: 'left',
  numberOfLines: 0,
  height: undefined,
  style: {},
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
  style: NativeText.propTypes.style,
  numberOfLines: PropTypes.number,
  height: PropTypes.number,
};
