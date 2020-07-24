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

import RecommendationsHealthy from '@main/components/Recommendations/RecommendationsHealthy';
import RecommendationsInfected from '@main/components/Recommendations/RecommendationsInfected';

import { INFECTED_STATUS } from '@app/services/tracking';

export default function Recommendations (props) {
  const { infectionStatus, ...otherProps } = props;

  if (infectionStatus === INFECTED_STATUS.HEALTHY ) {
    return <RecommendationsHealthy {...otherProps} />;
  }

  return <RecommendationsInfected {...otherProps} />;
}

Recommendations.defaultProps = {
  infectionStatus: 0,
};

Recommendations.propTypes = {
  infectionStatus: PropTypes.number,
};
