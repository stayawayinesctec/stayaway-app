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

import Configuration from '@app/services/configuration';
import i18n, { languages } from '@app/services/i18n';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';
import Icon from '@app/common/components/Icon';
import Switch from '@app/common/components/Switch';

import Images from '@app/common/assets/images';

const DARK = commonThemes.names.dark;

const styles = (colors, insets) => StyleSheet.create({
  container: {
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: sizes.size8,
    margin: -sizes.size8,
  },
  header: {
    marginBottom: sizes.size16,
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    zIndex: 10,
  },
  itemsContainer: {
    marginBottom: sizes.size48,
  },
  topItems: {
    marginBottom: sizes.size48,
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: sizes.size16,
  },
  trackingItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  topItem: {
    borderTopLeftRadius: sizes.size8,
    borderTopRightRadius: sizes.size8,
    borderTopWidth: 0,
  },
  bottomItem: {
    borderBottomLeftRadius: sizes.size8,
    borderBottomRightRadius: sizes.size8,
  },
  item: {
    backgroundColor: colors.white,
    paddingLeft: sizes.size16,
    paddingRight: sizes.size16,
    paddingVertical: sizes.size18,
    borderTopWidth: sizes.size1,
    borderColor: colors.grayLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.grayLight,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  trackingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingLabel: {
    marginRight: sizes.size8,
  },
  languageLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: sizes.size4,
  },
  languageLabel: {
    backgroundColor: colors.blueLightest,
    margin: sizes.size2,
    paddingVertical: sizes.size5,
    paddingHorizontal: sizes.size16,
    borderRadius: sizes.size4,
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
  version: {
    alignSelf: 'flex-end',
    marginBottom: sizes.size8,
  },
});


export default function Info(props) {
  const {
    appVersion,
    appBuild,
    language,
    themeName,
    trackingEnabled,
    isInfected,
    onClose,
    onPressLanguage,
    onPressTheme,
    onPressSupport,
    onPressLegalInformation,
    onPressHowToUse,
    onPressFaqs,
    onPressTracking,
    onPressDebug,
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
                accessibilityLabel={i18n.translate('screens.settings.actions.back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.settings.actions.back.accessibility.hint')}
              >
                <Icon name='close' width={iconSizes.size24} height={iconSizes.size24} tintColor={colors.blueDark} />
              </ButtonWrapper>
            </View>
            <View style={styles(colors, insets).itemsContainer}>
              <Text size='small' weight='bold' textColor={colors.gray} style={styles(colors, insets).version}>{i18n.translate('screens.settings.version', { version: appVersion, build: appBuild })}</Text>
              <View style={styles(colors, insets).topItems}>
                <ButtonWrapper
                  onPress={onPressTracking}
                  style={{
                    ...styles(colors, insets).item,
                    ...styles(colors, insets).topItem,
                    ...styles(colors, insets).trackingItem,
                    backgroundColor: trackingEnabled ? colors.blueLightest : colors.white,
                  }}
                  disabled={isInfected}
                  accessibilityRole='switch'
                  accessibilityValue={{text: trackingEnabled}}
                  accessibilityLabel={i18n.translate('screens.settings.tracking.accessibility.label')}
                  accessibilityHint={i18n.translate(`screens.settings.tracking.accessibility.hint.${trackingEnabled ? 'deactivate' : 'activate'}`)}
                >
                  <View style={styles(colors, insets).trackingButton}>
                    <Text textColor={trackingEnabled ? colors.white : colors.blueDark} weight='bold'>{i18n.translate('screens.settings.tracking.label')}</Text>
                    <View style={styles(colors, insets).trackingLabelContainer}>
                      <Text textColor={trackingEnabled ? colors.white : colors.blueDark} weight='bold' style={styles(colors, insets).trackingLabel}>{trackingEnabled ? i18n.translate('common.words.enabled') : i18n.translate('common.words.disabled')}</Text>
                      <Switch
                        value={trackingEnabled}
                        onValueChange={onPressTracking}
                        accessibilityLabel={i18n.translate('screens.settings.tracking.accessibility.label')}
                        accessibilityHint={i18n.translate(`screens.settings.tracking.accessibility.hint.${trackingEnabled ? 'deactivate' : 'activate'}`)}
                      />
                    </View>
                  </View>
                  <Text size='small' textColor={trackingEnabled ? colors.white : colors.blueDark}>{i18n.translate(`screens.settings.tracking.description.${trackingEnabled ? 'enabled' : 'disabled'}`)}</Text>
                </ButtonWrapper>
                <ButtonWrapper
                  onPress={onPressLanguage}
                  style={styles(colors, insets).item}
                  accessibilityLabel={i18n.translate('screens.settings.language.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.language.accessibility.hint')}
                  accessibilityRole='switch'
                  accessibilityValue={{text: language.name}}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.language.label')}</Text>
                  <View style={styles(colors, insets).languageLabelContainer}>
                    { Object.values(languages).map(({ languageTag, countryCode }) =>
                      <Text
                        textAlign='center'
                        key={languageTag}
                        style={{
                            ...styles(colors, insets).languageLabel,
                            backgroundColor: languageTag === language.languageTag ? colors.blueLightest : colors.grayLight,
                          }}
                      >
                        { countryCode }
                      </Text>,
                      )}
                  </View>
                </ButtonWrapper>
                <ButtonWrapper
                  style={{
                    ...styles(colors, insets).item,
                    ...styles(colors, insets).bottomItem,
                  }}
                  accessibilityLabel={i18n.translate('screens.settings.theme.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.theme.accessibility.hint')}
                  accessibilityRole='switch'
                  accessibilityValue={{text: i18n.translate(`screens.settings.theme.${themeName}`)}}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.theme.label')}</Text>
                  <View style={styles(colors, insets).languageLabelContainer}>
                    { Object.values(commonThemes.names).map((settingThemeName) =>
                      <Text
                        onPress={onPressTheme?.(settingThemeName)}
                        textAlign='center'
                        key={settingThemeName}
                        accessibilityLabel={i18n.translate(`screens.settings.theme.${settingThemeName}`)}
                        style={{
                            ...styles(colors, insets).languageLabel,
                            backgroundColor: settingThemeName === themeName ? colors.blueLightest : colors.grayLight,
                          }}
                      >
                        { i18n.translate(`screens.settings.theme.${settingThemeName}`) }
                      </Text>,
                      )}
                  </View>
                </ButtonWrapper>
              </View>
              <View style={styles(colors, insets).bottomItems}>
                <ButtonWrapper
                  onPress={onPressHowToUse}
                  style={{
                    ...styles(colors, insets).item,
                    ...styles(colors, insets).topItem,
                  }}
                  accessibilityLabel={i18n.translate('screens.settings.how_to_use.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.how_to_use.accessibility.hint')}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.how_to_use.label')}</Text>
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                <ButtonWrapper
                  style={styles(colors, insets).item}
                  onPress={onPressFaqs}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.settings.faqs.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.faqs.accessibility.hint')}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.faqs.label')}</Text>
                  <Icon name='external_link' width={iconSizes.size12} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                <ButtonWrapper
                  onPress={onPressSupport}
                  style={styles(colors, insets).item}
                  accessibilityLabel={i18n.translate('screens.settings.support.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.support.accessibility.hint')}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.support.label')}</Text>
                  <Icon name='external_link' width={iconSizes.size12} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                <ButtonWrapper
                  style={{
                    ...styles(colors, insets).item,
                    ...(Configuration.RELEASE ? styles(colors, insets).bottomItem : {}),
                  }}
                  onPress={onPressLegalInformation}
                  accessibilityLabel={i18n.translate('screens.settings.legal_information.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.legal_information.accessibility.hint')}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.legal_information.label')}</Text>
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                </ButtonWrapper>
                { ! Configuration.RELEASE &&
                  <ButtonWrapper
                    style={{
                      ...styles(colors, insets).item,
                      ...styles(colors, insets).bottomItem,
                    }}
                    onPress={onPressDebug}
                  >
                    <Text weight='bold'>{i18n.translate('screens.settings.debug.label')}</Text>
                    <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.blueDark} />
                  </ButtonWrapper>
                }
              </View>
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

Info.defaultProps = {
  appVersion: '1.0.0',
  appBuild: '0',
  trackingEnabled: false,
  isInfected: false,
  onClose: () => {},
  onPressTracking: () => {},
  onPressLanguage: () => {},
  onPressSupport: () => {},
  onPressHowToUse: () => {},
  onPressFaqs: () => {},
  onPressLegalInformation: () => {},
  onPressDebug: () => {},
};

Info.propTypes = {
  appVersion: PropTypes.string,
  appBuild: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  language: PropTypes.shape({
    name: PropTypes.string,
    languageTag: PropTypes.string,
    isRTL: PropTypes.bool,
  }).isRequired,
  trackingEnabled: PropTypes.bool,
  isInfected: PropTypes.bool,
  onClose: PropTypes.func,
  onPressTracking: PropTypes.func,
  onPressLanguage: PropTypes.func,
  onPressSupport: PropTypes.func,
  onPressHowToUse: PropTypes.func,
  onPressFaqs: PropTypes.func,
  onPressLegalInformation: PropTypes.func,
  onPressDebug: PropTypes.func,
};
