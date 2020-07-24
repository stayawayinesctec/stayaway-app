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
import { ViewPropTypes, StyleSheet } from 'react-native';
import { Input as NativeInput } from 'react-native-elements';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { themes as commonThemes, colors as commonColors, sizes, fontSizes } from '@app/common/theme';

const LIGHT = commonThemes.names.light;
const DARK = commonThemes.names.dark;

const styles = (colors) => StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  input: {
    paddingHorizontal: sizes.size10,
    paddingVertical: sizes.size14,
  },
  inputContainer: {
    borderRadius: sizes.size10,
    borderWidth: sizes.size1,
    borderColor: colors.grayDark,
  },
  label: {
    color: colors.blueDark,
    fontWeight: 'normal',
    marginBottom: sizes.size10,
  },
  error: {
    margin: 0,
    marginTop: sizes.size16,
    fontSize: fontSizes.small,
    color: colors.red,
  },
});

export default class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputWidth: '99%',
    };
  }

  onFocus = () => {
    const { onFocus } = this.props;

    this.setState({ inputWidth: 'auto' });
    onFocus();
  }


  focus() {
    return this.input?.focus();
  }

  isFocused() {
    return this.input?.isFocused;
  }

  blur() {
    return this.input?.blur();
  }

  shake() {
    return this.input?.shake();
  }

  clear() {
    return this.input?.clear();
  }

  render() {
    const { style, type, styleInputContainer, textColor, placeholderTextColor, ...otherProps } = this.props;
    const { inputWidth } = this.state;

    return (
      <ThemeConsumer>
        {({name}) => {
          const { colors } = commonThemes[type || name];

          return (
            <NativeInput
              containerStyle={[{...styles(colors).container, ...style}, {width: inputWidth}]}
              inputContainerStyle={{...styles(colors).inputContainer, ...styleInputContainer}}
              inputStyle={{...styles(colors).input, color: textColor || colors.blueDark}}
              labelStyle={styles(colors).label}
              errorStyle={styles(colors).error}
              enablesReturnKeyAutomatically
              placeholderTextColor={placeholderTextColor || colors.blueLight}
              ref={element => {this.input = element}}
              fontSize={fontSizes.normal}
              selectable
              {...otherProps}
              onFocus={this.onFocus}
            />
          );
        }}
      </ThemeConsumer>
    );
  }
}

Input.defaultProps = {
  placeholder: '',
  textColor: '',
  placeholderTextColor: '',
  autoCapitalize: 'none',
  autoCorrect: false,
  secureTextEntry: false,
  type: '',
  style: {},
  styleInputContainer: {},
  onFocus: () => {},
};

Input.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.oneOf([LIGHT, DARK, '']),
  textColor: PropTypes.oneOf(['', ...Object.values(commonColors)]),
  placeholderTextColor: PropTypes.oneOf(['', ...Object.values(commonColors)]),
  autoCapitalize: PropTypes.oneOf(['none', 'words', 'sentences', 'characters']),
  autoCorrect: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  onFocus: PropTypes.func,
  style: ViewPropTypes.style,
  styleInputContainer: ViewPropTypes.style,
};
