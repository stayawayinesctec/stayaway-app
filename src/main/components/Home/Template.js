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
import { View, StyleSheet, Platform, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Icon from '@app/common/components/Icon';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';
import Images from '@app/common/assets/images';
import SupportIcon from '@app/common/components/SupportIcon';

import { colors as commonColors, sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors, insets) => StyleSheet.create({
  imageContainer: {
    height: 300,
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    paddingBottom: sizes.size48,
  },
  updateContainer: {
    alignItems: 'flex-end',
    marginRight: sizes.size8,
    marginBottom: sizes.size8,
  },
  settingsButton: {
    alignSelf: 'flex-end',
    marginTop: Platform.select({
      android: sizes.size24,
      ios: insets.top + sizes.size24,
    }),
    marginRight: sizes.size24,
  },
  header: {
    marginTop: -100,
  },
  backgroundPanel: {
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes.size24,
    paddingVertical: sizes.size24,
  },
  supportContainer: {
    position: 'absolute',
    bottom: -iconSizes.size30,
    left: sizes.size24,
  },
  descriptionsContent: {
    marginTop: sizes.size48,
  },
  iconError: {
    marginLeft: -sizes.size8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: sizes.size8,
  },
  iconTitle: {
    alignSelf: 'center',
  },
  errorPanel: {
    marginBottom: sizes.size24,
  },
  errorPanelContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: sizes.size24,
    paddingVertical: sizes.size24,
  },
  settingsButtonContainer: {
    top: Platform.select({
      android: sizes.size24,
      ios: 0,
    }),
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    height: '100%',
  },
  backdropContainer: {
    top: 0,
    position: 'absolute',
    zIndex: 50,
    width: '100%',
    height: '100%',
    backgroundColor: colors.blueDark,
    opacity: 0.4,
  },
  errorsContainer: {
    position: 'absolute',
    zIndex: 100,
    marginTop: -sizes.size24 + 200,
    width: '100%',
    height: '100%',
  },
  errorsLayout: {
    flex: 0,
    backgroundColor: colors.transparent,
  },
});

export default function Template (props) {
  const {
    header,
    description,
    image,
    panelBackgroundColor,
    panelTextColor,
    lastSync,
    onPress,
    onLongPress,
    error,
  } = props;

  const hasUpdated = lastSync !== 0;
  const insets = useSafeAreaInsets();

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <View style={styles(colors, insets).settingsButtonContainer}>
            <ButtonWrapper
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles(colors, insets).settingsButton}
              accessibilityLabel={i18n.translate('screens.home.actions.settings.accessibility.label')}
              accessibilityHint={i18n.translate('screens.home.actions.settings.accessibility.hint')}
            >
              <Icon name='settings' width={iconSizes.size48} height={iconSizes.size48} />
            </ButtonWrapper>
          </View>
          { error.status &&
            <View style={styles(colors, insets).backdropContainer} />
          }
          { error.status &&
            <View style={styles(colors, insets).errorsContainer}>
              <Layout
                padding='horizontal'
                style={styles(colors, insets).errorsLayout}
              >
                <View style={styles(colors, insets).content}>
                  <View>
                    <View
                      style={{
                        ...styles(colors, insets).backgroundPanel,
                        backgroundColor: colors.white,
                      }}
                    />
                    <View style={styles(colors, insets).panel}>
                      <View style={styles(colors, insets).errorPanel}>
                        <ButtonWrapper
                          onPress={error.onPress}
                          style={styles(colors, insets).errorPanelContainer}
                          accessibilityLabel={error.accessibility.label}
                          accessibilityHint={error.accessibility.hint}
                        >
                          <View style={styles(colors, insets).titleContainer}>
                            <Icon name={error.icon} height={iconSizes.size25} tintColor={colors.blueDark} style={styles(colors, insets).iconError} />
                            <Text size='xlarge' weight='bold' textColor={colors.blueDark} style={styles(colors, insets).iconTitle}>{error.title}</Text>
                          </View>
                          <Text size='small' textColor={colors.blueDark} style={styles(colors, insets).description}>{error.message}</Text>
                        </ButtonWrapper>
                      </View>
                    </View>
                  </View>
                  <View style={styles(colors, insets).supportContainer}>
                    <SupportIcon />
                  </View>
                </View>
              </Layout>
            </View>
          }
          <View style={styles(colors, insets).homeContainer}>
            <ImageBackground
              testID="home_image_background"
              source={image}
              style={styles(colors, insets).imageContainer}
            />
            <Layout
              padding='horizontal'
              style={styles(colors, insets).contentContainer}
            >
              { ! error.status &&
                <View style={styles(colors, insets).header}>
                  <View>
                    <View
                      style={{
                        ...styles(colors, insets).backgroundPanel,
                        backgroundColor: panelBackgroundColor,
                      }}
                    />
                    <View style={styles(colors, insets).panel}>
                      <View style={styles(colors, insets).panelContainer}>
                        <Text size='xlarge' weight='bold' textColor={panelTextColor}>{header}</Text>
                      </View>
                      { hasUpdated &&
                        <View style={styles(colors, insets).updateContainer}>
                          <Text size='xsmall' textColor={panelTextColor}>
                            {i18n.translate('screens.home.last_updated')}
                          </Text>
                          <Text size='small' weight='bold' textColor={panelTextColor}>{lastSync.format('L')}</Text>
                        </View>
                      }
                      { !hasUpdated &&
                        <View style={styles(colors, insets).updateContainer}>
                          <Text size='xsmall' textColor={panelTextColor}>
                            {i18n.translate('screens.home.never_updated')}
                          </Text>
                        </View>
                      }
                    </View>
                  </View>
                  <View style={styles(colors, insets).supportContainer}>
                    <SupportIcon />
                  </View>
                </View>
              }
              <Text style={styles(colors, insets).descriptionsContent}>
                { description.map(item => <Text key={item.key} weight={item.type}>{item.text}</Text>) }
              </Text>
            </Layout>
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Template.defaultProps = {
  header: '',
  description: [],
  lastSync: 0,
  onPress: () => {},
  onLongPress: () => {},
  panelBackgroundColor: commonColors.green,
  panelTextColor: commonColors.white,
  error: {
    status: false,
    title: '',
    message: '',
    accessibility: {
      label: '',
      hint: '',
    },
    icon: '',
    onPress: () => {},
  },
};

Template.propTypes = {
  header: PropTypes.string,
  description: PropTypes.arrayOf(PropTypes.object),
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  panelBackgroundColor: PropTypes.oneOf(['', ...Object.values(commonColors)]),
  panelTextColor: PropTypes.oneOf(['', ...Object.values(commonColors)]),
  lastSync: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  image: PropTypes.oneOf(Object.values(Images)).isRequired,
  error: PropTypes.shape({
    status: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    accessibility: PropTypes.object,
    icon: PropTypes.string,
    onPress: PropTypes.func,
  }),
};
