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

import HowToUse from '@settings/components/HowToUse';

describe('HowToUse Screen', () => {
  describe('HowToUse Screen renders correctly', () => {
    it('When on First Screen', () => {
      const { queryByText, queryByA11yLabel } = render(
        <HowToUse />,
      );

      const firstScreenTitle = queryByText(i18n.translate('screens.onboarding.first.title'));
      const closeButton = queryByA11yLabel(i18n.translate('screens.how_to_use.actions.back.accessibility.hint.label'));

      expect(firstScreenTitle).toBeTruthy();
      expect(closeButton).toBeTruthy();
    });
    it('When on Second Screen', () => {

      const { queryByText } = render(
        <HowToUse />,
      );

      const secondScreenTitle = queryByText(i18n.translate('screens.onboarding.second.title'));
      const secondScreenDescription = queryByText(i18n.translate('screens.onboarding.second.description'));

      expect(secondScreenTitle).toBeTruthy();
      expect(secondScreenDescription).toBeTruthy();
    });
    it('When on Third Screen', () => {

      const { queryByText } = render(
        <HowToUse />,
      );

      const thirdScreenTitle = queryByText(i18n.translate('screens.onboarding.third.title'));
      const thirdScreenDescription = queryByText(i18n.translate('screens.onboarding.third.description'));

      expect(thirdScreenTitle).toBeTruthy();
      expect(thirdScreenDescription).toBeTruthy();
    });
    it('When on Fourth Screen', () => {

      const { queryByA11yLabel, queryByText } = render(
        <HowToUse />,
      );

      const fourthScreenTitle = queryByText(i18n.translate('screens.onboarding.fourth.title'));
      const fourthScreenDescription = queryByText(i18n.translate('screens.onboarding.fourth.description'));
      const okButton = queryByA11yLabel(i18n.translate('screens.how_to_use.actions.ok.accessibility.hint.label'));

      expect(fourthScreenTitle).toBeTruthy();
      expect(fourthScreenDescription).toBeTruthy();
      expect(okButton).toBeTruthy();
    });
  });
  describe('HowToUse Screen buttons interaction work', () => {
    it('When press close button', () => {
      const onClose = jest.fn();

      const { queryByA11yLabel } = render(
        <HowToUse
          onClose={onClose}
        />,
      );

      const closeButton = queryByA11yLabel(i18n.translate('screens.how_to_use.actions.back.accessibility.hint.label'));

      expect(closeButton).toBeTruthy();

      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
    it('When press HowToUse ok button', () => {
      const onPress = jest.fn();

      const { queryByA11yLabel } = render(
        <HowToUse
          onPress={onPress}
        />,
      );

      const okButton = queryByA11yLabel(i18n.translate('screens.how_to_use.actions.ok.accessibility.hint.label'));

      expect(okButton).toBeTruthy();

      fireEvent.press(okButton);
      expect(onPress).toHaveBeenCalled();
    });
  });
});
