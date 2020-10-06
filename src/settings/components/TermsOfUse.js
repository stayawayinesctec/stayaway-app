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

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';
import Icon from '@app/common/components/Icon';

import Images from '@app/common/assets/images';

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
  clause: {
    marginBottom: sizes.size24,
  },
  title: {
    marginBottom: sizes.size8,
  },
  body: {

  },
  imagesContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 0,
  },
  sponsors: {
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


export default function TermsOfUse(props) {
  const {
    onClose,
  } = props;

  const insets = useSafeAreaInsets();

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent scrollable={false} style={styles(colors, insets).container}>
          <Layout style={styles(colors, insets).layoutContainer} padding='top'>
            <View style={styles(colors, insets).header}>
              <ButtonWrapper
                onPress={onClose}
                style={styles(colors, insets).closeButton}
                accessibilityLabel={i18n.translate('screens.terms_of_use.actions.back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.terms_of_use.actions.back.accessibility.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
              </ButtonWrapper>
              <Text size='xlarge' weight='bold' style={styles(colors, insets).headerTitle}>{i18n.translate('screens.terms_of_use.title')}</Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles(colors, insets).bodyContainer}
            >
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.scope_and_purpose.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.scope_and_purpose.first')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>2. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.scope_and_purpose.second')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>3. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.scope_and_purpose.third.normal')}</Text>
                    <Text size='xsmall' weight='bold'>{i18n.translate('screens.terms_of_use.scope_and_purpose.third.bold')}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.conditions_of_access_and_use.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.conditions_of_access_and_use.first')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>2. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.conditions_of_access_and_use.second')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>3. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.conditions_of_access_and_use.third')}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.features_of_the_app.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.features_of_the_app.first')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>2. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.features_of_the_app.second')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>3. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.features_of_the_app.third')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>4. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.features_of_the_app.fourth')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>5. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.features_of_the_app.fifth')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>6. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.features_of_the_app.sixth')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>7. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.features_of_the_app.seventh')}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.users_duties_of_care.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.users_duties_of_care.first')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>2. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.users_duties_of_care.second')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>3. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.users_duties_of_care.third')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>4. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.users_duties_of_care.fourth')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>4. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.users_duties_of_care.fifth')}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.liability_and_warranty.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.liability_and_warranty.first')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>2. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.liability_and_warranty.second')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>3. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.liability_and_warranty.third')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>4. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.liability_and_warranty.fourth')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>5. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.liability_and_warranty.fifth')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>6. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.liability_and_warranty.sixth')}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.data_protection.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.data_protection.first')}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.termination_of_use.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.termination_of_use.first')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>2. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.termination_of_use.second')}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.copyright_property_rights_and_rights_of_use.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.copyright_property_rights_and_rights_of_use.first')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>2. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.copyright_property_rights_and_rights_of_use.second')}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.terms_of_use.final_provisions.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text>
                    <Text size='xsmall' weight='bold'>1. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.final_provisions.first')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>2. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.final_provisions.second')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>3. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.final_provisions.third')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>4. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.final_provisions.fourth')}</Text>
                  </Text>
                  <Text>
                    <Text size='xsmall' weight='bold'>5. </Text>
                    <Text size='xsmall'>{i18n.translate('screens.terms_of_use.final_provisions.fifth')}</Text>
                  </Text>
                </View>
              </View>
              <Text textColor={colors.gray} size='xsmall' weight='bold'>{i18n.translate('screens.terms_of_use.last_review')}</Text>
              <View style={styles(colors, insets).sponsors}>
                <Image source={Images.republica_portuguesa} style={styles(colors, insets).republicaPortuguesaImage} />
                <Image source={Images.logo_dgs} style={styles(colors, insets).dgsImage} />
              </View>
            </ScrollView>
          </Layout>
          <View style={styles(colors, insets).imagesContainer}>
            <Image source={Images.splash} style={styles(colors, insets).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

TermsOfUse.defaultProps = {
  onClose: () => {},
};

TermsOfUse.propTypes = {
  onClose: PropTypes.func,
};
