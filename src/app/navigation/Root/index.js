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
import { createStackNavigator } from '@react-navigation/stack';

import AppNavigator from '@app/navigation/App';

import OnboardingScreen from '@src/onboarding/containers/OnboardingScreen';
import UnsupportedScreen from '@src/app/containers/UnsupportedScreen';

import { isOnboarding } from '@app/redux/onboarding/selectors';
import { isUnsupported } from '@app/redux/startup/selectors';

import { useTheme } from '@app/contexts/Theme';

import AppRoutes from '@app/navigation/routes';

const { Navigator, Screen } = createStackNavigator();

export default () => {
  const unsupported = useSelector(isUnsupported);
  const onboarding = useSelector(isOnboarding);

  const { colors } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.backgroundColor },
      }}
    >
      { unsupported &&
        <Screen
          name={AppRoutes.UNSUPPORTED}
          component={UnsupportedScreen}
        />
      }
      { onboarding &&
        <Screen
          name={AppRoutes.ONBOARDING}
          component={OnboardingScreen}
        />
      }
      <Screen
        name={AppRoutes.APP}
        component={AppNavigator}
      />
    </Navigator>
  );
};
