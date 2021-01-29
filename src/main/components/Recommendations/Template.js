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
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import SupportIcon from '@app/common/components/SupportIcon';
import Text from '@app/common/components/FormattedText';

import { colors as commonColors, sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors) => StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  recommendationsContainer: {
    backgroundColor: colors.recommendationsPanelBackgroundColor,
    paddingBottom: sizes.size20,
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
    marginLeft: sizes.size16,
    paddingTop: sizes.size24 - sizes.size8,
    paddingBottom: sizes.size24,
  },
  recommendation: {
    flex: 1,
    alignItems: 'center',
  },
  recommendationIcon: {
    width: iconSizes.size70,
    height: iconSizes.size70,
    marginBottom: sizes.size16,
  },
  recommendationsRow: {
    flexDirection: 'row',
    marginBottom: sizes.size20,
  },
  supportContainer: {
    marginTop: -sizes.size10 - (iconSizes.size30 / 2),
    marginHorizontal: sizes.size18,
    elevation: 30,
    flexDirection: 'column',
  },
});

function renderRecommendation(...args) {
  const [
    [recommendationA, recommendationB],
    colors,
    style,
  ] = args;

  return (
    <View key={recommendationA.key} style={style.recommendationsRow}>
      <View style={{...style.recommendation, marginRight: sizes.size8}}>
        <View style={style.recommendationIcon}>{recommendationA.icon}</View>
        <Text textColor={colors.recommendationsPanelTextColor} size='small' textAlign='center'>{recommendationA.text}</Text>
      </View>
      <View style={style.recommendation}>
        <View style={style.recommendationIcon}>{recommendationB.icon}</View>
        <Text textColor={colors.recommendationsPanelTextColor} size='small' textAlign='center'>{recommendationB.text}</Text>
      </View>
    </View>
  );
}

export default function Template (props) {
  const { borderColor, panelBorderColor, backgroundColor, recommendations, onPress } = props;

  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors), [name]);

  return (
    <TopComponent>
      <Layout
        style={{
          ...memoizedStyle.contentContainer,
          backgroundColor,
        }}
      >
        <View
          style={{
            ...memoizedStyle.recommendationsContainer,
            borderColor: panelBorderColor,
          }}
        >
          <Text textColor={colors.recommendationsPanelTextColor} weight='bold' style={memoizedStyle.recommendationsTitle}>{i18n.translate('screens.recommendations.title')}</Text>
          { recommendations.map(item => renderRecommendation(item, colors, memoizedStyle)) }
        </View>
        <ButtonWrapper
          onPress={onPress}
          accessibilityLabel={i18n.translate('screens.recommendations.support.accessibility.label')}
          accessibilityHint={i18n.translate('screens.recommendations.support.accessibility.hint')}
          style={memoizedStyle.supportContainer}
        >
          <SupportIcon
            label={i18n.translate('screens.recommendations.support.label')}
            content={i18n.translate('common.links.min_saude_covid').substring(8)}
            borderColor={borderColor}
          />
        </ButtonWrapper>
      </Layout>
    </TopComponent>
  );
}

Template.defaultProps = {
  panelBorderColor: '',
  backgroundColor: '',
  borderColor: '',
  recommendations: [],
  onPress: () => {},
};

Template.propTypes = {
  recommendations: PropTypes.arrayOf(PropTypes.array),
  panelBorderColor: PropTypes.oneOf(['', ...commonColors]),
  backgroundColor: PropTypes.oneOf(['', ...commonColors]),
  borderColor: PropTypes.oneOf(['', ...commonColors]),
  onPress: PropTypes.func,
};
