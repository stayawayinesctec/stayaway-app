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
import { StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';
import Icon from '@app/common/components/Icon';

import { sizes, iconSizes } from '@app/common/theme';

const styles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.settingsAltButtonBackgroundColor,
    paddingLeft: sizes.size16,
    paddingRight: sizes.size16,
    paddingVertical: sizes.size18,
    borderTopWidth: sizes.size1,
    borderColor: colors.settingsBorderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topItem: {
    borderTopLeftRadius: sizes.size8,
    borderTopRightRadius: sizes.size8,
    borderTopWidth: 0,
  },
  bottomItem: {
    borderBottomLeftRadius: sizes.size8,
    borderBottomRightRadius: sizes.size8,
  },
});

function renderListItem(title, icon) {
  return (
    <>
      <Text weight='bold'>{title}</Text>
      { icon }
    </>
  );
}

export default function ListItem(props) {
  const {
    title,
    icon,
    style,
    isTopItem,
    isBottomItem,
    onPress,
    renderItem = renderListItem,
    ...otherProps
  } = props;
  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors), [name]);

  return (
    <ButtonWrapper
      onPress={onPress}
      style={{
        ...memoizedStyle.container,
        ...(isTopItem ? memoizedStyle.topItem: {}),
        ...(isBottomItem ? memoizedStyle.bottomItem: {}),
        ...style,
      }}
      {...otherProps}
    >
      { renderItem(title, icon)}
    </ButtonWrapper>
  );
}

ListItem.defaultProps = {
  id: 0,
  title: '',
  icon: <Icon name='chevron_right' width={iconSizes.size7} height={iconSizes.size12} />,
  disabled: false,
  isTopItem: false,
  isBottomItem: false,
  style: {},
  onPress: () => {},
  renderItem: undefined,
};

ListItem.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  icon: PropTypes.element,
  disabled: PropTypes.bool,
  isTopItem: PropTypes.bool,
  isBottomItem: PropTypes.bool,
  style: ViewPropTypes.style,
  onPress: PropTypes.func,
  renderItem: PropTypes.func,
};
