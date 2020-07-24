/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Input from '@app/common/components/Input';

export default class CodeInput extends Component {
  focus() {
    return this.input?.focus();
  }

  blur() {
    return this.input?.blur();
  }

  shake() {
    return this.input?.shake();
  }

  clear() {
    return this.input?.clear();
  }

  render() {
    const { maxLength, ...otherProps } = this.props;

    return (
      <Input
        ref={element => {this.input = element}}
        maxLength={maxLength}
        keyboardType='number-pad'
        {...otherProps}
      />
    );
  }
}

CodeInput.defaultProps = {
  maxLength: 15,
};

CodeInput.propTypes = {
  maxLength: PropTypes.number,
};
