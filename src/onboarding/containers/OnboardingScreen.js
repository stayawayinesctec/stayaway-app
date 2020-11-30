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
import { useDispatch, useSelector } from 'react-redux';

import Onboarding from '@onboarding/components/Onboarding';

import accountActions from '@app/redux/account';
import { isSettingUpNewAccount } from '@app/redux/account/selectors';

import TracingManager from '@app/services/tracing';

export default function OnboardingScreen () {
  const dispatch = useDispatch();

  const [shouldShowLocationScreen, setShouldShowLocationScreen] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      TracingManager.deviceSupportsLocationlessScanning()
      .then(result => setShouldShowLocationScreen(! result));
    }
  }, []);

  const props = {
    loading: useSelector(isSettingUpNewAccount),
    onPress: () => dispatch(accountActions.setupNewAccountRequest()),
    shouldShowLocationScreen,
  };

  return <Onboarding {...props} />;
}
