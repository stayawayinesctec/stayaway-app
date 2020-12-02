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
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

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

const renderThirdPartyLicenses = (licenses, colors, insets) => {
  return (
    <View>
      {
        licenses.map(license => (
          <View key={license.name} style={styles(colors, insets).licenseContainer}>
            <Text weight='bold' textColor={colors.licensesTitleTextColor} onPress={() => Linking.openURL(license.link)} style={styles(colors, insets).licenseTitle}>{license.name}</Text>
            <View style={styles(colors, insets).lineBreak} />
            {license.tools.length > 0 &&
              <View style={styles(colors, insets).licenseToolsContainer}>
                <Text weight='bold' textColor={colors.licensesSubtitleTextColor} style={styles(colors, insets).licenseTools}>{i18n.translate('screens.licenses.third_party.tools')}</Text>
                {
                  license.tools.map(tool => (
                    <Text key={tool.name} onPress={() => Linking.openURL(tool.link)} style={styles(colors, insets).licenseTool}>{tool.name}</Text>
                  ))
                }
              </View>
            }
            {license.libraries.length > 0 &&
              <View style={styles(colors, insets).licenseLibrariesContainer}>
                <Text weight='bold' style={styles(colors, insets).licenseLibraries} textColor={colors.licensesSubtitleTextColor}>{i18n.translate('screens.licenses.third_party.libraries')}</Text>
                {
                  license.libraries.map(library => (
                    <Text key={library.name} onPress={() => Linking.openURL(library.link)} style={styles(colors, insets).licenseLibrary}>{library.name}</Text>
                  ))
                }
              </View>
            }
            {license.react_native_packages.length > 0 &&
              <View style={styles(colors, insets).licenseRNPackagesContainer}>
                <Text weight='bold' style={styles(colors, insets).licenseRNPackages} textColor={colors.licensesSubtitleTextColor}>{i18n.translate('screens.licenses.third_party.react_native_packages')}</Text>
                {
                  license.react_native_packages.map(rnpackage => (
                    <Text key={rnpackage.name} onPress={() => Linking.openURL(rnpackage.link)} style={styles(colors, insets).licenseRNPackage}>{rnpackage.name}</Text>
                  ))
                }
              </View>
            }
            {license.fonts.length > 0 &&
              <View style={styles(colors, insets).licenseFontsContainer}>
                <Text weight='bold' style={styles(colors, insets).licenseFonts} textColor={colors.licensesSubtitleTextColor}>{i18n.translate('screens.licenses.third_party.fonts')}</Text>
                {
                  license.fonts.map(font => (
                    <Text key={font.name} onPress={() => Linking.openURL(font.link)} style={styles(colors, insets).licenseFont}>{font.name}</Text>
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

  return (
    <ThemeConsumer>
      {({colors, name}) => (
        <TopComponent scrollable={false} style={styles(colors, insets).container}>
          <Layout style={styles(colors, insets).layoutContainer} padding='top'>
            <View style={styles(colors, insets).header}>
              <ButtonWrapper
                onPress={onClose}
                style={styles(colors, insets).closeButton}
                accessibilityLabel={i18n.translate('screens.licenses.actions.back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.licenses.actions.back.accessibility.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} tintColor={colors.iconMainTintColor} />
              </ButtonWrapper>
              <Text size='xlarge' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.licenses.title')}</Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles(colors, insets).bodyContainer}
            >
              <View style={styles(colors, insets).projectInformation}>
                <Text textColor={colors.licensesProjectTextColor}>{i18n.translate('screens.licenses.project')}</Text>
              </View>
              <View style={styles(colors, insets).copyrightAndLicense}>
                <Text textColor={colors.licensesTitleTextColor} weight='bold' style={styles(colors, insets).copyrightAndLicenseTitle}>{i18n.translate('screens.licenses.copyright_and_license.title')}</Text>
                <Text>{i18n.translate('screens.licenses.copyright_and_license.body')}</Text>
              </View>
              <View style={styles(colors, insets).thirdPartyLicenses}>
                <Text textColor={colors.licensesTitleTextColor} weight='bold' style={styles(colors, insets).thirdPartyLicensesTitle}>{i18n.translate('screens.licenses.third_party.title')}</Text>
                {renderThirdPartyLicenses(licenses, colors, insets)}
              </View>
              <View style={styles(colors, insets).sponsors}>
                <Image source={getThemedImage('republica_portuguesa', name)} style={styles(colors, insets).republicaPortuguesaImage} />
                <Image source={getThemedImage('logo_dgs', name)} style={styles(colors, insets).dgsImage} />
              </View>
            </ScrollView>
          </Layout>
          <View style={styles(colors, insets).imagesContainer}>
            <Image source={getThemedImage('splash', name)} style={styles(colors, insets).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
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
