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
import { View , StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import Layout from '@app/common/components/Layout';
import Icon from '@app/common/components/Icon';

import { sizes, iconSizes } from '@app/common/theme';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    paddingBottom: sizes.size44,
  },
});

export default function LoadingModal (props) {
  const {
    visible,
    onClose,
    ...otherProps
  } = props;

  return (
    <ThemeConsumer>
      {({colors}) => (
        <Modal
          backdropColor={colors.blueDark}
          isVisible={visible}
          backdropOpacity={1}
          statusBarTranslucent
          {...otherProps}
        >
          <Layout style={styles.content}>
            <View style={styles.logoContainer}>
              <Icon name='logo' width={iconSizes.size100} height={iconSizes.size100} tintColor={colors.blueDark} />
            </View>
          </Layout>
        </Modal>
      )}
    </ThemeConsumer>
  );
}

LoadingModal.defaultProps = {
  onClose: () => {},
};

LoadingModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
