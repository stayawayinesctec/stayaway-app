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
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { sizes } from '@app/common/theme';

import Text from '@app/common/components/FormattedText';
import ButtonWrapper from '@app/common/components/ButtonWrapper';

const styles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.toogleBackgroundColor,
    borderRadius: sizes.size4,
  },
  labelContainer: {},
  label: {
    backgroundColor: colors.toogleSelectedBackgroundColor,
    margin: sizes.size2,
    paddingVertical: sizes.size5,
    paddingHorizontal: sizes.size16,
    borderRadius: sizes.size4,
  },
});

export default function Toggle(props) {
  const { value, options, style, onPress,...otherProps } = props;

  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors), [name]);

  return (
    <View
      style={memoizedStyle.container}
      {...otherProps}
    >
      { Object.values(options).map(({id, label}) =>
        <ButtonWrapper
          key={id}
          onPress={() => onPress({id, label})}
          style={memoizedStyle.labelcontainer}
          accessibilityRole='switch'
          accessibilityState={{checked: value}}
        >
          <Text
            textAlign='center'
            textColor={id === value ? colors.toogleSelectedTextColor : colors.toogleTextColor}
            style={
              {
                ...memoizedStyle.label,
                backgroundColor: id === value ? colors.toogleSelectedBackgroundColor : colors.toogleBackgroundColor,
              }
            }
          >
            { label }
          </Text>
        </ButtonWrapper>,
      )}
    </View>
  );
}

Toggle.defaultProps = {
  value: '',
  options: [],
  onPress: () => {},
  style: {},
};

Toggle.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  })),
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
};
