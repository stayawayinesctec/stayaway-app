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
import { Animated, StyleSheet, TouchableOpacity,ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

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

export default class Switch extends Component {
  constructor(props) {
    super(props);

    const { value } = this.props;

    const startPosition = 0;
    const endPosition = styles.container.width - (styles.circle.width + styles.container.padding * 2);

    this.state = {
      value,
      circlePosXStart: startPosition,
      circlePosXEnd: endPosition,
      animXValue: new Animated.Value(value ? 1 : 0),
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (prevProps.value !== value) {
      this.setState({ value });
      this.runAnimation();
    }
  }

  onValueChange = () => {
    const { onValueChange, value } = this.props;

    onValueChange(!value);
  }

  runAnimation = () => {
    const { duration } = this.props;
    const { value, animXValue } = this.state;

    const animValue = {
      fromValue: value ? 0 : 1,
      toValue: value ? 1 : 0,
      duration,
      useNativeDriver: false,
    };
    Animated.timing(animXValue, animValue).start();
  }

  render() {
    const { disabled, style, ...otherProps } = this.props;
    const { value, animXValue, circlePosXStart, circlePosXEnd } = this.state;

    return (
      <ThemeConsumer>
        {({colors}) => {
          const {
            backgroundColorOn,
            backgroundColorOff,
            circleColorOn,
            circleColorOff,
            containerStyle,
            circleStyle,
          } = themes(value, colors);

          return (
            <TouchableOpacity
              onPress={() => this.onValueChange()}
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
                    backgroundColor: animXValue.interpolate({
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
                      backgroundColor: animXValue.interpolate({
                        inputRange: [ 0, 1 ],
                        outputRange: [ circleColorOff, circleColorOn ],
                      }),
                    },
                    {
                      transform: [
                        {
                          translateX: animXValue.interpolate({
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
        }}
      </ThemeConsumer>
    );
  }
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
