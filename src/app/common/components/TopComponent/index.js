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
import {
    View,
    StyleSheet,
    Keyboard,
    ViewPropTypes,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { themes as commonThemes } from '@app/common/theme';

import Scalling from '@app/common/utils/scalling';

const LIGHT = commonThemes.names.light;
const DARK = commonThemes.names.dark;

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topContainer: {
    flexGrow: 1,
  },
  normal: {
    flexGrow: 1,
    alignItems: 'stretch',
  },
  zeroPadding: {
    flex: 1,
    backgroundColor: colors.white,
    margin: 0,
    padding: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export default class TopComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenHeight: Scalling.height,
    };
  };

  componentDidMount () {
    const keyboardListeners = [
      Keyboard.addListener('keyboardDidShow', (e) => this.setState({ keyboardHeight: e.endCoordinates.height })),
      Keyboard.addListener('keyboardDidHide', () => this.setState({ keyboardHeight: 0 })),
    ];

    this.setState({ keyboardListeners });
  }

  componentWillUnmount () {
    const { keyboardListeners } = this.state;

    keyboardListeners.map(listener => listener.remove());
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  }

  renderScrollableContent(colors) {
    const { containerPadding, children } = this.props;
    const { screenHeight, keyboardHeight } = this.state;

    const scrollEnabled = screenHeight > Scalling.height;

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          ...styles(colors).topContainer,
          paddingBottom: keyboardHeight,
        }}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={this.onContentSizeChange}
      >
        <View style={styles(colors)[containerPadding]}>
          {children}
        </View>
      </KeyboardAwareScrollView>
    );
  }

  renderContent(colors) {
    const { containerPadding, children } = this.props;

    return (
      <View style={styles(colors).topContainer}>
        <View style={styles(colors)[containerPadding]}>
          {children}
        </View>
      </View>
    );
  }

  render() {
    const { scrollable, type, style, ...otherProps } = this.props;

    return (
      <ThemeConsumer>
        {({name}) => {
          const theme = type || name;
          const { colors } = commonThemes[theme];

          return (
            <View
              style={{
                ...styles(colors).container,
                ...style,
              }}
              {...otherProps}
            >
              { scrollable && this.renderScrollableContent(colors)}
              { ! scrollable && this.renderContent(colors)}
            </View>
          );
        }}
      </ThemeConsumer>
    );
  }
}

TopComponent.defaultProps = {
  containerPadding: 'normal',
  children: undefined,
  scrollable: true,
  type: '',
  style: {},
};

TopComponent.propTypes = {
  containerPadding: PropTypes.oneOf(['container', 'normal', 'zeroPadding']),
  scrollable: PropTypes.bool,
  type: PropTypes.oneOf([LIGHT, DARK, '']),
  style: ViewPropTypes.style,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.element,
  ]),
};
