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
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import i18n from '@app/services/i18n';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Button from '@app/common/components/Button';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Icon from '@app/common/components/Icon';
import Text from '@app/common/components/Text';
import { images } from '@app/common/assets/images';
import { sizes, iconSizes } from '@app/common/theme';

const styles = (colors, insets) => StyleSheet.create({
  imageContainer: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  topContainer: {
    height: 300,
  },
  top: {
    alignItems: 'flex-start',
    backgroundColor: colors.transparent,
  },
  bottomContainer: {
    flex: 1,
  },
  mainHeader: {
    marginBottom: sizes.size24,
  },
  header: {
    width: '60%',
    marginBottom: sizes.size24,
  },
  description: {
    width: '90%',
    paddingBottom: sizes.size24,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: sizes.size24,
    paddingTop: '15%',
    borderTopRightRadius: 250,
    paddingBottom: insets.bottom + sizes.size24 * 2 + sizes.size8,
  },
  centeredContainer: {
    flex: 1,
    paddingTop: '15%',
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: sizes.size24,
    justifyContent: 'center',
    borderTopRightRadius: 250,
  },
  closeButton: {
    backgroundColor: colors.iconMainBackgroundColor,
    borderRadius: sizes.size30,
    padding: sizes.size8,
  },
});

export default function Template (props) {
  const { header, description, image, pressable, closable, onPress, onClose } = props;

  const insets = useSafeAreaInsets();

  const renderContent = (colors) => {
    if (description.length === 0) {
      return (
        <Layout padding='horizontal' style={styles(colors, insets).centeredContainer}>
          <Text weight='bold' size='xlarge' style={styles(colors, insets).mainHeader}>{header}</Text>
          { pressable &&
            <Button
              title={i18n.translate('common.actions.ok')}
              containerStyle={styles.button}
              onPress={onPress}
              accessibilityLabel={i18n.translate('screens.how_to_use.actions.ok.accessibility.hint.label')}
              accessibilityHint={i18n.translate('screens.how_to_use.actions.ok.accessibility.hint.hint')}
            />
          }
        </Layout>
      );
    }

    return (
      <Layout padding='horizontal' style={styles(colors, insets).contentContainer}>
        {header.length > 0 && <Text weight='bold' size='xlarge' style={styles(colors, insets).header}>{header}</Text> }
        {description.length > 0 && <Text style={styles(colors, insets).description}>{description}</Text>}
        { pressable &&
          <Button
            title={i18n.translate('common.actions.ok')}
            containerStyle={styles(colors, insets).button}
            onPress={onPress}
            accessibilityLabel={i18n.translate('screens.how_to_use.actions.ok.accessibility.hint.label')}
            accessibilityHint={i18n.translate('screens.how_to_use.actions.ok.accessibility.hint.hint')}
          />
        }
      </Layout>
    );
  };

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <ImageBackground
            source={image}
            style={styles(colors, insets).imageContainer}
          >
            <View style={styles(colors, insets).topContainer}>
              { closable &&
                <Layout style={styles(colors, insets).top}>
                  <ButtonWrapper
                    onPress={onClose}
                    style={styles(colors, insets).closeButton}
                    accessibilityLabel={i18n.translate('screens.how_to_use.actions.back.accessibility.hint.label')}
                    accessibilityHint={i18n.translate('screens.how_to_use.actions.back.accessibility.hint.hint')}
                  >
                    <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} tintColor={colors.iconMainTintColor} />
                  </ButtonWrapper>
                </Layout>
              }
            </View>
            <View style={styles(colors, insets).bottomContainer}>
              {renderContent(colors)}
            </View>
          </ImageBackground>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Template.defaultProps = {
  pressable: false,
  closable: false,
  onPress: () => {},
  onClose: () => {},
  header: '',
  description: '',
};

Template.propTypes = {
  pressable: PropTypes.bool,
  closable: PropTypes.bool,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
  header: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.oneOf(Object.values(images)).isRequired,
};
