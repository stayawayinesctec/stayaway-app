/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useMemo, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    ViewPropTypes,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import Scalling from '@app/common/utils/scalling';

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
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
    backgroundColor: colors.backgroundColor,
    margin: 0,
    padding: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

function renderScrollableContent(...args) {
  const [
    containerPadding,
    children,
    screenHeight,
    keyboardHeight,
    onContentSizeChange,
    style,
  ] = args;

  const scrollEnabled = screenHeight > Scalling.height;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        ...style.topContainer,
        paddingBottom: keyboardHeight,
      }}
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      onContentSizeChange={onContentSizeChange}
    >
      <View style={style[containerPadding]}>
        {children}
      </View>
    </KeyboardAwareScrollView>
  );
}

function renderContent(...args) {
  const [
    containerPadding,
    children,
    style,
  ] = args;

  return (
    <View style={style.topContainer}>
      <View style={style[containerPadding]}>
        {children}
      </View>
    </View>
  );
}

export default function TopComponent(props){
  const { scrollable, containerPadding, children, style, ...otherProps } = props;

  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors), [name]);

  const [screenHeight, setScreenHeight] = useState(Scalling.height);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  };

  useEffect(() => {
    function onKeyboardShow(event) {
      const { endCoordinates: { height }} = event;

      setKeyboardHeight(height);
    }

    function onKeyboardHide() {
      setKeyboardHeight(0);
    }

    Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardHide);
    };
  });

  return (
    <View
      style={{
        ...memoizedStyle.container,
        ...style,
      }}
      {...otherProps}
    >
      { scrollable && renderScrollableContent(containerPadding, children, screenHeight, keyboardHeight, onContentSizeChange, memoizedStyle)}
      { ! scrollable && renderContent(containerPadding, children, memoizedStyle)}
    </View>
  );
}

TopComponent.defaultProps = {
  containerPadding: 'normal',
  children: undefined,
  scrollable: true,
  style: {},
};

TopComponent.propTypes = {
  containerPadding: PropTypes.oneOf(['container', 'normal', 'zeroPadding']),
  scrollable: PropTypes.bool,
  style: ViewPropTypes.style,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.element,
  ]),
};
