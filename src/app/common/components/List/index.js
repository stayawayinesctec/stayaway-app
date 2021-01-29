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
import { View, FlatList, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import ListItem from '@app/common/components/ListItem';

const styles = StyleSheet.create({
  container: {},
});

function renderListItem(item, index, items) {
  return (
    <ListItem
      key={item.id.toString()}
      {...item}
      isTopItem={index === 0}
      isBottomItem={index === items.length - 1}
    />
  );
}

function renderFlatList(...args) {
  const [
    items,
    style,
  ] = args;

  return (
    <FlatList
      data={items}
      style={{...styles.container, ...style}}
      renderItem={({ item, index }) => renderListItem(item, index, items)}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
    />
  );
}

function renderList(...args) {
  const [
    items,
    style,
  ] = args;

  return (
    <View style={{...styles.container, ...style}}>
      {items.map((item, index) => renderListItem(item, index, items))}
    </View>
  );
}

export default function List(props) {
  const { flat, items, style } = props;

  if (flat) {
    return renderFlatList(items, style);
  }

  return renderList(items, style);
}

List.defaultProps = {
  flat: false,
  items: [],
  style: {},
};

List.propTypes = {
  flat: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    icon: PropTypes.element,
    disabled: PropTypes.bool,
    isTopItem: PropTypes.bool,
    isBottomItem: PropTypes.bool,
    style: ViewPropTypes.style,
    onPress: PropTypes.func,
    renderItem: PropTypes.func,
  })),
  style: ViewPropTypes.style,
};
