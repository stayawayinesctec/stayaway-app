/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import HowToUse from '@settings/components/HowToUse';

import NavigationService from '@app/services/navigation';

import AppRoutes from '@app/navigation/routes';

import TracingManager from '@app/services/tracing';

export default function HowToUseScreen () {
  const [shouldShowLocationScreen, setShouldShowLocationScreen] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      TracingManager.deviceSupportsLocationlessScanning()
      .then(result => setShouldShowLocationScreen(! result));
    }
  }, []);

  const props = {
    shouldShowLocationScreen,
    onPress: () => NavigationService.navigate(AppRoutes.INFO),
    onClose: () => NavigationService.navigate(AppRoutes.INFO),
  };

  return <HowToUse {...props} />;
}
