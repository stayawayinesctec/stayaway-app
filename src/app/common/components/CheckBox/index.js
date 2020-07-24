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
import { ViewPropTypes } from 'react-native';
import NativeCheckBox from '@react-native-community/checkbox';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { themes as commonThemes, sizes } from '@app/common/theme';

const LIGHT = commonThemes.names.light;
const DARK = commonThemes.names.dark;

export default class CheckBox extends Component {
  render() {
    const { style, type, ...otherProps } = this.props;

    return (
      <ThemeConsumer>
        {({name}) => {
          const { colors } = commonThemes[type || name];

          return (
            <NativeCheckBox
              tintColors={{true: colors.blueDark, false: colors.blueDark}}
              boxType='circle'
              lineWidth={sizes.size1}
              tintColor={colors.blueDark}
              onCheckColor={colors.blueDark}
              onFillColor={colors.white}
              onTintColor={colors.blueDark}
              {...otherProps}
            />
          );
        }}
      </ThemeConsumer>
    );
  }
}

CheckBox.defaultProps = {
  type: '',
  style: {},
};

CheckBox.propTypes = {
  type: PropTypes.oneOf([LIGHT, DARK, '']),
  style: ViewPropTypes.style,
};
