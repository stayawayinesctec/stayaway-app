/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useMemo } from 'react';
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

const styles = (colors) => StyleSheet.create({
  content: {
    flex: 0,
    borderRadius: sizes.size10,
    marginHorizontal: sizes.size24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalBackgroundColor,
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

export default function ExpiredCodeModal (props) {
  const { visible, onClose, ...otherProps } = props;

  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors), [name]);

  return (
    <Modal backdropColor={colors.backdropColor} backdropOpacity={0.8} isVisible={visible} statusBarTranslucent {...otherProps}>
      <Layout style={memoizedStyle.content}>
        <View style={memoizedStyle.titleContainer}>
          <Icon name='expired_code' width={iconSizes.size57} height={iconSizes.size67} />
        </View>
        <View style={memoizedStyle.descriptionsContainer}>
          <Text size='large' weight='bold' textAlign='center' style={memoizedStyle.contentTitle}>{i18n.translate('common.dialogs.expired_code.title')}</Text>
          <Text textAlign='center' style={memoizedStyle.contentDescription}>{i18n.translate('common.dialogs.expired_code.description')}</Text>
        </View>
        <View style={memoizedStyle.actionsContainer}>
          <Button
            title={i18n.translate('common.actions.ok')}
            containerStyle={memoizedStyle.button}
            onPress={onClose}
          />
        </View>
      </Layout>
    </Modal>
  );
}

ExpiredCodeModal.defaultProps = {
  onClose: () => {},
};

ExpiredCodeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
