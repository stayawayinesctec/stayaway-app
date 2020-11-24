/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useEffect, useRef } from 'react';
import { useColorScheme, Platform, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

import RootNavigator from '@app/navigation/Root';

import { LIGHT } from '@app/common/theme';
import { ThemeProvider, THEMES } from '@app/contexts/Theme';

import NavigationService from '@app/services/navigation';

import Modals from '@app/containers/Modals';

import startupActions from '@app/redux/startup';
import { isAppLaunched } from '@app/redux/startup/selectors';
import { getTheme } from '@app/redux/account/selectors';

export default function Root () {
  const dispatch = useDispatch();

  const appLaunched = useSelector(isAppLaunched);
  const storedTheme = useSelector(getTheme);
  const systemLanguage = useColorScheme();

  const theme = THEMES[storedTheme] || THEMES[systemLanguage || LIGHT];

  // Set navigationr reference
  const ref = useRef(null);
  NavigationService.setNavigationRef(ref);

  // Startup app
  useEffect(() => {
    if (appLaunched) {
      setTimeout(() => {
        // Set status bar
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('transparent');
          StatusBar.setTranslucent(true);
        }

        // Hide splash screen on resume
        SplashScreen.hide();
      }, 1500);
    } else {
      // Dispatch startup action
      dispatch(startupActions.startup());
    }
  }, [appLaunched]);

  // Re-render when theme changes
  useEffect(() => {}, [storedTheme]);

  if (! appLaunched) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <NavigationContainer ref={ref}>
          <RootNavigator />
        </NavigationContainer>
        <Modals />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
