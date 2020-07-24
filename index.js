/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import 'react-native-gesture-handler';

import {AppRegistry, YellowBox } from 'react-native';
import App from './src/app/containers/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified.']);
