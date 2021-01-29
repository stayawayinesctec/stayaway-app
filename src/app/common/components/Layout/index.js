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
import {
    View,
    StyleSheet,
    ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@app/contexts/Theme';

import { sizes } from '@app/common/theme';

const styles = (colors, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
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
  const { padding, style, children, ...otherProps } = props;

  const insets = useSafeAreaInsets();
  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors, insets), [name, insets]);

  return (
    <View
      style={{
        ...memoizedStyle.container,
        ...memoizedStyle[padding],
        ...style,
      }}
      {...otherProps}
    >
      {children}
    </View>
  );
}

Layout.defaultProps = {
  padding: 'normal',
  style: {},
  children: undefined,
};

Layout.propTypes = {
  padding: PropTypes.oneOf(['normal', 'horizontal', 'vertical', 'right', 'left', 'top', 'bottom']),
  style: ViewPropTypes.style,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.element,
  ]),
};
