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
import PropTypes from 'prop-types';

import HomeHealthy from '@main/components/Home/HomeHealthy';
import HomeInfected from '@main/components/Home/HomeInfected';
import HomeExposed from '@main/components/Home/HomeExposed';

import { INFECTION_STATUS } from '@app/services/tracing';

export default function Home (props) {
  const { infectionStatus } = props;

  if (infectionStatus === INFECTION_STATUS.HEALTHY ) {
    return <HomeHealthy {...props} />;
  }

  if (infectionStatus === INFECTION_STATUS.INFECTED ) {
    return <HomeInfected {...props} />;
  }

  return <HomeExposed {...props} />;
}

Home.defaultProps = {
  infectionStatus: 0,
};

Home.propTypes = {
  infectionStatus: PropTypes.number,
};
