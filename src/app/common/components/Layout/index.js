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
import {
    View,
    StyleSheet,
    ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeConsumer } from '@app/contexts/Theme';

import { sizes, themes as commonThemes } from '@app/common/theme';

const LIGHT = commonThemes.names.light;
const DARK = commonThemes.names.dark;

const styles = (colors, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  normal: {
    paddingTop: sizes.size24 + insets.top,
    paddingBottom: sizes.size24 + insets.bottom,
    paddingLeft: sizes.size24,
    paddingRight: sizes.size24,
  },
  vertical: {
    paddingTop: sizes.size24 + insets.top,
    paddingBottom: sizes.size24 + insets.bottom,
  },
  horizontal: {
    paddingLeft: sizes.size24,
    paddingRight: sizes.size24,
  },
  left: {
    paddingLeft: sizes.size24,
  },
  top: {
    paddingTop: sizes.size24 + insets.top,
  },
  right: {
    paddingRight: sizes.size24,
  },
  bottom: {
    paddingBottom: sizes.size24 + insets.bottom,
  },
});

export default function Layout(props) {
  const { padding, type, style, children, ...otherProps } = props;

  const insets = useSafeAreaInsets();

  return (
    <ThemeConsumer>
      {({name}) => {
        const theme = type || name;
        const { colors } = commonThemes[theme];

        return (
          <View
            style={{
              ...styles(colors, insets).container,
              ...styles(colors, insets)[padding],
              ...style,
            }}
            {...otherProps}
          >
            {children}
          </View>
        );
      }}
    </ThemeConsumer>
  );
}

Layout.defaultProps = {
  padding: 'normal',
  type: '',
  style: {},
  children: undefined,
};

Layout.propTypes = {
  padding: PropTypes.oneOf(['normal', 'horizontal', 'vertical', 'right', 'left', 'top', 'bottom']),
  type: PropTypes.oneOf([LIGHT, DARK, '']),
  style: ViewPropTypes.style,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.element,
  ]),
};
