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

import Recommendations from '@main/components/Recommendations';

import i18n from '@app/services/i18n';
import Linking from '@app/services/linking';

import { getInfectionStatus } from '@app/redux/account/selectors';

export default function SettingsScreen () {
  const infectionStatus = useSelector(getInfectionStatus);
  const onPress = () => Linking.openURL(i18n.translate('common.links.min_saude_covid'));

  return (
    <Recommendations infectionStatus={infectionStatus} onPress={onPress} />
  );
}
