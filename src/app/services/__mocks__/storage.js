/**
  * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
  *
  * This Source Code Form is subject to the terms of the European Union
  * Public License, v. 1.2. If a copy of the EUPL was not distributed with
  * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
  *
  * SPDX-License-Identifier: EUPL-1.2
  */

 export default {
  getItem: jest.fn(),
  hasItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
  isEmpty: jest.fn(),
  clearStorage: jest.fn(),
  findItems: jest.fn(),
};
