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

import Diagnosis from '@main/components/Diagnosis';

import NavigationService from '@app/services/navigation';

import accountActions from '@app/redux/account';
import { isSubmittingDianosis, getSubmittingDiagnosisError, getInfectionStatus } from '@app/redux/account/selectors';

import AppRoutes from '@app/navigation/routes';

export default function DiagnosisScreen () {
  const dispatch = useDispatch();

  const props = {
    infectionStatus: useSelector(getInfectionStatus),
    loading: useSelector(isSubmittingDianosis),
    error: useSelector(getSubmittingDiagnosisError),
    onSubmit: (code) => dispatch(accountActions.submitDiagnosisRequest(code)),
    onPress: () => NavigationService.navigate(AppRoutes.HOME),
  };

  return (
    <Diagnosis {...props} />
  );
}
