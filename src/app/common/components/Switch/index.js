/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { sizes } from '@app/common/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: sizes.size48 + sizes.size2,
    height: sizes.size24 + sizes.size2,
    borderRadius: sizes.size20,
    padding: sizes.size2,
  },
  circle: {
    width: sizes.size24,
    height: sizes.size24,
    borderRadius: sizes.size20,
  },
});

const themes = (value, colors) => ({
  backgroundColorOn: colors.switchBackgroundColorOn,
  backgroundColorOff: colors.switchBackgroundColorOff,
  circleColorOn: colors.switchCircleColorOn,
  circleColorOff: colors.switchCircleColorOff,
  containerStyle: { borderColor: value ? colors.switchBackgroundColorOff : colors.switchBackgroundColorOn },
});

export default function Switch(props) {
  const { value, duration, onValueChange, disabled, style, ...otherProps} = props;

  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => themes(value, colors), [name, value]);

  const {
    backgroundColorOn,
    backgroundColorOff,
    circleColorOn,
    circleColorOff,
    containerStyle,
    circleStyle,
  } = memoizedStyle;
  const circlePosXStart = 0;
  const circlePosXEnd = styles.container.width - (styles.circle.width + styles.container.padding * 2);
  const [switchAnim, setswitchAnim] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    setswitchAnim(new Animated.Value(value ? 1 : 0));

    // Run animation
    const animValue = {
      fromValue: value ? 0 : 1,
      toValue: value ? 1 : 0,
      duration,
      useNativeDriver: false,
    };
    Animated.timing(switchAnim, animValue).start();
  }, [value]);

  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      style={{
        ...style,
        opacity: disabled ? 0.4 : 1,
      }}
      accessibilityRole='switch'
      accessibilityState={{checked: value}}
      activeOpacity={0.4}
      {...otherProps}
    >
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            backgroundColor: switchAnim.interpolate({
              inputRange: [ 0, 1 ],
              outputRange: [ backgroundColorOff, backgroundColorOn ],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            circleStyle,
            {
              backgroundColor: switchAnim.interpolate({
                inputRange: [ 0, 1 ],
                outputRange: [ circleColorOff, circleColorOn ],
              }),
            },
            {
              transform: [
                {
                  translateX: switchAnim.interpolate({
                    inputRange: [ 0, 1 ],
                    outputRange: [ circlePosXStart, circlePosXEnd ],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

Switch.defaultProps = {
  value: false,
  onValueChange: () => {},
  duration: 100,
  disabled: false,
  style: {},
};

Switch.propTypes = {
  value: PropTypes.bool,
  onValueChange: PropTypes.func,
  duration: PropTypes.number,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
};
