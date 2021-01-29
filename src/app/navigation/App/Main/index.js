/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

/* eslint-disable react/prop-types */

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
    // lazy={false}
    tabBar={props => <TabBar {...props} />}
  >
    <Screen
      name={AppRoutes.DIAGNOSIS}
      component={DiagnosisScreen}
      options={{
        tabBarIcon: ({focused}) => <TabIcon name='diagnosis' title={i18n.translate(`common.tab_bar.diagnosis`)} active={focused} />,
        tabBarAccessibilityLabel: i18n.translate(`common.tab_bar.diagnosis`),
      }}
    />
    <Screen
      name={AppRoutes.HOME}
      component={HomeScreen}
      options={{
        tabBarIcon: ({focused}) => <TabIcon name='home' title={i18n.translate(`common.tab_bar.home`)} active={focused} />,
        tabBarAccessibilityLabel: i18n.translate(`common.tab_bar.home`),
      }}
    />
    <Screen
      name={AppRoutes.RECOMMENDATIONS}
      component={RecommendationsScreen}
      options={{
        tabBarIcon: ({focused}) => <TabIcon name='recommendations' title={i18n.translate(`common.tab_bar.recommendations`)} active={focused} />,
        tabBarAccessibilityLabel: i18n.translate(`common.tab_bar.recommendations`),
      }}
    />
  </Navigator>
);
