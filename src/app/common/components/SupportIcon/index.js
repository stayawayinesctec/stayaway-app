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

import Icon from '@app/common/components/Icon';
import Text from '@app/common/components/FormattedText';

import { colors as commonColors, sizes, iconSizes } from '@app/common/theme';

const styles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: colors.supportIconBackgroundColor,
    padding: sizes.size10,
    borderRadius: sizes.size48,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    zIndex: 10,
  },
  contentContainer: {
    backgroundColor: colors.supportIconBackgroundColor,
    flex: 1,
    justifyContent: 'center',
    borderRadius: sizes.size8,
    marginLeft: -sizes.size10 - (iconSizes.size30 / 2),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
  contentWrapper: {
    borderRightWidth: sizes.size8,
  },
  wrapper: {
    paddingLeft: (sizes.size10 + iconSizes.size30 / 2) + sizes.size16,
  },
});

export default function SupportIcon(props) {
  const { label, content, borderColor } = props;

  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors), [name]);

  const hasLabel = label.length > 0;
  const hasContent = content.length > 0;

  return (
    <View style={memoizedStyle.container}>
      <View style={memoizedStyle.iconContainer}>
        <Icon
          name='support'
          width={iconSizes.size30}
          height={iconSizes.size30}
        />
      </View>
      { (hasLabel || hasContent) &&
        <View style={memoizedStyle.contentContainer}>
          <View
            style={{
                ...memoizedStyle.contentWrapper,
                borderColor,
              }}
          >
            <View style={memoizedStyle.wrapper}>
              { hasLabel &&
                <Text textColor={colors.supportTextColor} size='xsmall'>{label}</Text>
              }
              { hasContent &&
                <Text textColor={colors.supportTextColor} size='small' weight='bold'>{content}</Text>
              }
            </View>
          </View>
        </View>
      }
    </View>
  );
}

SupportIcon.defaultProps = {
  label: '',
  content: '',
  borderColor: '',
};

SupportIcon.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
  borderColor: PropTypes.oneOf(['', ...commonColors]),
};
