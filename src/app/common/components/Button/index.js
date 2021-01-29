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
import { StyleSheet } from 'react-native';
import { Button as NativeButton } from 'react-native-elements';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { sizes, fontSizes, fontWeights, lineHeights } from '@app/common/theme';

const MAIN = 'main';
const ALTERNATIVE = 'alternative';

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: sizes.size10,
    justifyContent: 'center',
    padding: sizes.size14,
    minHeight: lineHeights.normal + (sizes.size8  * 2),
  },
  disabledStyle: {
    opacity: 0.4,
  },
});

const common = {
  buttonStyle: styles.buttonStyle,
  disabledStyle: styles.disabledStyle,
};

const themes = (colors, theme) => {
  if (theme === MAIN) {
    return {
      ...common,
      type: 'solid',
      theme: {
        colors: {
          primary: colors.buttonMainBackgroundColor,
          disabled: colors.buttonMainBackgroundColor,
        },
      },
      titleStyle: { color: colors.buttonMainTextColor, fontSize: fontSizes.normal, lineHeight: lineHeights.normal, fontWeight: fontWeights.bold, paddingTop: 0, paddingBottom: 0},
      disabledTitleStyle: { color: colors.buttonMainTextColor, fontSize: fontSizes.normal, lineHeight: lineHeights.normal, paddingTop: 0, paddingBottom: 0},
      loadingProps: { color: colors.buttonMainTextColor, size: 'small' },
    };
  }

  return {
    ...common,
    type: 'clear',
    titleStyle: { color: colors.buttonAltTextColor, fontSize: fontSizes.small, lineHeight: lineHeights.small, fontWeight: fontWeights.normal, paddingTop: 0, paddingBottom: 0},
    disabledTitleStyle: { color: colors.buttonAltTextColor, fontSize: fontSizes.small, lineHeight: lineHeights.small, paddingTop: 0, paddingBottom: 0},
    loadingProps: { color: colors.buttonAltTextColor, size: 'large' },
  };
};


export default function Button(props) {
  const { alternative, titleStyle, loading, disabled, onPress, ...otherProps } = props;

  const { name, colors } = useTheme();
  const memoizedTheme = useMemo(() => themes(colors, alternative ? ALTERNATIVE : MAIN), [name, alternative]);

  const onPressButton = () => {
    if (!loading) {
      onPress();
    }
  };

  return (
    <NativeButton
      {...memoizedTheme}
      useForeground
      titleStyle={{...memoizedTheme.titleStyle, ...titleStyle}}
      disabled={disabled}
      loading={loading}
      accessibilityRole='button'
      accessibilityState={{
        disabled,
        busy: loading,
      }}
      {...otherProps}
      onPress={onPressButton}
    />
  );
}

Button.defaultProps = {
  alternative: false,
  loading: false,
  disabled: false,
  titleStyle: {},
  onPress: () => {},
};

Button.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  alternative: PropTypes.bool,
  onPress: PropTypes.func,
  titleStyle: PropTypes.shape({
    color: PropTypes.string,
  }),
};
