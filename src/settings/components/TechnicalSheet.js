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
import Icon from '@app/common/components/Icon';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';

import Images from '@app/common/assets/images';

import { sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors) => StyleSheet.create({
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
    marginBottom: sizes.size16,
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
    width: '100%',
    bottom: sizes.size24,
    paddingHorizontal: sizes.size24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 0,
  },
  sponsorsImages: {
    flexDirection: 'row',
  },
  republicaPortuguesaImage: {
    marginRight: sizes.size24,
  },
  dgsImage: {
  },
  splashImage: {
    alignSelf: 'flex-end',
  },
  version: {
    alignSelf: 'flex-end',
  },
});

export default function TechnicalSheet (props) {
  const {
    version,
    build,
    onPressCoordinator,
    onPressISPUP,
    onPressKeyruptive,
    onPressUbirider,
    onPressSPMS,
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
                accessibilityLabel={i18n.translate('screens.technical_sheet.actions.go_back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.technical_sheet.actions.go_back.accessibility.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
              </ButtonWrapper>
              <Text size='xlarge' weight='bold' style={styles(colors).title}>{i18n.translate('screens.technical_sheet.title')}</Text>
            </View>
            <View style={styles(colors).itemsContainer}>
              <View style={styles(colors).coordinatorContainer}>
                <Text size='small' textColor={colors.grayDark} style={styles(colors).itemLabel}>{i18n.translate('screens.technical_sheet.coordination')}</Text>
                <ButtonWrapper
                  style={styles(colors).item}
                  onPress={onPressCoordinator}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.technical_sheet.inesctec.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.technical_sheet.inesctec.accessibility.hint')}
                >
                  <Image source={Images.logo_inesctec} />
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
              </View>
              <View style={styles(colors).partnersContainer}>
                <Text size='small' textColor={colors.grayDark} style={styles(colors).itemLabel}>{i18n.translate('screens.technical_sheet.partners')}</Text>
                <ButtonWrapper
                  style={{
                    ...styles(colors).item,
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
                  style={styles(colors).item}
                  onPress={onPressKeyruptive}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.technical_sheet.keyruptive.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.technical_sheet.keyruptive.accessibility.hint')}
                >
                  <Image source={Images.logo_keyruptive} />
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                <ButtonWrapper
                  style={styles(colors).item}
                  onPress={onPressUbirider}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.technical_sheet.ubirider.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.technical_sheet.ubirider.accessibility.hint')}
                >
                  <Image source={Images.logo_ubirider} />
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                <ButtonWrapper
                  style={styles(colors).item}
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
          <View style={styles(colors).imagesContainer}>
            <View style={styles(colors).sponsors}>
              <View style={styles(colors).sponsorsImages}>
                <Image source={Images.republica_portuguesa} style={styles(colors).republicaPortuguesaImage} />
                <Image source={Images.logo_dgs} style={styles(colors).dgsImage} />
              </View>
              <Text size='small' weight='bold' style={styles(colors).version}>{i18n.translate('screens.technical_sheet.version', { version, build })}</Text>
            </View>
            <Image source={Images.splash} style={styles(colors).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

TechnicalSheet.defaultProps = {
  version: '1.0.0',
  build: '0',
  onPressCoordinator: () => {},
  onPressISPUP: () => {},
  onPressKeyruptive: () => {},
  onPressUbirider: () => {},
  onPressSPMS: () => {},
  onClose: () => {},
};

TechnicalSheet.propTypes = {
  version: PropTypes.string,
  build: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPressCoordinator: PropTypes.func,
  onPressISPUP: PropTypes.func,
  onPressKeyruptive: PropTypes.func,
  onPressUbirider: PropTypes.func,
  onPressSPMS: PropTypes.func,
  onClose: PropTypes.func,
};
