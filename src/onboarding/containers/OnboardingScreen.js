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
import { useDispatch, useSelector } from 'react-redux';

import Onboarding from '@onboarding/components/Onboarding';

import accountActions from '@app/redux/account';
import { isSettingUpNewAccount } from '@app/redux/account/selectors';

export default function OnboardingScreen () {
  const dispatch = useDispatch();

  const props = {
    loading: useSelector(isSettingUpNewAccount),
    onPress: () => dispatch(accountActions.setupNewAccountRequest()),
  };

  return <Onboarding {...props} />;
}
