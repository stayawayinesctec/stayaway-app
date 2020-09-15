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
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeConsumer } from '@app/contexts/Theme';

import { isInfected } from '@app/redux/account/selectors';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
});

export default function TabBar (props) {
  const infected = useSelector(isInfected);
  const insets = useSafeAreaInsets();

  if (infected) {
    return null;
  }

  return (
    <ThemeConsumer>
      {({colors}) => (
        <BottomTabBar
          {...props}
          showLabel={false}
          style={{
            ...styles.container,
            height: 56 + insets.bottom,
            backgroundColor: colors.white,
          }}
        />
      )}
    </ThemeConsumer>
  );
}
