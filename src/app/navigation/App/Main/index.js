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

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '@main/containers/HomeScreen';
import DiagnosisScreen from '@main/containers/DiagnosisScreen';
import RecommendationsScreen from '@main/containers/RecommendationsScreen';

import TabIcon from '@app/common/components/TabIcon';
import TabBar from '@app/common/components/TabBar';

import AppRoutes from '@app/navigation/routes';

import i18n from '@app/services/i18n';

const { Navigator, Screen } = createBottomTabNavigator();

export default () => (
  <Navigator
    initialRouteName={AppRoutes.HOME}
    tabBar={props => <TabBar {...props} />}
    screenOptions={({ route }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        const name = route.name.toLocaleLowerCase();

        return (
          <TabIcon
            name={name}
            title={i18n.translate(`common.tab_bar.${name}`)}
            active={focused}
          />
        );
      },
      tabBarAccessibilityLabel: i18n.translate(`common.tab_bar.${route.name.toLocaleLowerCase()}`),
    })}
  >
    <Screen
      name={AppRoutes.DIAGNOSIS}
      component={DiagnosisScreen}
    />
    <Screen
      name={AppRoutes.HOME}
      component={HomeScreen}
    />
    <Screen
      name={AppRoutes.RECOMMENDATIONS}
      component={RecommendationsScreen}
    />
  </Navigator>
);
