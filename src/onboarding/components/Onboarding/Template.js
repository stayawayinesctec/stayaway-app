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
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import i18n from '@app/services/i18n';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Button from '@app/common/components/Button';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Icon from '@app/common/components/Icon';
import Text from '@app/common/components/FormattedText';
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
    paddingBottom: insets.bottom + sizes.size24 * 2 + sizes.size16,
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

function renderContent(...args) {
  const [
    header,
    description,
    pressable,
    onPress,
    style,
  ] = args;

  if (description.length === 0) {
    return (
      <Layout padding='horizontal' style={style.centeredContainer}>
        <Text weight='bold' size='xxlarge' style={style.mainHeader}>{header}</Text>
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
    <Layout padding='horizontal' style={style.contentContainer}>
      {header.length > 0 && <Text weight='bold' size='xxlarge' style={style.header}>{header}</Text> }
      {description.length > 0 && <Text style={style.description}>{description}</Text>}
      { pressable &&
        <Button
          title={i18n.translate('common.actions.ok')}
          containerStyle={style.button}
          onPress={onPress}
          accessibilityLabel={i18n.translate('screens.how_to_use.actions.ok.accessibility.hint.label')}
          accessibilityHint={i18n.translate('screens.how_to_use.actions.ok.accessibility.hint.hint')}
        />
      }
    </Layout>
  );
}

export default function Template (props) {
  const { header, description, image, pressable, closable, onPress, onClose } = props;

  const insets = useSafeAreaInsets();
  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors, insets), [name, insets]);

  return (
    <TopComponent>
      <ImageBackground
        source={image}
        style={memoizedStyle.imageContainer}
      >
        <View style={memoizedStyle.topContainer}>
          { closable &&
            <Layout style={memoizedStyle.top}>
              <ButtonWrapper
                onPress={onClose}
                style={memoizedStyle.closeButton}
                accessibilityLabel={i18n.translate('screens.how_to_use.actions.back.accessibility.hint.label')}
                accessibilityHint={i18n.translate('screens.how_to_use.actions.back.accessibility.hint.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
              </ButtonWrapper>
            </Layout>
          }
        </View>
        <View style={memoizedStyle.bottomContainer}>
          {renderContent(header, description, pressable, onPress, memoizedStyle)}
        </View>
      </ImageBackground>
    </TopComponent>
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
  header: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  description: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  image: PropTypes.oneOf(Object.values(images)).isRequired,
};
