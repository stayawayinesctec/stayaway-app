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
import { View, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { themes as commonThemes, sizes, iconSizes } from '@app/common/theme';

import Configuration from '@app/services/configuration';
import i18n, { languages } from '@app/services/i18n';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/FormattedText';
import Icon from '@app/common/components/Icon';
import Switch from '@app/common/components/Switch';
import Toggle from '@app/common/components/Toggle';
import List from '@app/common/components/List';

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

function renderTracingButton(tracingEnabled, onPressTracing, colors, memoizedStyle) {
  return (
    <>
      <View style={memoizedStyle.tracingButton}>
        <Text textColor={tracingEnabled ? colors.settingsMainButtonTextColor : colors.settingsAltButtonTextColor} weight='bold'>{i18n.translate('screens.settings.tracing.label')}</Text>
        <View style={memoizedStyle.tracingLabelContainer}>
          <Text textColor={tracingEnabled ? colors.settingsMainButtonTextColor : colors.settingsAltButtonTextColor} weight='bold' style={memoizedStyle.tracingLabel}>{tracingEnabled ? i18n.translate('common.words.enabled') : i18n.translate('common.words.disabled')}</Text>
          <Switch
            value={tracingEnabled}
            onValueChange={onPressTracing}
            accessibilityLabel={i18n.translate('screens.settings.tracing.accessibility.label')}
            accessibilityHint={i18n.translate(`screens.settings.tracing.accessibility.hint.${tracingEnabled ? 'deactivate' : 'activate'}`)}
          />
        </View>
      </View>
      <Text size='small' textColor={tracingEnabled ? colors.settingsMainButtonTextColor : colors.settingsAltButtonTextColor}>{i18n.translate(`screens.settings.tracing.description.${tracingEnabled ? 'enabled' : 'disabled'}`)}</Text>
    </>
  );
}

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
  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors, insets), [name, insets]);

  const languagesNames = Object.values(languages).map(({ languageTag, countryCode }) => ({ id: languageTag, label: countryCode }));
  const themesNames = Object.values(commonThemes.names).map(id => ({ id, label: i18n.translate(`screens.settings.theme.${id}`) }));

  const topItems = [
    {
      id: 1,
      onPress: onPressTracing,
      style: {
        ...memoizedStyle.tracingItem,
        backgroundColor: tracingEnabled ? colors.settingsMainButtonBackgroundColor : colors.settingsAltButtonBackgroundColor,
      },
      disabled: isInfected,
      accessibilityRole: 'switch',
      accessibilityValue: { text: tracingEnabled },
      accessibilityLabel: i18n.translate('screens.settings.tracing.accessibility.label'),
      accessibilityHint: i18n.translate(`screens.settings.tracing.accessibility.hint.${tracingEnabled ? 'deactivate' : 'activate'}`),
      renderItem: () => renderTracingButton(tracingEnabled, onPressTracing, colors, memoizedStyle),
    },
    {
      id: 2,
      title: i18n.translate('screens.settings.language.label'),
      onPress: onPressLanguage,
      accessibilityLabel: i18n.translate('screens.settings.language.accessibility.label'),
      accessibilityHint: i18n.translate('screens.settings.language.accessibility.hint'),
      accessibilityRole: 'switch',
      accessibilityValue: { text: language.name },
      icon: <Toggle value={language.languageTag} options={languagesNames} onPress={onPressLanguage} />,
    },
    {
      id: 3,
      title: i18n.translate('screens.settings.theme.label'),
      onPress: onPressTheme,
      accessibilityLabel: i18n.translate('screens.settings.theme.accessibility.label'),
      accessibilityHint: i18n.translate('screens.settings.theme.accessibility.hint'),
      accessibilityRole: 'switch',
      accessibilityValue: { text: i18n.translate(`screens.settings.theme.${theme}`) },
      icon: <Toggle value={theme} options={themesNames} onPress={onPressTheme} />,
    },
  ];

  const bottomItems = [
    {
      id: 1,
      title: i18n.translate('screens.settings.how_to_use.label'),
      onPress: onPressHowToUse,
      accessibilityLabel: i18n.translate('screens.settings.how_to_use.accessibility.label'),
      accessibilityHint: i18n.translate('screens.settings.how_to_use.accessibility.hint'),
    },
    {
      id: 2,
      title: i18n.translate('screens.settings.faqs.label'),
      onPress: onPressFaqs,
      accessibilityLabel: i18n.translate('screens.settings.faqs.accessibility.label'),
      accessibilityHint: i18n.translate('screens.settings.faqs.accessibility.hint'),
      icon: <Icon name='external_link' width={iconSizes.size12} height={iconSizes.size12} />,
    },
    {
      id: 3,
      title: i18n.translate('screens.settings.support.label'),
      onPress: onPressSupport,
      accessibilityLabel: i18n.translate('screens.settings.support.accessibility.label'),
      accessibilityHint: i18n.translate('screens.settings.support.accessibility.hint'),
      icon: <Icon name='external_link' width={iconSizes.size12} height={iconSizes.size12} />,
    },
    {
      id: 4,
      title: i18n.translate('screens.settings.legal_information.label'),
      onPress: onPressLegalInformation,
      accessibilityLabel: i18n.translate('screens.settings.legal_information.accessibility.label'),
      accessibilityHint: i18n.translate('screens.settings.legal_information.accessibility.hint'),
    },
  ];

  if (!Configuration.RELEASE) {
    bottomItems.push(
      {
        id: 5,
        title: i18n.translate('screens.settings.debug.label'),
        onPress: onPressDebug,
        accessibilityLabel: i18n.translate('screens.settings.debug.accessibility.label'),
        accessibilityHint: i18n.translate('screens.settings.debug.accessibility.hint'),
      },
    );
  }

  return (
    <TopComponent style={memoizedStyle.container}>
      <Layout style={memoizedStyle.layoutContainer}>
        <View style={memoizedStyle.header}>
          <ButtonWrapper
            onPress={onClose}
            style={memoizedStyle.closeButton}
            accessibilityLabel={i18n.translate('screens.settings.actions.back.accessibility.label')}
            accessibilityHint={i18n.translate('screens.settings.actions.back.accessibility.hint')}
          >
            <Icon name='close' width={iconSizes.size24} height={iconSizes.size24} />
          </ButtonWrapper>
        </View>
        <View style={memoizedStyle.itemsContainer}>
          <Text size='small' weight='bold' textColor={colors.settingsLabelTextColor} style={memoizedStyle.version}>{i18n.translate('screens.settings.version', { version: appVersion, build: appBuild })}</Text>
          <List items={topItems} style={memoizedStyle.topItems} />
          <List items={bottomItems} style={memoizedStyle.bottomItems} />
        </View>
      </Layout>
      <View style={memoizedStyle.imagesContainer}>
        <View style={memoizedStyle.sponsors}>
          <Image source={getThemedImage('republica_portuguesa', name)} style={memoizedStyle.republicaPortuguesaImage} />
          <Image source={getThemedImage('logo_dgs', name)} style={memoizedStyle.dgsImage} />
        </View>
        <Image source={getThemedImage('splash', name)} style={memoizedStyle.splashImage} />
      </View>
    </TopComponent>
  );
}

Info.defaultProps = {
  appVersion: '1.0.0',
  appBuild: '0',
  tracingEnabled: false,
  isInfected: false,
  onClose: () => { },
  onPressTracing: () => { },
  onPressLanguage: () => { },
  onPressTheme: () => { },
  onPressSupport: () => { },
  onPressHowToUse: () => { },
  onPressFaqs: () => { },
  onPressLegalInformation: () => { },
  onPressDebug: () => { },
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
