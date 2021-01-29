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
import { ViewPropTypes, StyleSheet, TouchableOpacity as Button } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default function ButtonWrapper(props) {
  const { style, loading, disabled, forwardRef, ...otherProps } = props;

  const buttonStyle = {
    ...styles.container,
    ...style,
    ...(disabled ? styles.disabled : {}),
  };

  return (
    <Button
      useForeground
      ref={forwardRef}
      style={buttonStyle}
      loading={loading}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{
        disabled,
        busy: loading,
      }}
      {...otherProps}
    />
  );
}

ButtonWrapper.defaultProps = {
  loading: false,
  disabled: false,
  style: {},
  forwardRef: undefined,
};

ButtonWrapper.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
  forwardRef: PropTypes.shape({
    current: PropTypes.object,
  }),
};
