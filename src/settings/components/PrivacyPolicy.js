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
  },
  headerTitle: {
    paddingVertical: sizes.size16,
    marginBottom: sizes.size24,
  },
  bodyContainer: {
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
  clause: {
    marginBottom: sizes.size24,
  },
  title: {
    marginBottom: sizes.size8,
  },
  subtitle: {
    marginBottom: sizes.size8,
  },
  description: {
    marginBottom: sizes.size24,
  },
  responsible: {
    marginBottom: sizes.size16,
  },
  subcontractor: {
    marginBottom: sizes.size8,
  },
  data: {
    marginBottom: sizes.size16,
  },
  dataTitle: {
    marginBottom: sizes.size8,
  },
  label: {
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


export default function PrivacyPolicy(props) {
  const {
    onClose,
  } = props;

  const insets = useSafeAreaInsets();

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent style={styles(colors, insets).container}>
          <Layout style={styles(colors, insets).layoutContainer}>
            <View style={styles(colors, insets).header}>
              <ButtonWrapper
                onPress={onClose}
                style={styles(colors, insets).closeButton}
                accessibilityLabel={i18n.translate('screens.privacy_policy.actions.back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.privacy_policy.actions.back.accessibility.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
              </ButtonWrapper>
              <Text size='xlarge' weight='bold' style={styles(colors, insets).headerTitle}>{i18n.translate('screens.privacy_policy.title')}</Text>
            </View>
            <View style={styles(colors, insets).bodyContainer}>
              <Text size='xsmall' style={styles(colors, insets).description}>{i18n.translate('screens.privacy_policy.description')}</Text>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.data_treatment.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <View style={styles(colors, insets).responsible}>
                    <Text size='small' weight='bold' style={styles(colors, insets).subtitle}>{i18n.translate('screens.privacy_policy.data_treatment.responsible')}</Text>
                    <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.data_treatment.dgs.name')}</Text>
                    <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.dgs.address')}</Text>
                    <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.dgs.phone')}</Text>
                  </View>
                  <View style={styles(colors, insets).subcontractors}>
                    <Text size='small' weight='bold' style={styles(colors, insets).subtitle}>{i18n.translate('screens.privacy_policy.data_treatment.subcontractors')}</Text>
                    <View style={styles(colors, insets).subcontractor}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.data_treatment.inesctec.name')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.inesctec.address')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.inesctec.phone')}</Text>
                    </View>
                    <View style={styles(colors, insets).subcontractor}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.data_treatment.keyruptive.name')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.keyruptive.address')}</Text>
                    </View>
                    <View style={styles(colors, insets).subcontractor}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.data_treatment.ubirider.name')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.ubirider.address')}</Text>
                    </View>
                    <View style={styles(colors, insets).subcontractor}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.data_treatment.spms.name')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.spms.address')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.spms.phone')}</Text>
                    </View>
                    <View style={styles(colors, insets).subcontractor}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.data_treatment.incm.name')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.incm.address')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_treatment.incm.phone')}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.purposes_of_personal_data_processing.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.purposes_of_personal_data_processing.body')}</Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.lawfulness_of_data_processing.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.lawfulness_of_data_processing.body')}</Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.body')}</Text>
                  <View style={styles(colors, insets).data}>
                    <Text size='xsmall' weight='bold' style={styles(colors, insets).dataTitle}>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.pseudonymised_data_teks.title')}</Text>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.definition')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.pseudonymised_data_teks.definition')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.purpose')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.pseudonymised_data_teks.purpose')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.storage')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.pseudonymised_data_teks.storage')}</Text>
                    </View>
                  </View>
                  <View style={styles(colors, insets).data}>
                    <Text size='xsmall' weight='bold' style={styles(colors, insets).dataTitle}>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.pseudonymised_data_uui.title')}</Text>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.definition')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.pseudonymised_data_uui.definition')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.purpose')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.pseudonymised_data_uui.purpose')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.storage')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.pseudonymised_data_uui.storage')}</Text>
                    </View>
                  </View>
                  <View style={styles(colors, insets).data}>
                    <Text size='xsmall' weight='bold' style={styles(colors, insets).dataTitle}>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_teks.title')}</Text>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.definition')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_teks.definition')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.purpose')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_teks.purpose')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.storage')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_teks.storage')}</Text>
                    </View>
                  </View>
                  <View style={styles(colors, insets).data}>
                    <Text size='xsmall' weight='bold' style={styles(colors, insets).dataTitle}>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_info.title')}</Text>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.definition')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_info.definition')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.purpose')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_info.purpose')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.storage')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_info.storage')}</Text>
                    </View>
                  </View>
                  <View style={styles(colors, insets).data}>
                    <Text size='xsmall' weight='bold' style={styles(colors, insets).dataTitle}>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_symptoms.title')}</Text>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.definition')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_symptoms.definition')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.purpose')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_symptoms.purpose')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.storage')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.health_data_symptoms.storage')}</Text>
                    </View>
                  </View>
                  <View style={styles(colors, insets).data}>
                    <Text size='xsmall' weight='bold' style={styles(colors, insets).dataTitle}>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.ip_address.title')}</Text>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.definition')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.ip_address.definition')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.purpose')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.ip_address.purpose')}</Text>
                    </View>
                    <View style={styles(colors, insets).label}>
                      <Text size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.labels.storage')}</Text>
                      <Text size='xsmall'>{i18n.translate('screens.privacy_policy.personal_data_and_storage_periods.ip_address.storage')}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.data_collecting_and_processing.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.data_collecting_and_processing.body')}</Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.gaen_api.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.gaen_api.body')}</Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.use_of_equipment_resources.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.use_of_equipment_resources.body')}</Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.rights_of_data_subjects.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.rights_of_data_subjects.body')}</Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.uninstalling_and_suspending_the_application.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.uninstalling_and_suspending_the_application.body')}</Text>
                </View>
              </View>
              <View style={styles(colors, insets).clause}>
                <Text size='small' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.privacy_policy.changes_to_the_privacy_policy.name')}</Text>
                <View style={styles(colors, insets).body}>
                  <Text size='xsmall'>{i18n.translate('screens.privacy_policy.changes_to_the_privacy_policy.body')}</Text>
                </View>
              </View>
              <Text textColor={colors.gray} size='xsmall' weight='bold'>{i18n.translate('screens.privacy_policy.last_review')}</Text>
            </View>
          </Layout>
          <View style={styles(colors, insets).imagesContainer}>
            <View style={styles(colors, insets).sponsors}>
              <Image source={Images.republica_portuguesa} style={styles(colors, insets).republicaPortuguesaImage} />
              <Image source={Images.logo_dgs} style={styles(colors, insets).dgsImage} />
            </View>
            <Image source={Images.splash} style={styles(colors, insets).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

PrivacyPolicy.defaultProps = {
  onClose: () => {},
};

PrivacyPolicy.propTypes = {
  onClose: PropTypes.func,
};
