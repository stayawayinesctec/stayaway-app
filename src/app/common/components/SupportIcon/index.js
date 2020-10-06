/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useEffect, useState } from 'react';
import { Platform, UIManager, View, StyleSheet, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import Icon from '@app/common/components/Icon';
import Text from '@app/common/components/Text';

import { colors as commonColors, sizes, iconSizes } from '@app/common/theme';

const styles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: colors.white,
    padding: sizes.size10,
    borderRadius: sizes.size48,
    shadowColor: colors.grayLight,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    zIndex: 10,
    elevation: 30,
  },
  contentContainer: {
    width: sizes.size30 + sizes.size10,
    height: sizes.size30 + sizes.size10 * 2,
    backgroundColor: colors.white,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: sizes.size8,
    marginLeft: -sizes.size10 - (iconSizes.size30 / 2),
    shadowColor: colors.grayLight,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    zIndex: 5,
    elevation: 25,
  },
  contentWrapper: {
    height: sizes.size30,
    borderRightWidth: sizes.size8,
    borderColor: colors.green,
  },
  wrapper: {
    paddingLeft: (sizes.size10 + iconSizes.size30 / 2) + sizes.size16,
  },
});

export default function SupportIcon(props) {
  const { label, content, color } = props;
  const hasLabel = label.length > 0;
  const hasContent = content.length > 0;

  const [isMounted, setIsMounted] = useState(false);
  const [contentStyle, setContentStyle] = useState({});
  useEffect(() => {
    setTimeout(() => {
      if (
        Platform.OS === "android" &&
        UIManager.setLayoutAnimationEnabledExperimental
      ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }

      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          300,
          LayoutAnimation.Types.linear,
          LayoutAnimation.Properties.opacity,
        ));
      setContentStyle({
        flex: 1,
      });
      setIsMounted(true);
    }, 500);
  }, [isMounted]);

  return (
    <ThemeConsumer>
      {({ colors }) => (
        <View style={styles(colors).container}>
          <View style={styles(colors).iconContainer}>
            <Icon name='support' width={iconSizes.size30} height={iconSizes.size30} />
          </View>
          { ((hasLabel || hasContent)) &&
            <View
              style={{
                ...styles(colors).contentContainer,
                ...contentStyle,
              }}
            >
              <View
                style={{
                    ...styles(colors).contentWrapper,
                    width: isMounted ? '100%' : sizes.size30 + sizes.size10,
                    borderColor: color,
                  }}
              >
                { isMounted &&
                  <View style={styles(colors).wrapper}>
                    { hasLabel &&
                    <Text size='xsmall'>{label}</Text>
                      }
                    { hasContent &&
                    <Text size='small' weight='bold'>{content}</Text>
                      }
                  </View>
                }
              </View>
            </View>
          }
        </View>
      )}
    </ThemeConsumer>
  );
}

SupportIcon.defaultProps = {
  label: '',
  content: '',
  color: commonColors.green,
};

SupportIcon.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
  color: PropTypes.oneOf(['', ...Object.values(commonColors)]),
};
