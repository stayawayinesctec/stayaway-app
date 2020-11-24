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
    backgroundColor: colors.recommendationsPanelBackgroundColor,
    borderRadius: sizes.size8,
    borderWidth: sizes.size8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendationsTitle: {
    marginLeft: sizes.size24,
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
    paddingBottom: sizes.size24 + iconSizes.size30 - sizes.size8,
    paddingHorizontal: sizes.size8,
  },
  supportContainer: {
    marginTop: -sizes.size10 - (iconSizes.size30 / 2),
    marginHorizontal: sizes.size24,
    elevation: 30,
    flexDirection: 'column',
  },
  iconContainer: {
    width: iconSizes.size70,
    height: iconSizes.size70,
    marginBottom: sizes.size20,
  }
});

const renderRecommendation = ([recommendationA, recommendationB], colors) => (
  <View key={recommendationA.key} style={styles(colors).recommendationsRow}>
    <View style={{...styles(colors).recommendation, marginRight: sizes.size8}}>
      <View style={styles(colors).iconContainer}>
        {recommendationA.renderIcon(colors.recommendationsPanelIconTintColor)}
      </View>
      <Text textColor={colors.recommendationsPanelTextColor} size='small' textAlign='center'>{recommendationA.text}</Text>
    </View>
    <View style={styles(colors).recommendation}>
      <View style={styles(colors).iconContainer}>
        {recommendationB.renderIcon(colors.recommendationsPanelIconTintColor)}
      </View>
      <Text textColor={colors.recommendationsPanelTextColor} size='small' textAlign='center'>{recommendationB.text}</Text>
    </View>
  </View>
);

export default function Recommendations (props) {
  const { borderColor, panelBorderColor, backgroundColor, recommendations, onPress } = props;

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <Layout
            style={{
              ...styles(colors).contentContainer,
              backgroundColor,
            }}
          >
            <View
              style={{
                ...styles(colors).recommendationsContainer,
                borderColor: panelBorderColor,
              }}
            >
              <View style={styles(colors).recommendations}>
                <Text textColor={colors.recommendationsPanelTextColor} weight='bold' style={styles(colors).recommendationsTitle}>{i18n.translate('screens.recommendations.title')}</Text>
                { recommendations.map(item => renderRecommendation(item, colors)) }
              </View>
            </View>
            <ButtonWrapper
              onPress={onPress}
              accessibilityLabel={i18n.translate('screens.recommendations.support.accessibility.label')}
              accessibilityHint={i18n.translate('screens.recommendations.support.accessibility.hint')}
              style={styles(colors).supportContainer}
            >
              <SupportIcon
                label={i18n.translate('screens.recommendations.support.label')}
                content={i18n.translate('common.links.min_saude_covid').substring(8)}
                borderColor={borderColor}
              />
            </ButtonWrapper>
          </Layout>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Recommendations.defaultProps = {
  panelBorderColor: '',
  backgroundColor: '',
  borderColor: '',
  recommendations: [],
  onPress: () => {},
};

Recommendations.propTypes = {
  recommendations: PropTypes.arrayOf(PropTypes.array),
  panelBorderColor: PropTypes.oneOf(['', ...commonColors]),
  backgroundColor: PropTypes.oneOf(['', ...commonColors]),
  borderColor: PropTypes.oneOf(['', ...commonColors]),
  onPress: PropTypes.func,
};
