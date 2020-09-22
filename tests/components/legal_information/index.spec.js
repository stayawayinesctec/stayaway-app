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

import LegalInformation from '@settings/components/LegalInformation';

describe('Legal Information Screen', () => {
  describe('Legal Information correctly', () => {
    it('When infection status is infected.', () => {
      const { queryByA11yLabel } = render(
        <LegalInformation />,
      );

      const termsOfUseButton = queryByA11yLabel(i18n.translate('screens.legal_information.terms_of_use.accessibility.label'));
      const privacyPolicyButton = queryByA11yLabel(i18n.translate('screens.legal_information.privacy_policy.accessibility.label'));
      const technicalSheetButton = queryByA11yLabel(i18n.translate('screens.legal_information.technical_sheet.accessibility.label'));

      console.log(i18n.translate('screens.legal_information.terms_of_use.accessibility.label'));

      expect(termsOfUseButton).toBeTruthy();
      expect(privacyPolicyButton).toBeTruthy();
      expect(technicalSheetButton).toBeTruthy();
    });
  });
  describe('Legal Information buttons interaction work', () => {
    it('When press close button.', () => {
      const onClose = jest.fn();
      const { queryByA11yLabel } = render(
        <LegalInformation
          onClose={onClose}
        />,
      );

      const closeButton = queryByA11yLabel(i18n.translate('screens.legal_information.actions.back.accessibility.label'));

      expect(closeButton).toBeTruthy();
      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
    it('When press terms of use button.', () => {
      const onPressTermsOfUse = jest.fn();
      const { queryByA11yLabel } = render(
        <LegalInformation
          onPressTermsOfUse={onPressTermsOfUse}
        />,
      );

      const termsButton = queryByA11yLabel(i18n.translate('screens.legal_information.terms_of_use.accessibility.label'));

      expect(termsButton).toBeTruthy();
      fireEvent.press(termsButton);
      expect(onPressTermsOfUse).toHaveBeenCalled();
    });
    it('When press privacy policy button.', () => {
      const onPressPrivacyPolicy = jest.fn();
      const { queryByA11yLabel } = render(
        <LegalInformation
          onPressPrivacyPolicy={onPressPrivacyPolicy}
        />,
      );

      const privacyPolicyButton = queryByA11yLabel(i18n.translate('screens.legal_information.privacy_policy.accessibility.label'));

      expect(privacyPolicyButton).toBeTruthy();
      fireEvent.press(privacyPolicyButton);
      expect(onPressPrivacyPolicy).toHaveBeenCalled();
    });
    it('When press technical sheet button.', () => {
      const onPressTechnicalSheet = jest.fn();
      const { queryByA11yLabel } = render(
        <LegalInformation
          onPressTechnicalSheet={onPressTechnicalSheet}
        />,
      );

      const technicalSheetButton = queryByA11yLabel(i18n.translate('screens.legal_information.technical_sheet.accessibility.label'));

      expect(technicalSheetButton).toBeTruthy();
      fireEvent.press(technicalSheetButton);
      expect(onPressTechnicalSheet).toHaveBeenCalled();
    });
  });
});
