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

import { useTheme } from '@app/contexts/Theme';

import i18n from '@app/services/i18n';

import Layout from '@app/common/components/Layout';
import Text from '@app/common/components/FormattedText';
import Icon from '@app/common/components/Icon';
import Button from '@app/common/components/Button';
import { sizes, iconSizes } from '@app/common/theme';

const styles = StyleSheet.create({
  content: {
    flex: 0,
    borderRadius: sizes.size10,
    marginHorizontal: sizes.size24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    paddingBottom: sizes.size44,
  },
  contentTitle: {
    paddingBottom: sizes.size24,
  },
  contentDescription: {
  },
  descriptionsContainer: {
    justifyContent: 'center',
    paddingBottom: sizes.size44,
  },
  actionsContainer: {
    justifyContent: 'flex-end',
  },
  button: {
  },
});

export default function InvalidCodeModal (props) {
  const { visible, onClose, ...otherProps } = props;

  const { colors } = useTheme();

  return (
    <Modal backdropColor={colors.backdropColor} backdropOpacity={0.8} isVisible={visible} statusBarTranslucent {...otherProps}>
      <Layout style={styles.content}>
        <View style={styles.titleContainer}>
          <Icon name='invalid_code' width={iconSizes.size59} height={iconSizes.size59} />
        </View>
        <View style={styles.descriptionsContainer}>
          <Text weight='bold' size='large' textAlign='center' style={styles.contentTitle}>{i18n.translate('common.dialogs.invalid_code.title')}</Text>
          <Text textAlign='center' style={styles.contentDescription}>{i18n.translate('common.dialogs.invalid_code.description')}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <Button
            title={i18n.translate('common.actions.ok')}
            containerStyle={styles.button}
            onPress={onClose}
          />
        </View>
      </Layout>
    </Modal>
  );
}

InvalidCodeModal.defaultProps = {
  onClose: () => {},
};

InvalidCodeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
