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
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Switch from '@app/common/components/Switch';
import Icon from '@app/common/components/Icon';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';

import Images from '@app/common/assets/images';

import { sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors) => StyleSheet.create({
  closeButton: {
    position: 'absolute',
    left: -sizes.size8,
    padding: sizes.size8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.size48,
    paddingVertical: sizes.size16,
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    zIndex: 10,
  },
  description: {
    marginBottom: sizes.size48,
  },
  switchContainer: {
    marginTop: sizes.size24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendContainer: {
    marginTop: sizes.size16,
  },
  content: {
    zIndex: 2,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imagesContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 0,
  },
  sponsors: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: sizes.size24,
    left: sizes.size24,
    zIndex: 0,
  },
  republicaPortuguesaImage: {
    marginRight: sizes.size24,
  },
  dgsImage: {
  },
  splashImage: {
    alignSelf: 'flex-end',
  },
});

export default function Tracking (props) {
  const {
    trackingEnabled,
    onPress,
    onClose,
  } = props;

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <Layout style={styles(colors).layoutContainer}>
            <View style={styles(colors).header}>
              <ButtonWrapper
                onPress={onClose}
                style={styles(colors).closeButton}
                accessibilityLabel={i18n.translate('screens.tracking.actions.go_back.accessibility.hint.label')}
                accessibilityHint={i18n.translate('screens.tracking.actions.go_back.accessibility.hint.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
              </ButtonWrapper>
              <Text size='xlarge' weight='bold'>{i18n.translate('screens.tracking.title')}</Text>
            </View>
            <View style={styles(colors).content}>
              <Text size='xlarge' weight='bold' style={styles(colors).description}>{i18n.translate('screens.tracking.description')}</Text>
              <ButtonWrapper
                style={styles(colors).switchContainer}
                onPress={onPress}
                accessibilityRole='switch'
                accessibilityState={{checked: trackingEnabled}}
              >
                <Text size='xlarge' style={styles(colors).switcherTitle}>{i18n.translate('screens.tracking.switch.label')}</Text>
                <Switch
                  value={trackingEnabled}
                  onValueChange={onPress}
                  accessibilityLabel={i18n.translate('screens.tracking.switch.accessibility.label')}
                />
              </ButtonWrapper>
              {trackingEnabled && <Text textColor={colors.grayDark} style={styles(colors).legendContainer}>{i18n.translate('screens.tracking.switch.legend')}</Text>}
            </View>
          </Layout>
          <View style={styles(colors).imagesContainer}>
            <View style={styles(colors).sponsors}>
              <Image source={Images.republica_portuguesa} style={styles(colors).republicaPortuguesaImage} />
              <Image source={Images.logo_dgs} style={styles(colors).dgsImage} />
            </View>
            <Image source={Images.splash} style={styles(colors).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Tracking.defaultProps = {
  trackingEnabled: false,
  onPress: () => {},
  onClose: () => {},
};

Tracking.propTypes = {
  trackingEnabled: PropTypes.bool,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
};
