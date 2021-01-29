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
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';
import Linking from '@app/services/linking';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/FormattedText';
import Icon from '@app/common/components/Icon';

import { getThemedImage } from '@app/common/assets/images';

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
    marginHorizontal: sizes.size24,
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
  projectInformation: {
    backgroundColor: colors.licensesProjectBackgroundColor,
    marginBottom: sizes.size48,
    paddingHorizontal: sizes.size24,
    paddingVertical: sizes.size24,
  },
  copyrightAndLicense: {
    paddingHorizontal: sizes.size24,
    marginBottom: sizes.size48,
  },
  copyrightAndLicenseTitle: {
    marginBottom: sizes.size16,
  },
  thirdPartyLicenses: {
    paddingHorizontal: sizes.size24,
  },
  thirdPartyLicensesTitle: {
    marginBottom: sizes.size16,
  },
  licenseContainer: {
    paddingBottom: sizes.size48,
  },
  licenseTitle: {
    textDecorationLine: 'underline',
  },
  licenseToolsContainer: {
    paddingBottom: sizes.size12,
  },
  licenseTools: {
    paddingBottom: sizes.size8,
  },
  licenseTool: {
    paddingLeft: sizes.size16,
    paddingBottom: sizes.size4,
  },
  licenseLibrariesContainer: {
    paddingBottom: sizes.size12,
  },
  licenseLibraries: {
    paddingBottom: sizes.size8,
  },
  licenseLibrary: {
    paddingLeft: sizes.size16,
    paddingBottom: sizes.size4,
  },
  licenseRNPackagesContainer: {
    paddingBottom: sizes.size12,
  },
  licenseRNPackages: {
    paddingBottom: sizes.size8,
  },
  licenseRNPackage: {
    paddingLeft: sizes.size16,
    paddingBottom: sizes.size4,
  },
  licenseFontsContainer: {
    paddingBottom: sizes.size12,
  },
  licenseFonts: {
    paddingBottom: sizes.size8,
  },
  licenseFont: {
    paddingLeft: sizes.size16,
    paddingBottom: sizes.size4,
  },
  lineBreak: {
    marginVertical: sizes.size12,
    height: sizes.size1,
    width: '100%',
    backgroundColor: colors.licensesLineBreakBackgroundColor,
  },
  link: {
    textDecorationLine: 'underline',
  },
  bodyContainer: {
    paddingBottom: sizes.size24 + insets.bottom,
  },
  imagesContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 0,
  },
  sponsors: {
    marginHorizontal: sizes.size24,
    marginTop: sizes.size24,
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
});

function renderThirdPartyLicenses (...args) {
  const [
    licenses,
    colors,
    style,
  ] = args;

  return (
    <View>
      {
        licenses.map(license => (
          <View key={license.name} style={style.licenseContainer}>
            <Text weight='bold' textColor={colors.licensesTitleTextColor} onPress={() => Linking.openURL(license.link)} style={style.licenseTitle}>{license.name}</Text>
            <View style={style.lineBreak} />
            {license.tools.length > 0 &&
              <View style={style.licenseToolsContainer}>
                <Text weight='bold' textColor={colors.licensesSubtitleTextColor} style={style.licenseTools}>{i18n.translate('screens.licenses.third_party.tools')}</Text>
                {
                  license.tools.map(tool => (
                    <Text key={tool.name} onPress={() => Linking.openURL(tool.link)} style={style.licenseTool}>{tool.name}</Text>
                  ))
                }
              </View>
            }
            {license.libraries.length > 0 &&
              <View style={style.licenseLibrariesContainer}>
                <Text weight='bold' style={style.licenseLibraries} textColor={colors.licensesSubtitleTextColor}>{i18n.translate('screens.licenses.third_party.libraries')}</Text>
                {
                  license.libraries.map(library => (
                    <Text key={library.name} onPress={() => Linking.openURL(library.link)} style={style.licenseLibrary}>{library.name}</Text>
                  ))
                }
              </View>
            }
            {license.react_native_packages.length > 0 &&
              <View style={style.licenseRNPackagesContainer}>
                <Text weight='bold' style={style.licenseRNPackages} textColor={colors.licensesSubtitleTextColor}>{i18n.translate('screens.licenses.third_party.react_native_packages')}</Text>
                {
                  license.react_native_packages.map(rnpackage => (
                    <Text key={rnpackage.name} onPress={() => Linking.openURL(rnpackage.link)} style={style.licenseRNPackage}>{rnpackage.name}</Text>
                  ))
                }
              </View>
            }
            {license.fonts.length > 0 &&
              <View style={style.licenseFontsContainer}>
                <Text weight='bold' style={style.licenseFonts} textColor={colors.licensesSubtitleTextColor}>{i18n.translate('screens.licenses.third_party.fonts')}</Text>
                {
                  license.fonts.map(font => (
                    <Text key={font.name} onPress={() => Linking.openURL(font.link)} style={style.licenseFont}>{font.name}</Text>
                  ))
                }
              </View>
            }
          </View>
        ))
      }
    </View>
  );
};

export default function Licenses(props) {
  const {
    licenses,
    onClose,
  } = props;

  const insets = useSafeAreaInsets();
  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors, insets), [name, insets]);

  return (
    <TopComponent scrollable={false} style={memoizedStyle.container}>
      <Layout style={memoizedStyle.layoutContainer} padding='top'>
        <View style={memoizedStyle.header}>
          <ButtonWrapper
            onPress={onClose}
            style={memoizedStyle.closeButton}
            accessibilityLabel={i18n.translate('screens.licenses.actions.back.accessibility.label')}
            accessibilityHint={i18n.translate('screens.licenses.actions.back.accessibility.hint')}
          >
            <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
          </ButtonWrapper>
          <Text size='xlarge' weight='bold' style={memoizedStyle.title}>{i18n.translate('screens.licenses.title')}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={memoizedStyle.bodyContainer}
        >
          <View style={memoizedStyle.projectInformation}>
            <Text textColor={colors.licensesProjectTextColor}>{i18n.translate('screens.licenses.project')}</Text>
          </View>
          <View style={memoizedStyle.copyrightAndLicense}>
            <Text textColor={colors.licensesTitleTextColor} weight='bold' style={memoizedStyle.copyrightAndLicenseTitle}>{i18n.translate('screens.licenses.copyright_and_license.title')}</Text>
            <Text>{i18n.translate('screens.licenses.copyright_and_license.body')}</Text>
          </View>
          <View style={memoizedStyle.thirdPartyLicenses}>
            <Text textColor={colors.licensesTitleTextColor} weight='bold' style={memoizedStyle.thirdPartyLicensesTitle}>{i18n.translate('screens.licenses.third_party.title')}</Text>
            {renderThirdPartyLicenses(licenses, colors, memoizedStyle)}
          </View>
          <View style={memoizedStyle.sponsors}>
            <Image source={getThemedImage('republica_portuguesa', name)} style={memoizedStyle.republicaPortuguesaImage} />
            <Image source={getThemedImage('logo_dgs', name)} style={memoizedStyle.dgsImage} />
          </View>
        </ScrollView>
      </Layout>
      <View style={memoizedStyle.imagesContainer}>
        <Image source={getThemedImage('splash', name)} style={memoizedStyle.splashImage} />
      </View>
    </TopComponent>
  );
}

Licenses.defaultProps = {
  onClose: () => {},
  licenses: [],
};

Licenses.propTypes = {
  onClose: PropTypes.func,
  licenses: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    link: PropTypes.string,
    tools: PropTypes.array,
    libraries: PropTypes.array,
    react_native_packages: PropTypes.array,
    fonts: PropTypes.array,
  })),
};
