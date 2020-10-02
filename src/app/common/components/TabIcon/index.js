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
import { useSelector } from 'react-redux';
import { PulseIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { isExposed, isTrackingEnabled, hasServicesErrors } from '@app/redux/account/selectors';

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

export default function TabIcon (props) {
  const { name, active, title } = props;

  const exposed = useSelector(isExposed);
  const hasErrors = useSelector(hasServicesErrors);
  const trackingEnabled = useSelector(isTrackingEnabled);

  return (
    <ThemeConsumer>
      {({colors}) => {
        let iconName = `${name}_inactive`;
        let textColor = colors.blueLightest;

        if (active) {
          iconName = `${name}_active`;
          textColor = colors.blueDark;
        }

        if (name === 'home') {
          let pulseColor = colors.greenLight;
          let iconColor = colors.green;

          if (exposed) {
            pulseColor = colors.yellowLight;
            iconColor = colors.yellow;
          }

          if (hasErrors || ! trackingEnabled) {
            pulseColor = colors.redLight;
            iconColor = colors.red;
          }

          return (
            <View style={[styles.container, styles.logo]}>
              <PulseIndicator
                useNativeDriver
                animating={trackingEnabled && !hasErrors}
                color={pulseColor}
                animationDuration={2000}
                size={iconSizes.size96 * 2}
                style={styles.pulse}
              />
              <Icon name={iconName} width={iconSizes.size96} height={iconSizes.size96} tintColor={iconColor} />
            </View>
          );
        }

        return (
          <View style={styles.container}>
            <Icon name={iconName} width={iconSizes.size25} height={iconSizes.size25} />
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
