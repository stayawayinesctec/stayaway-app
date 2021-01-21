/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { getThemedImage } from '@app/common/assets/images';
import { sizes, iconSizes } from '@app/common/theme';

import Icon from '@app/common/components/Icon';
import ButtonWrapper from '@app/common/components/ButtonWrapper';

import Consent from '@onboarding/components/Onboarding/Consent';
import Template from '@onboarding/components/Onboarding/Template';

import i18n from '@app/services/i18n';

const styles = (insets) => StyleSheet.create({
  container: {},
  paginationStyle: {
    position: 'absolute',
    bottom: sizes.size24 + insets.bottom,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
  },
  dotStyle: {
    width: sizes.size12,
    height: sizes.size12,
    borderRadius: sizes.size8,
    marginLeft: sizes.size8,
    marginRight: sizes.size8,
    marginTop: sizes.size8,
    marginBottom: sizes.size8,
  },
  arrowContainer: {
    padding: sizes.size16,
  },
});

function renderPagination(...args) {
  const [
    index,
    total,
    swiper,
    colors,
    insets,
  ] = args;

  const dots = [];

  const ActiveDot = (
    <View
      style={{
        ...styles(insets).dotStyle,
        backgroundColor: colors.iconMainTintColor,
      }}
    />
  );

  const Dot = (
    <View
      style={{
        ...styles(insets).dotStyle,
        backgroundColor: colors.iconMainTintColor,
        opacity: 0.4,
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
      style={{
        ...styles(insets).paginationStyle,
        bottom: insets.bottom + sizes.size24,
      }}
    >
      { index !== 0 &&
        <ButtonWrapper
          style={styles(insets).arrowContainer}
          onPress={() => swiper.current.scrollBy(-1)}
        >
          <Icon name='chevron_left' width={iconSizes.size14} height={iconSizes.size22} tintColor={colors.iconMainTintColor} />
        </ButtonWrapper>
      }
      <View style={styles(insets).dots}>
        {dots}
      </View>
      { index !== total &&
        <ButtonWrapper
          style={styles(insets).arrowContainer}
          onPress={() => swiper.current.scrollBy(1)}
        >
          <Icon name='chevron_right' width={iconSizes.size14} height={iconSizes.size22} tintColor={colors.iconMainTintColor} />
        </ButtonWrapper>
      }
    </View>
  );
};

export default function Onboarding (props) {
  const { loading, shouldShowLocationScreen, onPress } = props;

  const [index, setIndex] = useState(0);
  const swiper = useRef(null);

  const insets = useSafeAreaInsets();
  const { name, colors } = useTheme();

  return (
    <Swiper
      testID="onboarding"
      loop={false}
      style={styles(insets).container}
      onIndexChanged={(currentIndex) => setIndex(currentIndex)}
      showsPagination={index < (shouldShowLocationScreen ? 5 : 4)}
      dotStyle={styles(insets).dotStyle}
      ref={swiper}
      renderPagination={() => renderPagination(index, shouldShowLocationScreen ? 5 : 4, swiper, colors, insets)}
    >
      <Template
        header={i18n.translate('screens.onboarding.first.title')}
        image={getThemedImage('onboarding1', name)}
      />
      <Template
        header={i18n.translate('screens.onboarding.second.title')}
        description={i18n.translate('screens.onboarding.second.description')}
        image={getThemedImage('onboarding2', name)}
      />
      <Template
        header={i18n.translate('screens.onboarding.third.title')}
        description={i18n.translate('screens.onboarding.third.description')}
        image={getThemedImage('onboarding3', name)}
      />
      <Template
        header={i18n.translate('screens.onboarding.fourth.title')}
        description={i18n.translate('screens.onboarding.fourth.description')}
        image={getThemedImage('onboarding4', name)}
      />
      {shouldShowLocationScreen &&
        <Template
          header={i18n.translate('screens.onboarding.fifth.title')}
          description={i18n.translate('screens.onboarding.fifth.description')}
          image={getThemedImage('onboarding5', name)}
        />
      }
      <Consent loading={loading} onPress={onPress} />
    </Swiper>
  );
}

Onboarding.defaultProps = {
  loading: false,
  shouldShowLocationScreen: false,
  onPress: () => {},
};

Onboarding.propTypes = {
  loading: PropTypes.bool,
  shouldShowLocationScreen: PropTypes.bool,
  onPress: PropTypes.func,
};
