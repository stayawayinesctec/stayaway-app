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
import { Platform } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import i18n from '@app/services/i18n';

import Onboarding from '@onboarding/components/Onboarding';

describe('Onboarding Screen', () => {
  describe('Onboarding Screen renders correctly', () => {
    it('When on First Screen', () => {

      const { queryByText } = render(
        <Onboarding />,
      );

      const firstScreenTitle = queryByText(i18n.translate('screens.onboarding.first.title', { formatted: false }));

      expect(firstScreenTitle).toBeTruthy();
    });
    it('When on Second Screen', () => {

      const { queryByText } = render(
        <Onboarding />,
      );

      const secondScreenTitle = queryByText(i18n.translate('screens.onboarding.second.title'));
      const secondScreenDescription = queryByText(i18n.translate('screens.onboarding.second.description', { formatted: false }));

      expect(secondScreenTitle).toBeTruthy();
      expect(secondScreenDescription).toBeTruthy();
    });
    it('When on Third Screen', () => {

      const { queryByText } = render(
        <Onboarding />,
      );

      const thirdScreenTitle = queryByText(i18n.translate('screens.onboarding.third.title'));
      const thirdScreenDescription = queryByText(i18n.translate('screens.onboarding.third.description', { formatted: false }));

      expect(thirdScreenTitle).toBeTruthy();
      expect(thirdScreenDescription).toBeTruthy();
    });
    it('When on Fourth Screen', () => {

      const { queryByText } = render(
        <Onboarding />,
      );

      const fourthScreenTitle = queryByText(i18n.translate('screens.onboarding.fourth.title'));
      const fourthScreenDescription = queryByText(i18n.translate('screens.onboarding.fourth.description', { formatted: false }));

      expect(fourthScreenTitle).toBeTruthy();
      expect(fourthScreenDescription).toBeTruthy();
    });
    describe('When on Fifth Screen', () => {
      it('When not on a device that supports location less scanning', () => {
        const { queryByText } = render(
          <Onboarding />,
        );

        const fifthScreenTitle = queryByText(i18n.translate('screens.onboarding.fifth.title'));
        const fifthScreenDescription = queryByText(i18n.translate('screens.onboarding.fifth.description', { formatted: false }));

        expect(fifthScreenTitle).toBeNull();
        expect(fifthScreenDescription).toBeNull();
      });
      it('When on a device that supports location less scanning', () => {
        const { queryByText } = render(
          <Onboarding shouldShowLocationScreen />,
        );

        const fifthScreenTitle = queryByText(i18n.translate('screens.onboarding.fifth.title'));
        const fifthScreenDescription = queryByText(i18n.translate('screens.onboarding.fifth.description', { formatted: false }));

        expect(fifthScreenTitle).toBeTruthy();
        expect(fifthScreenDescription).toBeTruthy();
      });
    });
    describe('When on Consent', () => {
      it('When is not loading', () => {
        const { queryByText, queryByA11yLabel } = render(
          <Onboarding />,
        );

        const consentDescriptionTitle = queryByText(i18n.translate('screens.onboarding.consent.title'));
        const consentDescription = queryByText(i18n.translate('screens.onboarding.consent.description', { formatted: false }));
        const consentReadAndUnderstood = queryByText(i18n.translate('screens.onboarding.consent.consents.read_and_understood', { formatted: false }));
        const consentDataTreatment = queryByText(i18n.translate('screens.onboarding.consent.consents.data_treatment'));

        const consentReadAndUnderstoodButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.consents.read_and_understood', { formatted: false }));
        const consentDataTreatmentButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.consents.data_treatment'));
        const consentAcceptButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.actions.accept.accessibility.label'));

        expect(consentDescriptionTitle).toBeTruthy();
        expect(consentDescription).toBeTruthy();
        expect(consentReadAndUnderstood).toBeTruthy();
        expect(consentDataTreatment).toBeTruthy();
        expect(consentReadAndUnderstoodButton).toBeTruthy();
        expect(consentDataTreatmentButton).toBeTruthy();
        expect(consentAcceptButton).toBeTruthy();

        expect(consentReadAndUnderstoodButton).toBeEnabled();
        expect(consentDataTreatmentButton).toBeEnabled();
        expect(consentAcceptButton).toBeDisabled();
      });
      it('When is loading', () => {
        const { queryByA11yLabel } = render(
          <Onboarding loading />,
        );

        const consentReadAndUnderstoodButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.consents.read_and_understood', { formatted: false }));
        const consentDataTreatmentButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.consents.data_treatment'));

        expect(consentReadAndUnderstoodButton).toBeDisabled();
        expect(consentDataTreatmentButton).toBeDisabled();
      });
    });
  });
  describe('Onboarding Screen buttons interaction work', () => {
    it('When press Informed Screen check boxs', () => {
      const { queryByA11yLabel } = render(
        <Onboarding />,
      );

      const consentReadAndUnderstoodButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.consents.read_and_understood', { formatted: false }));
      const consentDataTreatmentButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.consents.data_treatment'));
      const consentAcceptButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.actions.accept.accessibility.label'));

      expect(consentReadAndUnderstoodButton).toBeTruthy();
      expect(consentDataTreatmentButton).toBeTruthy();

      expect(consentAcceptButton).toBeDisabled();

      fireEvent.press(consentReadAndUnderstoodButton);
      fireEvent.press(consentDataTreatmentButton);

      expect(consentAcceptButton).toBeEnabled();
    });
    it('When press Informed Screen accept button', () => {
      const onPress = jest.fn();

      const { queryByA11yLabel } = render(
        <Onboarding
          onPress={onPress}
        />,
      );

      const consentAcceptButton = queryByA11yLabel(i18n.translate('screens.onboarding.consent.actions.accept.accessibility.label'));

      expect(consentAcceptButton).toBeTruthy();
      expect(consentAcceptButton).toBeDisabled();

      fireEvent.press(consentAcceptButton);
      expect(onPress).toHaveBeenCalled();
    });
  });
});
