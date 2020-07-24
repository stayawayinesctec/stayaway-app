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

import { createStackNavigator } from '@react-navigation/stack';

import MainNavigator from '@app/navigation/App/Main';
import SettingsNavigator from '@app/navigation/App/Settings';

import AppRoutes from '@app/navigation/routes';

const { Navigator, Screen } = createStackNavigator();

export default () => (
  <Navigator
    initialRouteName={AppRoutes.MAIN}
    headerMode='none'
  >
    <Screen
      name={AppRoutes.MAIN}
      component={MainNavigator}
    />
    <Screen
      name={AppRoutes.SETTINGS}
      component={SettingsNavigator}
    />
  </Navigator>
);
