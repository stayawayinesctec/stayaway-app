/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { memo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { PulseIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import accountActions from '@app/redux/account';
import { isExposed, isTracingEnabled, hasServicesErrors } from '@app/redux/account/selectors';

import AppRoutes from '@app/navigation/routes';

import NavigationService from '@app/services/navigation';
import Tooltip from '@app/services/tooltip';
import Storage from '@app/services/storage';
import i18n from '@app/services/i18n';

import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Icon from '@app/common/components/Icon';
import Text from '@app/common/components/FormattedText';
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

function TabIcon(props) {
  const { name, active, title } = props;

  const dispatch = useDispatch();
  const { colors } = useTheme();

  const exposed = useSelector(isExposed);
  const hasErrors = useSelector(hasServicesErrors);
  const tracingEnabled = useSelector(isTracingEnabled);

  const target = useRef(null);
  const parent = useRef(null);

  const onPress = () => NavigationService.navigate(AppRoutes.HOME);
  const onLongPress = () => dispatch(accountActions.switchTracing());

  const showTooltip = () => Tooltip.show(i18n.translate('common.popover.home_long_press'), target.current, parent.current, colors);

  useEffect(() => {
    async function toogleTooltips() {
      if (name === 'home') {
        const hasShownHomeTooltip = await Storage.getItem('tooltip_home_long_press', 'false');
        if (hasShownHomeTooltip === 'false') {
          setTimeout(showTooltip, 2000);
          Storage.setItem('tooltip_home_long_press', 'true');
          await Storage.setItem('tooltip_home_long_press_again', 'true');
        }
        const hasShownHomeTooltipAgain = await Storage.getItem('tooltip_home_long_press_again', 'false');
        if (hasShownHomeTooltipAgain === 'false') {
          setTimeout(showTooltip, 2000);
          Storage.setItem('tooltip_home_long_press_again', 'true');
        }
      }
    }

    toogleTooltips();
  }, []);

  if (name === 'home') {
    let pulseColor = colors.tabBarHomeHealthyPulseColor;
    let iconName = 'home_healthy';

    if (exposed) {
      iconName = 'home_exposed';
      pulseColor = colors.tabBarHomeExposedPulseColor;
    }

    if (hasErrors || !tracingEnabled) {
      iconName = 'home_error';
      pulseColor = colors.tabBarHomeErrorPulseColor;
    }

    return (
      <View
        ref={parent}
        style={[styles.container, styles.logo]}
      >
        <PulseIndicator
          useNativeDriver
          animating={tracingEnabled && !hasErrors}
          color={pulseColor}
          animationDuration={2000}
          size={iconSizes.size96 * 2}
          style={styles.pulse}
        />
        <ButtonWrapper
          forwardRef={target}
          onPress={onPress}
          onLongPress={onLongPress}
        >
          <Icon
            name={iconName}
            width={iconSizes.size96}
            height={iconSizes.size96}
          />
        </ButtonWrapper>
      </View>
    );
  }

  let iconName = `${name}_inactive`;
  let textColor = colors.tabBarInactiveTextColor;

  if (active) {
    iconName = `${name}_active`;
    textColor = colors.tabBarActiveTextColor;
  }

  return (
    <View style={styles.container}>
      <Icon
        name={iconName}
        width={iconSizes.size25}
        height={iconSizes.size25}
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

export default memo(TabIcon);
