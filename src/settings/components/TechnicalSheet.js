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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Icon from '@app/common/components/Icon';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';

import Images from '@app/common/assets/images';

import { themes as commonThemes, sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const DARK = commonThemes.names.dark;

const styles = (colors, insets) => StyleSheet.create({
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
  itemsContainer: {
    marginBottom: sizes.size48,
  },
  title: {
    paddingVertical: sizes.size16,
    marginBottom: sizes.size24,
  },
  legendContainer: {
    marginTop: sizes.size16,
  },
  coordinatorContainer: {
    marginBottom: sizes.size8,
  },
  itemLabel: {
    marginLeft: sizes.size8,
    marginBottom: sizes.size8,
  },
  item: {
    backgroundColor: colors.white,
    paddingLeft: sizes.size16,
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

export default function TechnicalSheet (props) {
  const {
    onPressCoordinator,
    onPressISPUP,
    onPressKeyruptive,
    onPressUbirider,
    onPressSPMS,
    onClose,
  } = props;

  const insets = useSafeAreaInsets();

  return (
    <ThemeConsumer>
      {({colors, name}) => (
        <TopComponent>
          <Layout style={styles(colors, insets).layoutContainer}>
            <View style={styles(colors, insets).header}>
              <ButtonWrapper
                onPress={onClose}
                style={styles(colors, insets).closeButton}
                accessibilityLabel={i18n.translate('screens.technical_sheet.actions.back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.technical_sheet.actions.back.accessibility.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
              </ButtonWrapper>
              <Text size='xlarge' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.technical_sheet.title')}</Text>
            </View>
            <View style={styles(colors, insets).itemsContainer}>
              <View style={styles(colors, insets).coordinatorContainer}>
                <Text size='small' weight='bold' textColor={colors.gray} style={styles(colors, insets).itemLabel}>{i18n.translate('screens.technical_sheet.coordination')}</Text>
                <ButtonWrapper
                  style={styles(colors, insets).item}
                  onPress={onPressCoordinator}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.technical_sheet.inesctec.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.technical_sheet.inesctec.accessibility.hint')}
                >
                  <Image source={name === DARK ? Images.logo_inesctec_dark : Images.logo_inesctec} />
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
              </View>
              <View style={styles(colors, insets).partnersContainer}>
                <Text size='small' weight='bold' textColor={colors.gray} style={styles(colors, insets).itemLabel}>{i18n.translate('screens.technical_sheet.partners')}</Text>
                <ButtonWrapper
                  style={{
                    ...styles(colors, insets).item,
                    paddingVertical: sizes.size8,
                  }}
                  onPress={onPressISPUP}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.technical_sheet.ispup.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.technical_sheet.ispup.accessibility.hint')}
                >
                  <Image source={Images.logo_ispup} />
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                <ButtonWrapper
                  style={styles(colors, insets).item}
                  onPress={onPressKeyruptive}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.technical_sheet.keyruptive.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.technical_sheet.keyruptive.accessibility.hint')}
                >
                  <Image source={Images.logo_keyruptive} />
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                <ButtonWrapper
                  style={styles(colors, insets).item}
                  onPress={onPressUbirider}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.technical_sheet.ubirider.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.technical_sheet.ubirider.accessibility.hint')}
                >
                  <Image source={name === DARK ? Images.logo_ubirider_dark : Images.logo_ubirider} />
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                <ButtonWrapper
                  style={styles(colors, insets).item}
                  onPress={onPressSPMS}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.technical_sheet.spms.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.technical_sheet.spms.accessibility.hint')}
                >
                  <Image source={Images.logo_spms} />
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
              </View>
            </View>
          </Layout>
          <View style={styles(colors, insets).imagesContainer}>
            <View style={styles(colors, insets).sponsors}>
              <Image source={name === DARK ? Images.republica_portuguesa_dark : Images.republica_portuguesa} style={styles(colors, insets).republicaPortuguesaImage} />
              <Image source={Images.logo_dgs} style={styles(colors, insets).dgsImage} />
            </View>
            <Image source={Images.splash} style={styles(colors, insets).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

TechnicalSheet.defaultProps = {
  onPressCoordinator: () => {},
  onPressISPUP: () => {},
  onPressKeyruptive: () => {},
  onPressUbirider: () => {},
  onPressSPMS: () => {},
  onClose: () => {},
};

TechnicalSheet.propTypes = {
  onPressCoordinator: PropTypes.func,
  onPressISPUP: PropTypes.func,
  onPressKeyruptive: PropTypes.func,
  onPressUbirider: PropTypes.func,
  onPressSPMS: PropTypes.func,
  onClose: PropTypes.func,
};
