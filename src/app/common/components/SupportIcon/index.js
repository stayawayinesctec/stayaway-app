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
import { View, StyleSheet } from 'react-native';

import { ThemeConsumer } from '@app/contexts/Theme';

import Icon from '@app/common/components/Icon';

import { sizes, iconSizes } from '@app/common/theme';

const styles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: sizes.size10,
    borderRadius: sizes.size48,
    shadowColor: colors.grayLight,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
});


export default class SupportIcon extends Component {
  render() {
    return (
      <ThemeConsumer>
        {({colors}) => (
          <View style={styles(colors).container}>
            <Icon name='support' width={iconSizes.size30} height={iconSizes.size30} />
          </View>
        )}
      </ThemeConsumer>
    );
  }
}
