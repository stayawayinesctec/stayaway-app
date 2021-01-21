/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { createContext, useContext } from 'react';
import { themes } from '@app/common/theme';

export const THEMES = {
  dark: {
    name: themes.names.dark,
    colors: themes.dark.colors,
  },
  light: {
    name: themes.names.light,
    colors: themes.light.colors,
  },
};

export const ThemeContext = createContext(THEMES.light);
export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (theme == null) {
    throw new Error('No theme value available. Make sure you are rendering `<ThemeProvider>` at the top of your app.');
  }

  return theme;
}
