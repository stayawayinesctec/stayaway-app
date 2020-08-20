import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import i18n from '@app/services/i18n';

import Info from '@settings/components/Info';

describe('Info Screen', () => {
  describe('Info renders correctly', () => {
    it('When infection status is infected.', () => {
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          isInfected
        />,
      );

      const trackingButton = queryByA11yLabel(i18n.translate('screens.settings.tracking.accessibility.label'));

      expect(trackingButton).toBeTruthy();

      expect(trackingButton).toBeDisabled();
    });
    it('When infection status is not infected.', () => {
      const { queryByA11yLabel } = render(
        <Info trackingEnabled />,
      );

      const trackingButton = queryByA11yLabel(i18n.translate('screens.settings.tracking.accessibility.label'));

      expect(trackingButton).toBeTruthy();

      expect(trackingButton).toBeEnabled();
    });
    it('When tracking is enabled.', () => {
      const { queryByText } = render(
        <Info trackingEnabled />,
      );

      const trackingText = queryByText(i18n.translate('common.words.enabled'));

      expect(trackingText).toBeTruthy();
    });
    it('When tracking is disabeld.', () => {
      const { queryByText } = render(
        <Info />,
      );

      const trackingText = queryByText(i18n.translate('common.words.disabled'));

      expect(trackingText).toBeTruthy();
    });
  });
  describe('Info buttons interaction work', () => {
    it('When press close button.', () => {
      const onClose = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          onClose={onClose}
        />,
      );

      const closeButton = queryByA11yLabel(i18n.translate('screens.settings.actions.back.accessibility.label'));

      expect(closeButton).toBeTruthy();
      fireEvent.press(closeButton);
      expect(onClose.mock.calls.length).toBe(1);
    });
    it('When press tracking button.', () => {
      const onPressTracking = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          onPressTracking={onPressTracking}
        />,
      );

      const trackingButton = queryByA11yLabel(i18n.translate('screens.settings.tracking.accessibility.label'));

      expect(trackingButton).toBeTruthy();
      fireEvent.press(trackingButton);
      expect(onPressTracking.mock.calls.length).toBe(1);
    });
    it('When press instructions button.', () => {
      const onPressInstructions = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          onPressInstructions={onPressInstructions}
        />,
      );

      const instructionsButton = queryByA11yLabel(i18n.translate('screens.settings.instructions.accessibility.label'));

      expect(instructionsButton).toBeTruthy();
      fireEvent.press(instructionsButton);
      expect(onPressInstructions.mock.calls.length).toBe(1);
    });
    it('When press faqs button.', () => {
      const onPressFaqs = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          onPressFaqs={onPressFaqs}
        />,
      );

      const faqsButton = queryByA11yLabel(i18n.translate('screens.settings.faqs.accessibility.label'));

      expect(faqsButton).toBeTruthy();
      fireEvent.press(faqsButton);
      expect(onPressFaqs.mock.calls.length).toBe(1);
    });
    it('When press terms of use button.', () => {
      const onPressTermsOfUse = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          onPressTermsOfUse={onPressTermsOfUse}
        />,
      );

      const termsButton = queryByA11yLabel(i18n.translate('screens.settings.terms_of_use.accessibility.label'));

      expect(termsButton).toBeTruthy();
      fireEvent.press(termsButton);
      expect(onPressTermsOfUse.mock.calls.length).toBe(1);
    });
    it('When press privacy policy button.', () => {
      const onPressPrivacyPolicy = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          onPressPrivacyPolicy={onPressPrivacyPolicy}
        />,
      );

      const privacyPolicyButton = queryByA11yLabel(i18n.translate('screens.settings.privacy_policy.accessibility.label'));

      expect(privacyPolicyButton).toBeTruthy();
      fireEvent.press(privacyPolicyButton);
      expect(onPressPrivacyPolicy.mock.calls.length).toBe(1);
    });
    it('When press technical sheet button.', () => {
      const onPressTechnicalSheet = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          onPressTechnicalSheet={onPressTechnicalSheet}
        />,
      );

      const technicalSheetButton = queryByA11yLabel(i18n.translate('screens.settings.technical_sheet.accessibility.label'));

      expect(technicalSheetButton).toBeTruthy();
      fireEvent.press(technicalSheetButton);
      expect(onPressTechnicalSheet.mock.calls.length).toBe(1);
    });
  });
});
