/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { combineReducers } from 'redux';

import { reducer as startupReducer } from '@app/redux/startup';
import { reducer as onboardingReducer } from '@app/redux/onboarding';
import { reducer as accountReducer } from '@app/redux/account';
import { reducer as modalsReducer } from '@app/redux/modals';

import rootSaga from '@app/sagas';
import configStore from './configStore';

const appReducer = combineReducers({
  startup: startupReducer,
  account: accountReducer,
  onboarding: onboardingReducer,
  modals: modalsReducer,
});

export default () => {
  const configuredStore = configStore(appReducer, rootSaga);
  const { store, sagaMiddleware } = configuredStore;
  let { sagasManager } = configuredStore;

  /* eslint-disable global-require */
  /* eslint-disable import/no-self-import */
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').rootReducer;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('@app/sagas').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }
  /* eslint-enable global-require */
  /* eslint-enable import/no-self-import */

  return store;
};
