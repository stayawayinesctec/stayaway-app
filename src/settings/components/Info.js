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
import { View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { sizes, iconSizes } from '@app/common/theme';

import Configuration from '@app/services/configuration';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';
import Icon from '@app/common/components/Icon';

import Images from '@app/common/assets/images';

import i18n from '@app/services/i18n';

const styles = (colors) => StyleSheet.create({
  container: {
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: sizes.size8,
    margin: -sizes.size8,
  },
  header: {
    marginBottom: sizes.size24,
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    zIndex: 10,
  },
  itemsContainer: {
    marginBottom: sizes.size48,
  },
  item: {
    backgroundColor: colors.white,
    paddingLeft: sizes.size8,
    paddingRight: sizes.size16,
    paddingVertical: sizes.size18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: sizes.size8,
    shadowColor: colors.grayLight,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
    marginBottom: sizes.size30,
  },
  trackingStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingStatus: {
    marginRight: sizes.size12,
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


export default function Info(props) {
  const {
    trackingEnabled,
    isInfected,
    onClose,
    onPressTermsOfUse,
    onPressPrivacyPolicy,
    onPressHowToUse,
    onPressFaqs,
    onPressTracking,
    onPressTechnicalSheet,
    onPressDebug,
  } = props;

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent style={styles(colors).container}>
          <Layout style={styles(colors).layoutContainer}>
            <View style={styles(colors).header}>
              <ButtonWrapper
                onPress={onClose}
                style={styles(colors).closeButton}
                accessibilityLabel={i18n.translate('screens.settings.actions.back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.settings.actions.back.accessibility.hint')}
              >
                <Icon name='close' width={iconSizes.size24} height={iconSizes.size24} tintColor={colors.blueDark} />
              </ButtonWrapper>
            </View>
            <View style={styles(colors).itemsContainer}>
              <ButtonWrapper style={styles(colors).item} onPress={onPressTracking} disabled={isInfected}>
                <Text weight='bold'>{i18n.translate('screens.settings.tracking.label')}</Text>
                <View style={styles(colors).trackingStatusContainer}>
                  <Text style={styles(colors).trackingStatus}>{trackingEnabled ? i18n.translate('common.words.enabled') : i18n.translate('common.words.disabled')}</Text>
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </View>
              </ButtonWrapper>
              <ButtonWrapper
                style={styles(colors).item}
                onPress={onPressHowToUse}
              >
                <Text weight='bold'>{i18n.translate('screens.settings.how_to_use.label')}</Text>
                <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
              </ButtonWrapper>
              <ButtonWrapper
                style={styles(colors).item}
                onPress={onPressFaqs}
                accessibilityRole='link'
                accessibilityLabel={i18n.translate('screens.settings.faqs.accessibility.label')}
                accessibilityHint={i18n.translate('screens.settings.faqs.accessibility.hint')}
              >
                <Text weight='bold'>{i18n.translate('screens.settings.faqs.label')}</Text>
                <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
              </ButtonWrapper>
              <ButtonWrapper
                style={styles(colors).item}
                onPress={onPressTermsOfUse}
                accessibilityRole='link'
                accessibilityLabel={i18n.translate('screens.settings.terms_of_use.accessibility.label')}
                accessibilityHint={i18n.translate('screens.settings.terms_of_use.accessibility.hint')}
              >
                <Text weight='bold'>{i18n.translate('screens.settings.terms_of_use.label')}</Text>
                <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
              </ButtonWrapper>
              <ButtonWrapper
                style={styles(colors).item}
                onPress={onPressPrivacyPolicy}
                accessibilityRole='link'
                accessibilityLabel={i18n.translate('screens.settings.privacy_policy.accessibility.label')}
                accessibilityHint={i18n.translate('screens.settings.privacy_policy.accessibility.hint')}
              >
                <Text weight='bold'>{i18n.translate('screens.settings.privacy_policy.label')}</Text>
                <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
              </ButtonWrapper>
              <ButtonWrapper style={styles(colors).item} onPress={onPressTechnicalSheet}>
                <Text weight='bold'>{i18n.translate('screens.settings.technical_sheet.label')}</Text>
                <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
              </ButtonWrapper>
              { ! Configuration.RELEASE &&
                <ButtonWrapper style={styles(colors).item} onPress={onPressDebug}>
                  <Text weight='bold'>{i18n.translate('screens.settings.debug.label')}</Text>
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
              }
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

Info.defaultProps = {
  isInfected: false,
  onClose: () => {},
  onPressTracking: () => {},
  onPressHowToUse: () => {},
  onPressFaqs: () => {},
  onPressTermsOfUse: () => {},
  onPressPrivacyPolicy: () => {},
  onPressTechnicalSheet: () => {},
  onPressDebug: () => {},
};

Info.propTypes = {
  trackingEnabled: PropTypes.bool.isRequired,
  isInfected: PropTypes.bool,
  onClose: PropTypes.func,
  onPressTracking: PropTypes.func,
  onPressHowToUse: PropTypes.func,
  onPressFaqs: PropTypes.func,
  onPressTermsOfUse: PropTypes.func,
  onPressPrivacyPolicy: PropTypes.func,
  onPressTechnicalSheet: PropTypes.func,
  onPressDebug: PropTypes.func,
};
