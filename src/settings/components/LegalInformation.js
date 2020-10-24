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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { themes as commonThemes, sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';
import Icon from '@app/common/components/Icon';

import Images from '@app/common/assets/images';

const DARK = commonThemes.names.dark;

const styles = (colors, insets) => StyleSheet.create({
  container: {
  },
  closeButton: {
    position: 'absolute',
    top: sizes.size8,
    left: -sizes.size8,
    padding: sizes.size8,
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    zIndex: 10,
  },
  title: {
    paddingVertical: sizes.size16,
    marginBottom: sizes.size24,
  },
  itemsContainer: {
    marginBottom: sizes.size48,
  },
  item: {
    backgroundColor: colors.white,
    paddingLeft: sizes.size8,
    paddingRight: sizes.size16,
    paddingVertical: sizes.size18,
    marginBottom: sizes.size8,
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
    bottom: sizes.size24 + insets.bottom,
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


export default function LegalInformation(props) {
  const {
    onClose,
    onPressPrivacyPolicy,
    onPressTermsOfUse,
    onPressTechnicalSheet,
  } = props;

  const insets = useSafeAreaInsets();

  return (
    <ThemeConsumer>
      {({colors, name}) => (
        <TopComponent style={styles(colors, insets).container}>
          <Layout style={styles(colors, insets).layoutContainer}>
            <View style={styles(colors, insets).header}>
              <ButtonWrapper
                onPress={onClose}
                style={styles(colors, insets).closeButton}
                accessibilityLabel={i18n.translate('screens.legal_information.actions.back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.legal_information.actions.back.accessibility.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
              </ButtonWrapper>
              <Text size='xlarge' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.legal_information.title')}</Text>
            </View>
            <View style={styles(colors, insets).itemsContainer}>
              <ButtonWrapper
                onPress={onPressTermsOfUse}
                style={styles(colors, insets).item}
                accessibilityLabel={i18n.translate('screens.legal_information.terms_of_use.accessibility.label')}
                accessibilityHint={i18n.translate('screens.legal_information.terms_of_use.accessibility.hint')}
              >
                <Text weight='bold'>{i18n.translate('screens.legal_information.terms_of_use.label')}</Text>
                <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
              </ButtonWrapper>
              <ButtonWrapper
                onPress={onPressPrivacyPolicy}
                style={styles(colors, insets).item}
                accessibilityLabel={i18n.translate('screens.legal_information.privacy_policy.accessibility.label')}
                accessibilityHint={i18n.translate('screens.legal_information.privacy_policy.accessibility.hint')}
              >
                <Text weight='bold'>{i18n.translate('screens.legal_information.privacy_policy.label')}</Text>
                <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
              </ButtonWrapper>
              <ButtonWrapper
                onPress={onPressTechnicalSheet}
                style={styles(colors, insets).item}
                accessibilityLabel={i18n.translate('screens.legal_information.technical_sheet.accessibility.label')}
                accessibilityHint={i18n.translate('screens.legal_information.technical_sheet.accessibility.hint')}
              >
                <Text weight='bold'>{i18n.translate('screens.legal_information.technical_sheet.label')}</Text>
                <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
              </ButtonWrapper>
            </View>
          </Layout>
          <View style={styles(colors, insets).imagesContainer}>
            <View style={styles(colors, insets).sponsors}>
              <Image source={name == DARK ? Images.republica_portuguesa_dark : Images.republica_portuguesa} style={styles(colors, insets).republicaPortuguesaImage} />
              <Image source={name == DARK ? Images.logo_dgs_dark : Images.logo_dgs} style={styles(colors, insets).dgsImage} />
            </View>
            <Image source={Images.splash} style={styles(colors, insets).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

LegalInformation.defaultProps = {
  onClose: () => {},
  onPressTermsOfUse: () => {},
  onPressTechnicalSheet: () => {},
  onPressPrivacyPolicy: () => {},
};

LegalInformation.propTypes = {
  onClose: PropTypes.func,
  onPressTermsOfUse: PropTypes.func,
  onPressTechnicalSheet: PropTypes.func,
  onPressPrivacyPolicy: PropTypes.func,
};
