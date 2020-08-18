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
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Icon from '@app/common/components/Icon';
import SupportIcon from '@app/common/components/SupportIcon';
import Text from '@app/common/components/Text';

import { colors as commonColors, sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors) => StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  recommendationsContainer: {
    backgroundColor: colors.white,
    borderRadius: sizes.size8,
    paddingBottom: sizes.size32,
    shadowColor: colors.grayLight,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  recommendationsTitle: {
    marginLeft: sizes.size16,
    marginBottom: sizes.size24,
  },
  recommendationsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: sizes.size8,
  },
  recommendation: {
    flex: 1,
    alignItems: 'center',
    paddingTop: sizes.size24,
    paddingHorizontal: sizes.size8,
  },
  recommendations: {
    paddingTop: sizes.size24,
    paddingHorizontal: sizes.size8,
  },
  supportContainer: {
    position: 'absolute',
    bottom: -iconSizes.size30,
    left: sizes.size24,
  },
  iconContainer: {
    width: iconSizes.size70,
    height: iconSizes.size70,
    marginBottom: sizes.size20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: sizes.size16,
    padding: sizes.size4,
    alignSelf: 'flex-end',
    backgroundColor: colors.white,
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
});

const renderRecommendation = ([recommendationA, recommendationB], colors) => (
  <View key={recommendationA.key} style={styles(colors).recommendationsRow}>
    <View style={{...styles(colors).recommendation, marginRight: sizes.size8}}>
      <View style={styles(colors).iconContainer}>
        {recommendationA.renderIcon()}
      </View>
      <Text size='small' textAlign='center'>{recommendationA.text}</Text>
    </View>
    <View style={styles(colors).recommendation}>
      <View style={styles(colors).iconContainer}>
        {recommendationB.renderIcon()}
      </View>
      <Text size='small' textAlign='center'>{recommendationB.text}</Text>
    </View>
  </View>
);

export default function Recommendations (props) {
  const { color, recommendations, onPress } = props;

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <Layout
            style={{
              ...styles(colors).contentContainer,
              backgroundColor: color,
            }}
          >
            <View style={styles(colors).recommendationsContainer}>
              <View style={styles(colors).recommendations}>
                <Text weight='bold' style={styles(colors).recommendationsTitle}>{i18n.translate('screens.recommendations.title')}</Text>
                { recommendations.map(item => renderRecommendation(item, colors)) }
              </View>
              <View style={styles(colors).supportContainer}>
                <SupportIcon />
              </View>
            </View>
            <ButtonWrapper
              onPress={onPress}
              style={styles(colors).linkContainer}
              accessibilityLabel={i18n.translate('screens.recommendations.more_info.accessibility.label')}
              accessibilityHint={i18n.translate('screens.recommendations.more_info.accessibility.hint')}
            >
              <Icon name="more_info" width={iconSizes.size37} height={iconSizes.size37} style={styles(colors).linkIcon} />
              <Text size="xxsmall">{ i18n.translate('screens.recommendations.more_info.label') }</Text>
            </ButtonWrapper>
          </Layout>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Recommendations.defaultProps = {
  color: commonColors.green,
  recommendations: [],
  onPress: () => {},
};

Recommendations.propTypes = {
  recommendations: PropTypes.arrayOf(PropTypes.array),
  color: PropTypes.oneOf(['', ...Object.values(commonColors)]),
  onPress: PropTypes.func,
};
