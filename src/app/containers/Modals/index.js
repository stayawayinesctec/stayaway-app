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
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';

import NetworkModal from '@app/components/NetworkModal';
import ServerErrorModal from '@app/components/ServerErrorModal';
import TooMuchRequestsModal from '@app/components/TooMuchRequestsModal';
import InvalidCodeModal from '@app/components/InvalidCodeModal';
import ExpiredCodeModal from '@app/components/ExpiredCodeModal';
import LoadingModal from '@app/components/LoadingModal';
import ProtectorModal from '@app/components/ProtectorModal';

import modalsActions from '@app/redux/modals';
import {
  isNetworkModalOpen,
  isServerErrorModalOpen,
  isTooMuchRequestsModalOpen,
  isInvalidCodeModalOpen,
  isExpiredCodeModalOpen,
  isLoadingModalOpen,
  isProtectorModalOpen,
} from '@app/redux/modals/selectors';

export default function Modals () {
  const dispatch = useDispatch();

  const network = {
    visible: useSelector(isNetworkModalOpen),
    onClose: () => dispatch(modalsActions.closeNetworkModal()),
    onBackButtonPress: () => dispatch(modalsActions.closeNetworkModal()),
    onModalShow: () => dispatch(modalsActions.networkModalOpen()),
    onModalHide: () => dispatch(modalsActions.networkModalClosed()),
  };

  const server = {
    visible: useSelector(isServerErrorModalOpen),
    onClose: () => dispatch(modalsActions.closeServerErrorModal()),
    onBackButtonPress: () => dispatch(modalsActions.closeServerErrorModal()),
    onModalShow: () => dispatch(modalsActions.serverErrorModalOpen()),
    onModalHide: () => dispatch(modalsActions.serverErrorModalClosed()),
  };

  const requests = {
    visible: useSelector(isTooMuchRequestsModalOpen),
    onClose: () => dispatch(modalsActions.closeTooMuchRequestsModal()),
    onBackButtonPress: () => dispatch(modalsActions.setTooMuchRequestsModal()),
    onModalShow: () => dispatch(modalsActions.tooMuchRequestsModalOpen()),
    onModalHide: () => dispatch(modalsActions.tooMuchRequestsModalClosed()),
  };

  const invalidCode = {
    visible: useSelector(isInvalidCodeModalOpen),
    onClose: () => dispatch(modalsActions.closeInvalidCodeModal()),
    onBackButtonPress: () => dispatch(modalsActions.closeInvalidCodeModal()),
    onModalShow: () => dispatch(modalsActions.invalidCodeModalOpen()),
    onModalHide: () => dispatch(modalsActions.invalidCodeModalClosed()),
  };

  const expiredCode = {
    visible: useSelector(isExpiredCodeModalOpen),
    onClose: () => dispatch(modalsActions.closeExpiredCodeModal()),
    onBackButtonPress: () => dispatch(modalsActions.closeExpiredCodeModal()),
    onModalShow: () => dispatch(modalsActions.expiredCodeModalOpen()),
    onModalHide: () => dispatch(modalsActions.expiredCodeModalClosed()),
  };

  const loading = {
    visible: useSelector(isLoadingModalOpen),
    onClose: () => {},
    onBackButtonPress: () => {},
    onModalShow: () => dispatch(modalsActions.loadingModalOpen()),
    onModalHide: () => dispatch(modalsActions.loadingModalClosed()),
  };

  const protector = {
    visible: useSelector(isProtectorModalOpen),
    onClose: () => {},
    onBackButtonPress: () => {},
    onModalShow: () => dispatch(modalsActions.protectorModalOpen()),
    onModalHide: () => dispatch(modalsActions.protectorModalClosed()),
  };

  return (
    <View>
      <NetworkModal {...network} />
      <ServerErrorModal {...server} />
      <TooMuchRequestsModal {...requests} />
      <InvalidCodeModal {...invalidCode} />
      <ExpiredCodeModal {...expiredCode} />
      <LoadingModal {...loading} />
      <ProtectorModal {...protector} />
    </View>
  );
}
