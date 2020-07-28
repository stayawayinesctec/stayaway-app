/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { createStore, applyMiddleware } from 'redux';
import navigationDebouncer from 'react-navigation-redux-debouncer';
import createSagaMiddleware from 'redux-saga';

export default (rootReducer, rootSaga) => {
    const middleware = [];

    // Debounce navigation
    const navigationDebounceMiddleware = navigationDebouncer();
    middleware.push(navigationDebounceMiddleware);

    // Saga
    const sagaMiddleware = createSagaMiddleware();
    middleware.push(sagaMiddleware);

    const store = createStore(
      rootReducer,
      applyMiddleware(...middleware),
    );

    // Run root saga
    const sagasManager = sagaMiddleware.run(rootSaga);

    return {
      store,
      sagasManager,
      sagaMiddleware,
    };
  };
