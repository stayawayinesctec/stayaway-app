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
import Toggle from '@app/common/components/Toggle';

import { getThemedImage } from '@app/common/assets/images';

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
  tracingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: sizes.size16,
  },
  tracingItem: {
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
    backgroundColor: colors.settingsAltButtonBackgroundColor,
    paddingLeft: sizes.size16,
    paddingRight: sizes.size16,
    paddingVertical: sizes.size18,
    borderTopWidth: sizes.size1,
    borderColor: colors.settingsBorderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tracingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tracingLabel: {
    marginRight: sizes.size8,
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
    theme,
    tracingEnabled,
    isInfected,
    onClose,
    onPressLanguage,
    onPressTheme,
    onPressSupport,
    onPressLegalInformation,
    onPressHowToUse,
    onPressFaqs,
    onPressTracing,
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
                <Icon name='close' width={iconSizes.size24} height={iconSizes.size24} tintColor={colors.iconMainTintColor} />
              </ButtonWrapper>
            </View>
            <View style={styles(colors, insets).itemsContainer}>
              <Text size='small' weight='bold' textColor={colors.settingsLabelTextColor} style={styles(colors, insets).version}>{i18n.translate('screens.settings.version', { version: appVersion, build: appBuild })}</Text>
              <View style={styles(colors, insets).topItems}>
                <ButtonWrapper
                  onPress={onPressTracing}
                  style={{
                    ...styles(colors, insets).item,
                    ...styles(colors, insets).topItem,
                    ...styles(colors, insets).tracingItem,
                    backgroundColor: tracingEnabled ? colors.settingsMainButtonBackgroundColor : colors.settingsAltButtonBackgroundColor,
                  }}
                  disabled={isInfected}
                  accessibilityRole='switch'
                  accessibilityValue={{text: tracingEnabled}}
                  accessibilityLabel={i18n.translate('screens.settings.tracing.accessibility.label')}
                  accessibilityHint={i18n.translate(`screens.settings.tracing.accessibility.hint.${tracingEnabled ? 'deactivate' : 'activate'}`)}
                >
                  <View style={styles(colors, insets).tracingButton}>
                    <Text textColor={tracingEnabled ? colors.settingsMainButtonTextColor : colors.settingsAltButtonTextColor} weight='bold'>{i18n.translate('screens.settings.tracing.label')}</Text>
                    <View style={styles(colors, insets).tracingLabelContainer}>
                      <Text textColor={tracingEnabled ? colors.settingsMainButtonTextColor : colors.settingsAltButtonTextColor} weight='bold' style={styles(colors, insets).tracingLabel}>{tracingEnabled ? i18n.translate('common.words.enabled') : i18n.translate('common.words.disabled')}</Text>
                      <Switch
                        value={tracingEnabled}
                        onValueChange={onPressTracing}
                        accessibilityLabel={i18n.translate('screens.settings.tracing.accessibility.label')}
                        accessibilityHint={i18n.translate(`screens.settings.tracing.accessibility.hint.${tracingEnabled ? 'deactivate' : 'activate'}`)}
                      />
                    </View>
                  </View>
                  <Text size='small' textColor={tracingEnabled ? colors.settingsMainButtonTextColor : colors.settingsAltButtonTextColor}>{i18n.translate(`screens.settings.tracing.description.${tracingEnabled ? 'enabled' : 'disabled'}`)}</Text>
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
                  <Toggle
                    value={language.languageTag}
                    options={Object.values(languages).map(({ languageTag, countryCode }) => ({id: languageTag, label: countryCode}))}
                    onPress={onPressLanguage}
                  />
                </ButtonWrapper>
                <ButtonWrapper
                  onPress={onPressTheme}
                  style={{
                    ...styles(colors, insets).item,
                    ...styles(colors, insets).bottomItem,
                  }}
                  accessibilityLabel={i18n.translate('screens.settings.theme.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.theme.accessibility.hint')}
                  accessibilityRole='switch'
                  accessibilityValue={{text: i18n.translate(`screens.settings.theme.${theme}`)}}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.theme.label')}</Text>
                  <Toggle
                    value={theme}
                    options={Object.values(commonThemes.names).map(id => ({id, label: i18n.translate(`screens.settings.theme.${id}`)}))}
                    onPress={onPressTheme}
                  />
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
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.settingsAltButtonIconTintColor} />
                </ButtonWrapper>
                <ButtonWrapper
                  style={styles(colors, insets).item}
                  onPress={onPressFaqs}
                  accessibilityRole='link'
                  accessibilityLabel={i18n.translate('screens.settings.faqs.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.faqs.accessibility.hint')}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.faqs.label')}</Text>
                  <Icon name='external_link' width={iconSizes.size12} height={iconSizes.size12} tintColor={colors.settingsAltButtonIconTintColor} />
                </ButtonWrapper>
                <ButtonWrapper
                  onPress={onPressSupport}
                  style={styles(colors, insets).item}
                  accessibilityLabel={i18n.translate('screens.settings.support.accessibility.label')}
                  accessibilityHint={i18n.translate('screens.settings.support.accessibility.hint')}
                >
                  <Text weight='bold'>{i18n.translate('screens.settings.support.label')}</Text>
                  <Icon name='external_link' width={iconSizes.size12} height={iconSizes.size12} tintColor={colors.settingsAltButtonIconTintColor} />
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
                  <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.settingsAltButtonIconTintColor} />
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
                    <Icon name='chevron' width={iconSizes.size7} height={iconSizes.size12} tintColor={colors.settingsAltButtonIconTintColor} />
                  </ButtonWrapper>
                }
              </View>
            </View>
          </Layout>
          <View style={styles(colors, insets).imagesContainer}>
            <View style={styles(colors, insets).sponsors}>
              <Image source={getThemedImage('republica_portuguesa', name)} style={styles(colors, insets).republicaPortuguesaImage} />
              <Image source={getThemedImage('logo_dgs', name)} style={styles(colors, insets).dgsImage} />
            </View>
            <Image source={getThemedImage('splash', name)} style={styles(colors, insets).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Info.defaultProps = {
  appVersion: '1.0.0',
  appBuild: '0',
  tracingEnabled: false,
  isInfected: false,
  onClose: () => {},
  onPressTracing: () => {},
  onPressLanguage: () => {},
  onPressTheme: () => {},
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
  theme: PropTypes.oneOf([commonThemes.names.dark, commonThemes.names.light, commonThemes.names.auto]).isRequired,
  tracingEnabled: PropTypes.bool,
  isInfected: PropTypes.bool,
  onClose: PropTypes.func,
  onPressTracing: PropTypes.func,
  onPressLanguage: PropTypes.func,
  onPressTheme: PropTypes.func,
  onPressSupport: PropTypes.func,
  onPressHowToUse: PropTypes.func,
  onPressFaqs: PropTypes.func,
  onPressLegalInformation: PropTypes.func,
  onPressDebug: PropTypes.func,
};
