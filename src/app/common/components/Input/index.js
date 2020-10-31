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
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import { Input as NativeInput } from 'react-native-elements';
import PropTypes from 'prop-types';

import Text from '@app/common/components/Text';
import SupportIcon from '@app/common/components/SupportIcon';

import { ThemeConsumer } from '@app/contexts/Theme';

import { themes as commonThemes, colors as commonColors, sizes, fontSizes, iconSizes } from '@app/common/theme';

const LIGHT = commonThemes.names.light;
const DARK = commonThemes.names.dark;

const styles = (colors) => StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: sizes.size8,
    marginLeft: -sizes.size10 - (iconSizes.size30 / 2),
    shadowColor: colors.grayLight,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 25,
  },
  input: {
    paddingLeft: sizes.size10 + (iconSizes.size30 / 2) + sizes.size16,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inputContainer: {
    borderRadius: sizes.size10,
    borderBottomWidth: 0,
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
    marginLeft: sizes.size10 + (iconSizes.size30 / 2) + sizes.size16,
  },
  wrapper: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    zIndex: 5,
    elevation: 30,
  },
});

export default class Input extends Component {
  onFocus = () => {
    const { onFocus } = this.props;

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
    const { style, type, styleInputContainer, textColor, placeholderTextColor, errorMessage, ...otherProps } = this.props;

    return (
      <ThemeConsumer>
        {({name}) => {
          const { colors } = commonThemes[type || name];

          return (
            <View>
              <View style={styles(colors).wrapper}>
                <View style={styles(colors).iconContainer}>
                  <SupportIcon />
                </View>
                <NativeInput
                  containerStyle={{...styles(colors).container, ...style}}
                  inputContainerStyle={{...styles(colors).inputContainer, ...styleInputContainer}}
                  inputStyle={{...styles(colors).input, color: textColor || colors.blueDark}}
                  labelStyle={styles(colors).label}
                  enablesReturnKeyAutomatically
                  placeholderTextColor={placeholderTextColor || colors.blueLight}
                  ref={element => {this.input = element}}
                  fontSize={fontSizes.normal}
                  selectable
                  {...otherProps}
                  onFocus={this.onFocus}
                />
              </View>
              <Text
                size='small'
                textColor={colors.red}
                style={styles(colors).error}
              >
                {errorMessage}
              </Text>
            </View>
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
  errorMessage: '',
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
  errorMessage: PropTypes.string,
};
