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

import CodeInput from '@main/components/Diagnosis/CodeInput';
import Completed from '@main/components/Diagnosis/Completed';

import { INFECTION_STATUS } from '@app/services/tracing';

export default function Diagnosis (props) {
  const { infectionStatus } = props;

  if (infectionStatus === INFECTION_STATUS.INFECTED ) {
    return <Completed {...props} />;
  }

  return <CodeInput {...props} />;
}

Diagnosis.propTypes = {
  infectionStatus: PropTypes.number.isRequired,
};
