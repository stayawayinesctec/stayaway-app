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
import Swiper from 'react-native-swiper';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import Images from '@app/common/assets/images';
import { sizes } from '@app/common/theme';

import InformedConsent from '@onboarding/components/InformedConsent';
import Template from '@onboarding/components/Onboarding/Template';

import i18n from '@app/services/i18n';

const styles = (colors) => StyleSheet.create({
  container: {},
  paginationStyle: {
    position: 'absolute',
    bottom: sizes.size24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: colors.transparent,
  },
  dotStyle: {
    width: sizes.size8,
    height: sizes.size8,
    borderRadius: sizes.size6,
    marginLeft: sizes.size6,
    marginRight: sizes.size6,
    marginTop: sizes.size6,
    marginBottom: sizes.size6,
  },
});

const renderPagination = (index, total, {colors, insets}) => {
  const dots = [];

  const ActiveDot = (
    <View
      style={{
        ...styles(colors).dotStyle,
        backgroundColor: colors.blueDark,
      }}
    />
  );

  const Dot = (
    <View
      style={{
        ...styles(colors).dotStyle,
        backgroundColor: colors.grayLight,
      }}
    />
  );

  for (let i = 0; i < total; i++) {
    dots.push(
      i === index
      ? React.cloneElement(ActiveDot, { key: i })
      : React.cloneElement(Dot, { key: i }),
    );
  }

  return (
    <View
      pointerEvents='none'
      style={{
        ...styles(colors).paginationStyle,
        bottom: insets.bottom + sizes.size24,
      }}
    >
      {dots}
    </View>
  );
};

export default function Onboarding (props) {
  const { loading, onPress } = props;

  const [index, setIndex] = useState(0);

  return (
    <ThemeConsumer>
      {({colors}) => (
        <SafeAreaConsumer>
          {insets => (
            <Swiper
              testID="onboarding"
              loop={false}
              style={styles(colors).container}
              paginationStyle={{
                ...styles(colors).paginationStyle,
                top: insets.top + sizes.size24,
              }}
              onIndexChanged={(currentIndex) => setIndex(currentIndex)}
              showsPagination={index < 4}
              dotStyle={styles(colors).dotStyle}
              renderPagination={() => renderPagination(index, 4, {colors, insets})}
            >
              <Template
                header={i18n.translate('screens.onboarding.first.title')}
                image={Images.onboarding1}
              />
              <Template
                header={i18n.translate('screens.onboarding.second.title')}
                description={i18n.translate('screens.onboarding.second.description')}
                image={Images.onboarding2}
              />
              <Template
                header={i18n.translate('screens.onboarding.third.title')}
                description={i18n.translate('screens.onboarding.third.description')}
                image={Images.onboarding3}
              />
              <Template
                header={i18n.translate('screens.onboarding.fourth.title')}
                description={i18n.translate('screens.onboarding.fourth.description')}
                image={Images.onboarding4}
              />
              <InformedConsent loading={loading} onPress={onPress} />
            </Swiper>
          )}
        </SafeAreaConsumer>
      )}
    </ThemeConsumer>
  );
}

Onboarding.defaultProps = {
  loading: false,
  onPress: () => {},
};

Onboarding.propTypes = {
  loading: PropTypes.bool,
  onPress: PropTypes.func,
};
