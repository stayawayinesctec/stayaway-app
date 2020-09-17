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
      expect(onClose).toHaveBeenCalled();
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
      expect(onPressTracking).toHaveBeenCalled();
    });
    it('When press how to use button.', () => {
      const onPressHowToUse = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          trackingEnabled
          onPressHowToUse={onPressHowToUse}
        />,
      );

      const howToUseButton = queryByA11yLabel(i18n.translate('screens.settings.how_to_use.accessibility.label'));

      expect(howToUseButton).toBeTruthy();
      fireEvent.press(howToUseButton);
      expect(onPressHowToUse).toHaveBeenCalled();
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
      expect(onPressFaqs).toHaveBeenCalled();
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
      expect(onPressTermsOfUse).toHaveBeenCalled();
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
      expect(onPressPrivacyPolicy).toHaveBeenCalled();
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
      expect(onPressTechnicalSheet).toHaveBeenCalled();
    });
  });
});
