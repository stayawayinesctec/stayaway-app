import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import i18n from '@app/services/i18n';

import Onboarding from '@onboarding/components/Onboarding';

describe('Onboarding Screen', () => {
  describe('Onboarding Screen renders correctly', () => {
    it('When on First Screen', () => {

      const { queryByText } = render(
        <Onboarding />,
      );

      const firstScreenTitle = queryByText(i18n.translate('screens.onboarding.first.title'));

      expect(firstScreenTitle).toBeTruthy();
    });
    it('When on Second Screen', () => {

      const { queryByText } = render(
        <Onboarding />,
      );

      const secondScreenTitle = queryByText(i18n.translate('screens.onboarding.second.title'));
      const secondScreenDescription = queryByText(i18n.translate('screens.onboarding.second.description'));

      expect(secondScreenTitle).toBeTruthy();
      expect(secondScreenDescription).toBeTruthy();
    });
    it('When on Third Screen', () => {

      const { queryByText } = render(
        <Onboarding />,
      );

      const thirdScreenTitle = queryByText(i18n.translate('screens.onboarding.third.title'));
      const thirdScreenDescription = queryByText(i18n.translate('screens.onboarding.third.description'));

      expect(thirdScreenTitle).toBeTruthy();
      expect(thirdScreenDescription).toBeTruthy();
    });
    it('When on Fourth Screen', () => {

      const { queryByText } = render(
        <Onboarding />,
      );

      const fourthScreenTitle = queryByText(i18n.translate('screens.onboarding.fourth.title'));
      const fourthScreenDescription = queryByText(i18n.translate('screens.onboarding.fourth.description'));

      expect(fourthScreenTitle).toBeTruthy();
      expect(fourthScreenDescription).toBeTruthy();
    });
    describe('When on Informed Consent', () => {
      it('When is not loading', () => {
        const { queryByText, queryByA11yLabel } = render(
          <Onboarding />,
        );

        const informedConsentDescriptionTitle = queryByText(i18n.translate('screens.onboarding.informed_consent.title'));
        const informedConsentDescriptionFirst = queryByText(i18n.translate('screens.onboarding.informed_consent.description.first'));
        const informedConsentDescriptionSecond = queryByText(i18n.translate('screens.onboarding.informed_consent.description.second'));
        const informedConsentDescriptionThird = queryByText(i18n.translate('screens.onboarding.informed_consent.description.third'));
        const informedConsentDescriptionFourth = queryByText(i18n.translate('screens.onboarding.informed_consent.description.fourth'));
        const informedConsentReadAndUnderstoodFirst = queryByText(i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.first'));
        const informedConsentReadAndUnderstoodSecond = queryByText(i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.second'));
        const informedConsentReadAndUnderstoodThird = queryByText(i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.third'));
        const informedConsentReadAndUnderstoodFourth = queryByText(i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.fourth'));
        const informedConsentDataTreatment = queryByText(i18n.translate('screens.onboarding.informed_consent.consents.data_treatment'));

        const informedConsentReadAndUnderstoodButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.first') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.second') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.third') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.fourth'));
        const informedConsentDataTreatmentButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.consents.data_treatment'));
        const informedConsentAcceptButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.actions.accept.accessibility.label'));

        expect(informedConsentDescriptionTitle).toBeTruthy();
        expect(informedConsentDescriptionFirst).toBeTruthy();
        expect(informedConsentDescriptionSecond).toBeTruthy();
        expect(informedConsentDescriptionThird).toBeTruthy();
        expect(informedConsentDescriptionFourth).toBeTruthy();
        expect(informedConsentReadAndUnderstoodFirst).toBeTruthy();
        expect(informedConsentReadAndUnderstoodSecond).toBeTruthy();
        expect(informedConsentReadAndUnderstoodThird).toBeTruthy();
        expect(informedConsentReadAndUnderstoodFourth).toBeTruthy();
        expect(informedConsentDataTreatment).toBeTruthy();
        expect(informedConsentReadAndUnderstoodButton).toBeTruthy();
        expect(informedConsentDataTreatmentButton).toBeTruthy();
        expect(informedConsentAcceptButton).toBeTruthy();

        expect(informedConsentReadAndUnderstoodButton).toBeEnabled();
        expect(informedConsentDataTreatmentButton).toBeEnabled();
        expect(informedConsentAcceptButton).toBeDisabled();
      });
      it('When is loading', () => {
        const { queryByA11yLabel } = render(
          <Onboarding loading />,
        );

        const informedConsentReadAndUnderstoodButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.first') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.second') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.third') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.fourth'));
        const informedConsentDataTreatmentButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.consents.data_treatment'));

        expect(informedConsentReadAndUnderstoodButton).toBeDisabled();
        expect(informedConsentDataTreatmentButton).toBeDisabled();
      });
    });
  });
  describe('Onboarding Screen buttons interaction work', () => {
    it('When press Informed Screen check boxs', () => {
      const { queryByA11yLabel } = render(
        <Onboarding />,
      );

      const informedConsentReadAndUnderstoodButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.first') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.second') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.third') + i18n.translate('screens.onboarding.informed_consent.consents.read_and_understood.fourth'));
      const informedConsentDataTreatmentButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.consents.data_treatment'));
      const informedConsentAcceptButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.actions.accept.accessibility.label'));

      expect(informedConsentReadAndUnderstoodButton).toBeTruthy();
      expect(informedConsentDataTreatmentButton).toBeTruthy();

      expect(informedConsentAcceptButton).toBeDisabled();

      fireEvent.press(informedConsentReadAndUnderstoodButton);
      fireEvent.press(informedConsentDataTreatmentButton);

      expect(informedConsentAcceptButton).toBeEnabled();
    });
    it('When press Informed Screen accept button', () => {
      const onPress = jest.fn();

      const { queryByA11yLabel } = render(
        <Onboarding
          onPress={onPress}
        />,
      );

      const informedConsentAcceptButton = queryByA11yLabel(i18n.translate('screens.onboarding.informed_consent.actions.accept.accessibility.label'));

      expect(informedConsentAcceptButton).toBeTruthy();
      expect(informedConsentAcceptButton).toBeDisabled();

      fireEvent.press(informedConsentAcceptButton);
      expect(onPress.mock.calls.length).toBe(1);
    });
  });
});
