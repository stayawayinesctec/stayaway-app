/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useEffect, useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import i18n from '@app/services/i18n';
import Linking from '@app/services/linking';
import TracingManager from '@app/services/tracing';

import Text from '@app/common/components/FormattedText';
import Icon from '@app/common/components/Icon';
import SupportIcon from '@app/common/components/SupportIcon';
import Button from '@app/common/components/Button';
import { sizes, iconSizes } from '@app/common/theme';

const styles = (colors) => StyleSheet.create({
  content: {
    borderRadius: sizes.size10,
    paddingHorizontal: sizes.size24,
    paddingTop: sizes.size24,
    paddingBottom: sizes.size24 + sizes.size14,
    backgroundColor: colors.modalBackgroundColor,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: sizes.size22,
  },
  titleIcon: {
    marginRight: sizes.size10,
  },
  descriptionContainer: {
    marginBottom: sizes.size18,
  },
  supportContainer: {
    marginTop: -sizes.size10 - (iconSizes.size30 / 2),
    marginHorizontal: sizes.size24,
  },
});

export default function ContactModal (props) {
  const { visible, onClose, ...otherProps } = props;

  const [model, setModel] = useState('');
  const [OS, setOS] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [appBuild, setAppBuild] = useState('');

  const supportEmail = i18n.translate('common.emails.support');
  const subject = i18n.translate('common.dialogs.support.subject');
  const body = i18n.translate('common.dialogs.support.body', {
    version: i18n.translate('screens.settings.version', { version: appVersion, build: appBuild }),
    OS: `${Platform.OS} ${OS}`,
    model,
  });

  useEffect(() => {
    TracingManager.getInfo()
    .then(({
      OSVersion,
      deviceModel,
      versionName,
      versionCode,
    }) => {
      setOS(OSVersion);
      setModel(deviceModel);
      setAppVersion(versionName);
      setAppBuild(versionCode);
    });
  });

  return (
    <ThemeConsumer>
      {({colors}) => (
        <Modal backdropColor={colors.backdropColor} backdropOpacity={0.8} isVisible={visible} statusBarTranslucent {...otherProps}>
          <View style={styles(colors).content}>
            <View style={styles(colors).titleContainer}>
              <Icon name='mail' width={iconSizes.size32} height={iconSizes.size21} style={styles(colors).titleIcon} />
              <Text size='large' weight='bold'>{i18n.translate('common.dialogs.contact.title')}</Text>
            </View>
            <View style={styles(colors).descriptionContainer}>
              <Text>{i18n.translate('common.dialogs.contact.description')}</Text>
            </View>
            <Button
              title={i18n.translate('common.dialogs.contact.label')}
              accessibilityLabel={i18n.translate('common.dialogs.contact.accessibility.label')}
              accessibilityHint={i18n.translate('common.dialogs.contact.accessibility.hint')}
              onPress={() => Linking.openMailComposer(supportEmail, subject, body)}
            />
          </View>
          <View style={styles(colors).supportContainer}>
            <SupportIcon />
          </View>
        </Modal>
      )}
    </ThemeConsumer>
  );
}

ContactModal.defaultProps = {
  onClose: () => {},
};

ContactModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
