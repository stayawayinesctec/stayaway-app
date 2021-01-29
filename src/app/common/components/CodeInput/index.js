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

export default function CodeInput(props) {
  const { maxLength, forwardRef, ...otherProps } = props;

  return (
    <Input
      forwardRef={forwardRef}
      maxLength={maxLength}
      keyboardType='number-pad'
      {...otherProps}
    />
  );
}

CodeInput.defaultProps = {
  maxLength: 15,
  forwardRef: undefined,
};

CodeInput.propTypes = {
  maxLength: PropTypes.number,
  forwardRef: PropTypes.shape({
    current: PropTypes.object,
  }),
};
