/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { getSubmitImageSize } from '@app/common/utils/scalling';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Button from '@app/common/components/Button';
import SupportIcon from '@app/common/components/SupportIcon';
import CodeInput from '@app/common/components/CodeInput';
import Text from '@app/common/components/Text';
import Images from '@app/common/assets/images';

import { sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors) => StyleSheet.create({
  imageContainer: {
    height: getSubmitImageSize(),
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    paddingBottom: sizes.size48,
  },
  closeButtonContainer: {
    backgroundColor: colors.transparent,
  },
  closeButton: {
    marginTop: -sizes.size8,
    marginLeft: -sizes.size8,
    padding: sizes.size8,
    alignSelf: 'flex-start',
  },
  header: {
    marginTop: -100,
  },
  backgroundPanel: {
    backgroundColor: colors.white,
    opacity: 0.93,
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: sizes.size8,
    shadowColor: colors.grayLight,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
    paddingHorizontal: sizes.size24,
    paddingVertical: sizes.size24,
  },
  panel: {
    backgroundColor: colors.transparent,
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
  panelContainer: {
    paddingHorizontal: sizes.size24,
    paddingVertical: sizes.size24,
    marginBottom: sizes.size20,
  },
  inputContainer: {
    marginTop: -sizes.size10 - (iconSizes.size30 / 2),
    marginBottom: sizes.size16,
    marginHorizontal: sizes.size24,
  },
  title: {
    marginBottom: sizes.size24,
  },
  button: {
    marginTop: sizes.size16,
  },
});

export default function Diagnosis (props) {
  const {
    error: serverError,
    onSubmit,
    loading,
  } = props;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const input = useRef(null);

  const maxLength = 15;
  const disabled = code.length < maxLength;

  const prettyFormat = (currentCode) => currentCode.replace(/[^\dA-Z]/g, '').replace(/(.{3})/g, '$1 ').trim();
  const submitFormat = (currentCode) => currentCode.trim().split(' ').join('');

  const onNextPressed = () => {
    setError('');
    if (!loading) {
      if (code.trim().length === 0) {
        input.current.shake();
      } else {
        onSubmit(submitFormat(code));
      }
    }
  };

  const onChangeText = (currentCode) => {
    setCode(prettyFormat(currentCode));
    setError('');
  };

  useEffect(() => setError(serverError), [serverError]);


  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <ImageBackground
            source={Images.diagnosis}
            style={styles(colors).imageContainer}
          />
          <Layout
            padding='horizontal'
            style={styles(colors).contentContainer}
          >
            <View style={styles(colors).header}>
              <View style={styles(colors).backgroundPanel} />
              <View style={styles(colors).panel}>
                <View style={styles(colors).panelContainer}>
                  <Text size='xlarge' weight='bold' style={styles(colors).title}>{i18n.translate('screens.diagnosis.code_input.title')}</Text>
                  <Text>
                    <Text weight='bold'>{i18n.translate('screens.diagnosis.code_input.description.first')}</Text>
                    <Text>{i18n.translate('screens.diagnosis.code_input.description.second')}</Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles(colors).inputContainer}>
              <CodeInput
                value={code}
                onChangeText={onChangeText}
                ref={input}
                placeholder={i18n.translate('common.placeholders.code')}
                returnKeyLabel={i18n.translate('common.actions.submit')}
                returnKeyType='done'
                autoCompleteType='off'
                autoCapitalize='none'
                autoCorrect={false}
                errorMessage={error}
                maxLength={maxLength}
              />
            </View>
            <Button
              loading={loading}
              title={i18n.translate('common.actions.submit')}
              accessibilityLabel={i18n.translate('screens.diagnosis.code_input.accessibility.label')}
              accessibilityHint={i18n.translate('screens.diagnosis.code_input.accessibility.hint')}
              containerStyle={styles(colors).button}
              onPress={onNextPressed}
              disabled={disabled}
            />
          </Layout>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Diagnosis.defaultProps = {
  onSubmit: () => {},
  error: '',
};

Diagnosis.propTypes = {
  onSubmit: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};
