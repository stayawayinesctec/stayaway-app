/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useState } from 'react';
import { Animated, Easing, View , StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import i18n from '@app/services/i18n';

import Layout from '@app/common/components/Layout';
import Text from '@app/common/components/FormattedText';
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
    onModalWillShow,
    onModalWillHide,
    ...otherProps
  } = props;

  const { colors } = useTheme();

  const [spinAnim] = useState(new Animated.Value(0));

  const spinAnimation = Animated.loop(Animated.timing(
    spinAnim,
    {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    },
  ));

  const modalShow = () => {
    onModalWillShow();
    spinAnimation.start();
  };

  const modalHide = () => {
    onModalWillHide();
    spinAnimation.stop();
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animationStyle = {transform: [{rotate: spin}]};

  return (
    <Modal
      backdropColor={colors.backdropColor}
      backdropOpacity={0.8}
      isVisible={visible}
      statusBarTranslucent
      onModalWillHide={modalHide}
      onModalWillShow={modalShow}
      {...otherProps}
    >
      <Layout style={styles.content}>
        <View style={styles.logoContainer}>
          <Animated.View style={animationStyle}>
            <Icon name='loading' width={iconSizes.size100} height={iconSizes.size100} tintColor={colors.loadingIconTintColor} />
          </Animated.View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text textAlign='center' textColor={colors.loadingTextColor}>{i18n.translate('common.dialogs.loading.description')}</Text>
        </View>
      </Layout>
    </Modal>
  );
}

LoadingModal.defaultProps = {
  onModalWillShow: () => {},
  onModalWillHide: () => {},
  onClose: () => {},
};

LoadingModal.propTypes = {
  onModalWillShow: PropTypes.func,
  onModalWillHide: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
