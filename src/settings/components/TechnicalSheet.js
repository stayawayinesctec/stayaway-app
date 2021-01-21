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
import { StyleSheet, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Icon from '@app/common/components/Icon';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/FormattedText';

import { getThemedImage } from '@app/common/assets/images';

import { sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors, insets) => StyleSheet.create({
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
  itemsContainer: {
    marginBottom: sizes.size48,
  },
  title: {
    paddingVertical: sizes.size16,
    marginBottom: sizes.size24,
  },
  legendContainer: {
    marginTop: sizes.size16,
  },
  coordinatorContainer: {
    marginBottom: sizes.size40,
    width: '50%',
  },
  itemLabel: {
    marginLeft: sizes.size8,
    marginBottom: sizes.size8,
  },
  item: {
    backgroundColor: colors.settingsAltButtonBackgroundColor,
    paddingLeft: sizes.size16,
    paddingRight: sizes.size16,
    paddingVertical: sizes.size8,
    height: sizes.size48 + sizes.size8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sizes.size8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
  },
  itemsRow: {
    flexDirection: 'row',
    marginBottom: sizes.size8,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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

export default function TechnicalSheet (props) {
  const {
    onPressCoordinator,
    onPressISPUP,
    onPressKeyruptive,
    onPressUbirider,
    onPressSPMS,
    onClose,
  } = props;

  const insets = useSafeAreaInsets();
  const { name, colors } = useTheme();

  return (
    <TopComponent>
      <Layout style={styles(colors, insets).layoutContainer}>
        <View style={styles(colors, insets).header}>
          <ButtonWrapper
            onPress={onClose}
            style={styles(colors, insets).closeButton}
            accessibilityLabel={i18n.translate('screens.technical_sheet.actions.back.accessibility.label')}
            accessibilityHint={i18n.translate('screens.technical_sheet.actions.back.accessibility.hint')}
          >
            <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} tintColor={colors.iconMainTintColor} />
          </ButtonWrapper>
          <Text size='xlarge' weight='bold' style={styles(colors, insets).title}>{i18n.translate('screens.technical_sheet.title')}</Text>
        </View>
        <View style={styles(colors, insets).itemsContainer}>
          <View style={styles(colors, insets).coordinatorContainer}>
            <Text size='small' weight='bold' textColor={colors.settingsLabelTextColor} style={styles(colors, insets).itemLabel}>{i18n.translate('screens.technical_sheet.coordination')}</Text>
            <ButtonWrapper
              style={styles(colors, insets).item}
              onPress={onPressCoordinator}
              accessibilityRole='link'
              accessibilityLabel={i18n.translate('screens.technical_sheet.inesctec.accessibility.label')}
              accessibilityHint={i18n.translate('screens.technical_sheet.inesctec.accessibility.hint')}
            >
              <Image source={getThemedImage('logo_inesctec', name)} />
            </ButtonWrapper>
          </View>
          <View style={styles(colors, insets).partnersContainer}>
            <Text size='small' weight='bold' textColor={colors.settingsLabelTextColor} style={styles(colors, insets).itemLabel}>{i18n.translate('screens.technical_sheet.partners')}</Text>
            <View style={styles(colors, insets).itemsRow}>
              <ButtonWrapper
                style={{
                  ...styles(colors, insets).item,
                  marginRight: sizes.size8,
                }}
                onPress={onPressISPUP}
                accessibilityRole='link'
                accessibilityLabel={i18n.translate('screens.technical_sheet.ispup.accessibility.label')}
                accessibilityHint={i18n.translate('screens.technical_sheet.ispup.accessibility.hint')}
              >
                <Image source={getThemedImage('logo_ispup', name)} />
              </ButtonWrapper>
              <ButtonWrapper
                style={styles(colors, insets).item}
                onPress={onPressKeyruptive}
                accessibilityRole='link'
                accessibilityLabel={i18n.translate('screens.technical_sheet.keyruptive.accessibility.label')}
                accessibilityHint={i18n.translate('screens.technical_sheet.keyruptive.accessibility.hint')}
              >
                <Image source={getThemedImage('logo_keyruptive', name)} />
              </ButtonWrapper>
            </View>
            <View style={styles(colors, insets).itemsRow}>
              <ButtonWrapper
                style={{
                  ...styles(colors, insets).item,
                  marginRight: sizes.size8,
                }}
                onPress={onPressUbirider}
                accessibilityRole='link'
                accessibilityLabel={i18n.translate('screens.technical_sheet.ubirider.accessibility.label')}
                accessibilityHint={i18n.translate('screens.technical_sheet.ubirider.accessibility.hint')}
              >
                <Image source={getThemedImage('logo_ubirider', name)} />
              </ButtonWrapper>
              <ButtonWrapper
                style={styles(colors, insets).item}
                onPress={onPressSPMS}
                accessibilityRole='link'
                accessibilityLabel={i18n.translate('screens.technical_sheet.spms.accessibility.label')}
                accessibilityHint={i18n.translate('screens.technical_sheet.spms.accessibility.hint')}
              >
                <Image source={getThemedImage('logo_spms', name)} />
              </ButtonWrapper>
            </View>
          </View>
        </View>
      </Layout>
      <View style={styles(colors, insets).imagesContainer}>
        <View style={styles(colors, insets).sponsors}>
          <Image source={getThemedImage('republica_portuguesa', name)} style={styles(colors, insets).republicaPortuguesaImage} />
          <Image source={getThemedImage('logo_dgs', name)} style={styles(colors, insets).dgsImage} />
        </View>
        <Image source={getThemedImage('splash', name)} style={styles(colors, insets).splashImage} />
      </View>
    </TopComponent>
  );
}

TechnicalSheet.defaultProps = {
  onPressCoordinator: () => {},
  onPressISPUP: () => {},
  onPressKeyruptive: () => {},
  onPressUbirider: () => {},
  onPressSPMS: () => {},
  onClose: () => {},
};

TechnicalSheet.propTypes = {
  onPressCoordinator: PropTypes.func,
  onPressISPUP: PropTypes.func,
  onPressKeyruptive: PropTypes.func,
  onPressUbirider: PropTypes.func,
  onPressSPMS: PropTypes.func,
  onClose: PropTypes.func,
};
