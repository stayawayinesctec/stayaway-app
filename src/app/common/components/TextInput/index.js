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

import Input from '@app/common/components/Input';

export default function TextInput(props) {
  const { forwardRef } = props;

  return (
    <Input
      ref={forwardRef}
      {...props}
    />
  );
}

TextInput.defaultProps = {
  forwardRef: undefined,
};

TextInput.propTypes = {
  forwardRef: PropTypes.shape({
    current: PropTypes.object,
  }),
};
