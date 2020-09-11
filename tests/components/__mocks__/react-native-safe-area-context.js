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
import { View } from 'react-native';

const insets = {
  top: 0, left: 0, right: 0, bottom: 0,
};

const SafeAreaConsumer = ({ children }) => {
  return children(insets);
};

const SafeAreaProvider = ({ children }) => {
  return <View>{children}</View>;
};

export {
  SafeAreaConsumer,
  SafeAreaProvider,
};
