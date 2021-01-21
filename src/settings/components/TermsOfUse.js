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

import { useTheme } from '@app/contexts/Theme';

import { sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

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
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    zIndex: 10,
    marginHorizontal: sizes.size24,
  },
  headerTitle: {
    paddingVertical: sizes.size16,
  },
  bodyContainer: {
    paddingTop: sizes.size24,
    paddingBottom: sizes.size24 + insets.bottom,
  },
  clause: {
    marginBottom: sizes.size24,
  },
  title: {
    marginBottom: sizes.size8,
  },
  imagesContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 0,
  },
  sponsors: {
    marginTop: sizes.size38,
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


export default function TermsOfUse(props) {
  const {
    onClose,
  } = props;

  const insets = useSafeAreaInsets();
  const { name, colors } = useTheme();

  return  (
    <TopComponent scrollable={false} style={styles(colors, insets).container}>
      <Layout style={styles(colors, insets).layoutContainer} padding='top'>
        <View style={styles(colors, insets).header}>
          <ButtonWrapper
            onPress={onClose}
            style={styles(colors, insets).closeButton}
            accessibilityLabel={i18n.translate('screens.terms_of_use.actions.back.accessibility.label')}
            accessibilityHint={i18n.translate('screens.terms_of_use.actions.back.accessibility.hint')}
          >
            <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} tintColor={colors.iconMainTintColor} />
          </ButtonWrapper>
          <Text size='xlarge' weight='bold' style={styles(colors, insets).headerTitle}>{i18n.translate('screens.terms_of_use.title')}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(colors, insets).bodyContainer}
        >
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.scope_and_purpose.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.scope_and_purpose.description')}</Text>
          </View>
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.conditions_of_access_and_use.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.conditions_of_access_and_use.description')}</Text>
          </View>
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.features_of_the_app.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.features_of_the_app.description')}</Text>
          </View>
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.users_duties_of_care.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.users_duties_of_care.description')}</Text>
          </View>
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.liability_and_warranty.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.liability_and_warranty.description')}</Text>
          </View>
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.data_protection.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.data_protection.description')}</Text>
          </View>
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.termination_of_use.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.termination_of_use.description')}</Text>
          </View>
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.copyright_property_rights_and_rights_of_use.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.copyright_property_rights_and_rights_of_use.description')}</Text>
          </View>
          <View style={styles(colors, insets).clause}>
            <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.final_provisions.name')}</Text>
            <Text size='xsmall'>{i18n.translate('screens.terms_of_use.final_provisions.description')}</Text>
          </View>
          <Text textColor={colors.settingsLabelTextColor} size='xsmall' weight='bold'>{i18n.translate('screens.terms_of_use.last_review')}</Text>
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
  );
}

TermsOfUse.defaultProps = {
  onClose: () => {},
};

TermsOfUse.propTypes = {
  onClose: PropTypes.func,
};
