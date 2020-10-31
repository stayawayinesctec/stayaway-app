/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import CheckBox from '@app/common/components/CheckBox';
import Layout from '@app/common/components/Layout';
import Button from '@app/common/components/Button';
import Text from '@app/common/components/Text';
import { sizes } from '@app/common/theme';

import i18n from '@app/services/i18n';
import Linking from '@app/services/linking';

const styles = StyleSheet.create({
  termsContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingBottom: sizes.size24,
  },
  descriptionContainer: {
    marginBottom: sizes.size24,
  },
  actionsContainer: {
  },
  button: {
    width: '100%',
    paddingBottom: sizes.size16,
  },
  link: {
    textDecorationLine: 'underline',
  },
  concent: {
    flexDirection: 'row',
  },
  concentDescription: {
    width: '90%',
    paddingLeft: sizes.size8,
  },
});

export default function Consent (props) {
  const [readAndUnderstood, setReadAndUnderstood] = useState(false);
  const [dataTreatment, setDataTreatment] = useState(false);

  const disabled = !(dataTreatment && readAndUnderstood);

  const { loading, onPress } = props;

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <Layout>
            <View style={styles.termsContainer}>
              <View style={styles.titleContainer}>
                <Text weight='bold' size='xlarge' style={styles.header}>{i18n.translate('screens.onboarding.consent.title')}</Text>
              </View>
              <View style={styles.descriptionContainer}>
                <Text>
                  <Text>
                    {i18n.translate('screens.onboarding.consent.description.first')}
                  </Text>
                  <Text textColor={colors.blue} style={styles.link} onPress={() => Linking.openURL(i18n.translate('common.links.privacy_policy'))}>
                    {i18n.translate('screens.onboarding.consent.description.second')}
                  </Text>
                  <Text>
                    {i18n.translate('screens.onboarding.consent.description.third')}
                  </Text>
                  <Text textColor={colors.blue} style={styles.link} onPress={() => Linking.openURL(i18n.translate('common.links.terms_of_use'))}>
                    {i18n.translate('screens.onboarding.consent.description.fourth')}
                  </Text>
                </Text>
                <View style={styles.concentsContainer}>
                  <ButtonWrapper
                    onPress={() => setReadAndUnderstood(!readAndUnderstood)}
                    style={styles.concent}
                    disabled={loading}
                    accessibilityLabel={i18n.translate('screens.onboarding.consent.consents.read_and_understood.first') + i18n.translate('screens.onboarding.consent.consents.read_and_understood.second') + i18n.translate('screens.onboarding.consent.consents.read_and_understood.third') + i18n.translate('screens.onboarding.consent.consents.read_and_understood.fourth') + i18n.translate('screens.onboarding.consent.consents.read_and_understood.fifth')}
                    accessibilityRole='checkbox'
                    accessibilityState={{
                      checked: readAndUnderstood,
                      disabled: loading,
                    }}
                  >
                    <CheckBox
                      disabled={loading}
                      value={readAndUnderstood}
                      onValueChange={(value) => setReadAndUnderstood(value)}
                    />
                    <View style={styles.concentDescription}>
                      <Text>
                        <Text size='xsmall' weight='bold'>
                          {i18n.translate('screens.onboarding.consent.consents.read_and_understood.first')}
                        </Text>
                        <Text size='xsmall'>
                          {i18n.translate('screens.onboarding.consent.consents.read_and_understood.second')}
                        </Text>
                        <Text size='xsmall' textColor={colors.blue} style={styles.link} onPress={() => Linking.openURL(i18n.translate('common.links.dgs'))}>
                          {i18n.translate('screens.onboarding.consent.consents.read_and_understood.third')}
                        </Text>
                        <Text size='xsmall'>
                          {i18n.translate('screens.onboarding.consent.consents.read_and_understood.fourth')}
                        </Text>
                        <Text size='xsmall' textColor={colors.blue} style={styles.link} onPress={() => Linking.openURL(`mailto:${i18n.translate('common.emails.data_protection')}`)}>
                          {i18n.translate('screens.onboarding.consent.consents.read_and_understood.fifth')}
                        </Text>
                      </Text>
                    </View>
                  </ButtonWrapper>
                  <ButtonWrapper
                    onPress={() => setDataTreatment(!dataTreatment)}
                    style={styles.concent}
                    disabled={loading}
                    accessibilityLabel={i18n.translate('screens.onboarding.consent.consents.data_treatment')}
                    accessibilityRole='checkbox'
                    accessibilityState={{
                      checked: dataTreatment,
                      disabled: loading,
                    }}
                  >
                    <CheckBox
                      disabled={loading}
                      value={dataTreatment}
                      onValueChange={(value) => setDataTreatment(value)}
                    />
                    <View style={styles.concentDescription}>
                      <Text size='xsmall' weight='bold'>
                        {i18n.translate('screens.onboarding.consent.consents.data_treatment')}
                      </Text>
                    </View>
                  </ButtonWrapper>
                </View>
              </View>
            </View>
            <View style={styles.actionsContainer}>
              <Button
                title={i18n.translate('screens.onboarding.consent.actions.accept.label')}
                accessibilityLabel={i18n.translate('screens.onboarding.consent.actions.accept.accessibility.label')}
                accessibilityHint={i18n.translate('screens.onboarding.consent.actions.accept.accessibility.hint')}
                containerStyle={styles.button}
                onPress={onPress}
                loading={loading}
                disabled={disabled}
              />
            </View>
          </Layout>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Consent.defaultProps = {
  loading: false,
  onPress: () => {},
};

Consent.propTypes = {
  loading: PropTypes.bool,
  onPress: PropTypes.func,
};
