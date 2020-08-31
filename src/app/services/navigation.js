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
import { StackActions, CommonActions } from '@react-navigation/native';

let navigationRef = React.createRef();

function setNavigationRef(ref) {
  navigationRef = ref;
}

function getNavigationRef() {
  return navigationRef;
}

function navigate(...args) {
  if (navigationRef.current) {
    requestAnimationFrame(() => {
      navigationRef.current.navigate(...args);
    });
  }
}

function push(...args) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.push(...args));
  }
}

function pop(...args) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.pop(...args));
  }
}

function reset(...args) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.reset(...args));
  }
}

function popToTop(...args) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.popToTop(...args));
  }
}

function goBack(...args) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(CommonActions.goBack(...args));
  }
}

export default {
  getNavigationRef,
  setNavigationRef,
  navigate,
  push,
  pop,
  reset,
  popToTop,
  goBack,
};
