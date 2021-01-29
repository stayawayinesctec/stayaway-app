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
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import { Input as NativeInput } from 'react-native-elements';
import PropTypes from 'prop-types';

import Text from '@app/common/components/FormattedText';
import SupportIcon from '@app/common/components/SupportIcon';

import { useTheme } from '@app/contexts/Theme';

import { colors as commonColors, sizes, fontSizes, iconSizes } from '@app/common/theme';

const styles = (colors) => StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: sizes.size8,
    marginLeft: -sizes.size10 - (iconSizes.size30 / 2),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    paddingLeft: sizes.size10 + (iconSizes.size30 / 2) + sizes.size16,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inputContainer: {
    borderRadius: sizes.size10,
    borderBottomWidth: 0,
  },
  label: {
    color: colors.inputLabelColor,
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

export default function Input(props) {
  const { style, styleInputContainer, textColor, placeholderTextColor, errorMessage, forwardRef, ...otherProps } = props;

  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors), [name]);

  return (
    <View>
      <View style={memoizedStyle.wrapper}>
        <View style={memoizedStyle.iconContainer}>
          <SupportIcon />
        </View>
        <NativeInput
          containerStyle={{...memoizedStyle.container, ...style}}
          inputContainerStyle={{...memoizedStyle.inputContainer, ...styleInputContainer}}
          inputStyle={{...memoizedStyle.input, color: textColor || colors.inputTextColor}}
          labelStyle={memoizedStyle.label}
          enablesReturnKeyAutomatically
          placeholderTextColor={placeholderTextColor || colors.inputPlaceholderColor}
          ref={forwardRef}
          fontSize={fontSizes.normal}
          selectable
          renderErrorMessage={false}
          {...otherProps}
        />
      </View>
      <Text
        size='small'
        textColor={colors.inputErrorColor}
        style={memoizedStyle.error}
      >
        {errorMessage}
      </Text>
    </View>
  );
}

Input.defaultProps = {
  placeholder: '',
  textColor: '',
  placeholderTextColor: '',
  autoCapitalize: 'none',
  autoCorrect: false,
  secureTextEntry: false,
  style: {},
  styleInputContainer: {},
  onFocus: () => {},
  errorMessage: '',
  forwardRef: undefined,
};

Input.propTypes = {
  placeholder: PropTypes.string,
  textColor: PropTypes.oneOf(['', ...commonColors]),
  placeholderTextColor: PropTypes.oneOf(['', ...commonColors]),
  autoCapitalize: PropTypes.oneOf(['none', 'words', 'sentences', 'characters']),
  autoCorrect: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  onFocus: PropTypes.func,
  style: ViewPropTypes.style,
  styleInputContainer: ViewPropTypes.style,
  errorMessage: PropTypes.string,
  forwardRef: PropTypes.shape({
    current: PropTypes.object,
  }),
};
