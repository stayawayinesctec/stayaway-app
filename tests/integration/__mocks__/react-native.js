/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

export const Platform = {
  OS: 'android',
  isTesting: true,
  select: (specifics) => specifics.android,
};

export const Linking = {
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
};

export const I18nManager = {
  forceRTL: jest.fn(),
};

export const Alert = {
  alert: jest.fn(),
};

export const NativeModules = {
  NativeEventEmitter () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  },
};
