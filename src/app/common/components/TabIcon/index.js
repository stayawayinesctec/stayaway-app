/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { PulseIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import accountActions from '@app/redux/account';
import { isExposed, isTrackingEnabled, hasServicesErrors } from '@app/redux/account/selectors';

import AppRoutes from '@app/navigation/routes';

import NavigationService from '@app/services/navigation';
import Tooltip from '@app/services/tooltip';
import Storage from '@app/services/storage';
import i18n from '@app/services/i18n';

import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Icon from '@app/common/components/Icon';
import Text from '@app/common/components/Text';
import { iconSizes, sizes } from '@app/common/theme';

const styles = StyleSheet.create({
  container: {
    paddingTop: sizes.size8,
    paddingBottom: sizes.size4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: -sizes.size20,
    marginBottom: sizes.size8,
    width: iconSizes.size96 * 2,
    height: iconSizes.size96 * 2,
  },
  label: {
    paddingTop: sizes.size2,
  },
  pulse: {
    position: 'absolute',
    bottom: 0,
  },
});

export default function TabIcon(props) {
  const { name, active, title } = props;

  const dispatch = useDispatch();

  const exposed = useSelector(isExposed);
  const hasErrors = useSelector(hasServicesErrors);
  const trackingEnabled = useSelector(isTrackingEnabled);

  const target = useRef(null);
  const parent = useRef(null);

  const onPress = () => NavigationService.navigate(AppRoutes.HOME);
  const onLongPress = () => dispatch(accountActions.switchTracking());

  let showTooltip = () => {};

  useEffect(() => {
    async function toogleTooltips() {
      if (name === 'home') {
        const hasShownHomeTooltip = await Storage.getItem('tooltip_home_long_press', 'false');
        console.log('hasShownHomeTooltip', hasShownHomeTooltip);
        if (hasShownHomeTooltip === 'false') {
          setTimeout(showTooltip, 2000);
          Storage.setItem('tooltip_home_long_press', 'true');
          await Storage.setItem('tooltip_home_long_press_again', 'true');
        }
        const hasShownHomeTooltipAgain = await Storage.getItem('tooltip_home_long_press_again', 'false');
        console.log('hasShownHomeTooltipAgain', hasShownHomeTooltipAgain);
        if (hasShownHomeTooltipAgain === 'false') {
          setTimeout(showTooltip, 2000);
          Storage.setItem('tooltip_home_long_press_again', 'true');
        }
      }
    }

    toogleTooltips();
  }, []);

  return (
    <ThemeConsumer>
      {({ colors }) => {
        showTooltip = () => Tooltip.show(i18n.translate('common.popover.home_long_press'), target.current, parent.current, colors);

        let iconName = `${name}_inactive`;
        let textColor = colors.tabBarInactiveTextColor;
        let iconColor = colors.tabBarInactiveIconColor;

        if (active) {
          iconName = `${name}_active`;
          textColor = colors.tabBarActiveTextColor;
          iconColor = colors.tabBarActiveIconColor;
        }

        if (name === 'home') {
          let pulseColor = colors.tabBarHomeHealtyPulseColor;
          iconColor = colors.tabBarHomeHealtyCircleColor;

          if (exposed) {
            pulseColor = colors.tabBarHomeExposedPulseColor;
            iconColor = colors.tabBarHomeExposedCircleColor;
          }

          if (hasErrors || !trackingEnabled) {
            pulseColor = colors.tabBarHomeErrorPulseColor;
            iconColor = colors.tabBarHomeErrorCircleColor;
          }

          return (
            <View
              ref={parent}
              style={[styles.container, styles.logo]}
            >
              <PulseIndicator
                useNativeDriver
                animating={trackingEnabled && !hasErrors}
                color={pulseColor}
                animationDuration={2000}
                size={iconSizes.size96 * 2}
                style={styles.pulse}
              />
              <ButtonWrapper
                ref={target}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <Icon
                  name={iconName}
                  width={iconSizes.size96}
                  height={iconSizes.size96}
                  tintColor={iconColor}
                />
              </ButtonWrapper>
            </View>
          );
        }

        return (
          <View style={styles.container}>
            <Icon
              name={iconName}
              width={iconSizes.size25}
              height={iconSizes.size25}
              tintColor={iconColor}
            />
            <Text
              textColor={textColor}
              size='xxsmall'
              weight='semibold'
              style={styles.label}
            >
              {title}
            </Text>
          </View>
        );
      }}
    </ThemeConsumer>
  );
}

TabIcon.defaultProps = {
  active: false,
  title: '',
};

TabIcon.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
  name: PropTypes.oneOf([
    'home', 'recommendations', 'diagnosis',
  ]).isRequired,
};
