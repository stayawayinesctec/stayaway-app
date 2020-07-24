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
import SvgIcon from 'react-native-svg-icon';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { colors as commonColors, themes as commonThemes } from '@app/common/theme';

import { ThemeConsumer } from '@app/contexts/Theme';

import svgs from './svgs';

const LIGHT = commonThemes.names.light;
const DARK = commonThemes.names.dark;

export default class Icon extends Component {
  static defaultProps = {
    fill: '',
    rotation: 0,
  };

  render() {
    const { type, rotation, tintColor, ...otherProps } = this.props;

    return (
      <ThemeConsumer>
        {({name}) => (
          <View
            style={
              !!rotation && {
                transform: [{ rotateY: `${rotation}deg` }],
              }
            }
          >
            <SvgIcon {...otherProps} svgs={svgs(commonThemes[type || name].colors, tintColor)} />
          </View>
      )}
      </ThemeConsumer>
    );
  }
}

Icon.defaultProps = {
  type: '',
  fill: '',
  rotation: 0,
  tintColor: undefined,
};

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(svgs(commonColors))).isRequired,
  type: PropTypes.oneOf([LIGHT, DARK, '']),
  fill: PropTypes.string,
  rotation: PropTypes.number,
  tintColor: PropTypes.oneOf(['', ...Object.values(commonColors)]),
};
