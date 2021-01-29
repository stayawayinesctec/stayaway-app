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
import { StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { getThemedImage } from '@app/common/assets/images';
import { sizes, iconSizes } from '@app/common/theme';

import Icon from '@app/common/components/Icon';

import Template from '@onboarding/components/Onboarding/Template';

import i18n from '@app/services/i18n';

const styles = (insets) => StyleSheet.create({
  container: {},
  paginationStyle: {
    bottom: insets.bottom + sizes.size8,
  },
  buttonWrapperStyle: {
    paddingBottom: insets.bottom + sizes.size4 + sizes.size8,
    paddingHorizontal: sizes.size24,
    paddingVertical: 0,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  dotStyle: {
    width: sizes.size12,
    height: sizes.size12,
    borderRadius: sizes.size8,
    marginLeft: sizes.size8,
    marginRight: sizes.size8,
    marginTop: sizes.size8,
    marginBottom: sizes.size8,
    opacity: 0.4,
  },
  activeDotStyle: {
    width: sizes.size12,
    height: sizes.size12,
    borderRadius: sizes.size8,
    marginLeft: sizes.size8,
    marginRight: sizes.size8,
    marginTop: sizes.size8,
    marginBottom: sizes.size8,
  },
});

export default function HowToUse (props) {
  const {
    shouldShowLocationScreen,
    onPress,
    onClose,
  } = props;

  const insets = useSafeAreaInsets();
  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(insets), [insets]);

  return (
    <Swiper
      loop={false}
      showsButtons
      buttonWrapperStyle={memoizedStyle.buttonWrapperStyle}
      paginationStyle={memoizedStyle.paginationStyle}
      nextButton={<Icon name='chevron_right' width={iconSizes.size14} height={iconSizes.size22} />}
      prevButton={<Icon name='chevron_left' width={iconSizes.size14} height={iconSizes.size22} />}
      style={memoizedStyle.container}
      dotColor={colors.iconMainTintColor}
      dotStyle={memoizedStyle.dotStyle}
      activeDotColor={colors.iconMainTintColor}
      activeDotStyle={memoizedStyle.activeDotStyle}
    >
      <Template
        header={i18n.translate('screens.onboarding.first.title')}
        image={getThemedImage('onboarding1', name)}
        closable
        onClose={onClose}
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
        pressable={!shouldShowLocationScreen}
        onPress={onPress}
      />
      {shouldShowLocationScreen &&
        <Template
          header={i18n.translate('screens.onboarding.fifth.title')}
          description={i18n.translate('screens.onboarding.fifth.description')}
          image={getThemedImage('onboarding5', name)}
          pressable
          onPress={onPress}
        />
      }
    </Swiper>
  );
}

HowToUse.defaultProps = {
  shouldShowLocationScreen: false,
  onPress: () => {},
  onClose: () => {},
};

HowToUse.propTypes = {
  shouldShowLocationScreen: PropTypes.bool,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
};
