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
import {
  Platform,
  Text,
} from "react-native";

// utils.js
// One Plus Fix for Oxygen OS and its painful Slate font truncating on bold text
// https://github.com/facebook/react-native/issues/15114
export default () => {
  if (Platform.OS !== 'android') {
    // return
    const oldRender = Text.render;
    // eslint-disable-next-line func-names
    Text.render = function (...args) {
      const origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [{fontFamily: 'Roboto'}, origin.props.style],
      });
    };
  }
  const oldRender = Text.render;

  // eslint-disable-next-line func-names
  Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    const defaultIndex = 0;
    let useIndex = defaultIndex;
    const settings = [
      // we use this empty object for when there is no weight specified
      {},
      {
        fontFamily: 'sans-serif-thin',
        fontWeight: 'normal',
      }, {
        fontFamily: 'sans-serif-light',
        fontWeight: 'normal',
      }, {
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
      }, {
        fontFamily: 'sans-serif-medium',
        fontWeight: 'normal',
      }, {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
      }, {
        fontFamily: 'sans-serif-medium',
        fontWeight: 'bold',
      },
    ];

    if (typeof origin.props.style !== 'undefined' && typeof origin.props.style.fontWeight !== 'undefined') {
      const { fontWeight } = origin.props.style;

      if (fontWeight === '100' || fontWeight === '200' ) {
        useIndex = 1;
      } else if (fontWeight === '300' || fontWeight === '400') {
        useIndex = 2;
      } else if (fontWeight === '500' || fontWeight === 'normal') {
        useIndex = 3;
      } else if (fontWeight === '600') {
        useIndex = 4;
      } else if (fontWeight === '700' || fontWeight === 'bold') {
        useIndex = 5;
      } else if (fontWeight === '800' || fontWeight === '900') {
        useIndex = 6;
      }
    }
    return React.cloneElement(origin, {
      style: [settings[defaultIndex], Platform.OS === 'android' ? { fontFamily: 'Roboto' } : {}, origin.props.style, settings[useIndex]],
    });
  };
};
