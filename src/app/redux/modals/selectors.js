/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { createSelector } from 'reselect';

export const isNetworkModalOpen = createSelector(
  state => state.modals,
  modals => modals.network,
);

export const isServerErrorModalOpen = createSelector(
  state => state.modals,
  modals => modals.server_error,
);

export const isTooMuchRequestsModalOpen = createSelector(
  state => state.modals,
  modals => modals.too_much_requests,
);

export const isInvalidCodeModalOpen = createSelector(
  state => state.modals,
  modals => modals.invalid_code,
);

export const isExpiredCodeModalOpen = createSelector(
  state => state.modals,
  modals => modals.expired_code,
);

export const isLoadingModalOpen = createSelector(
  state => state.modals,
  modals => modals.loading,
);

export const isProtectorModalOpen = createSelector(
  state => state.modals,
  modals => modals.protector,
);

export default {
  isNetworkModalOpen,
  isServerErrorModalOpen,
  isTooMuchRequestsModalOpen,
  isInvalidCodeModalOpen,
  isExpiredCodeModalOpen,
  isLoadingModalOpen,
  isProtectorModalOpen,
};
