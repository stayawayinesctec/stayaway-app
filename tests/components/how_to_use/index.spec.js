import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import i18n from '@app/services/i18n';

import HowToUse from '@settings/components/Operation';

describe('HowToUse Screen', () => {
  describe('HowToUse Screen renders correctly', () => {
    it('When on First Screen', () => {
      const { queryByText, queryByA11yLabel } = render(
        <HowToUse />,
      );

      const firstScreenTitle = queryByText(i18n.translate('screens.onboarding.first.title'));
      const closeButton = queryByA11yLabel(i18n.translate('screens.operation.actions.go_back.accessibility.hint.label'));

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
      const okButton = queryByA11yLabel(i18n.translate('screens.operation.actions.ok.accessibility.hint.label'));

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

      const closeButton = queryByA11yLabel(i18n.translate('screens.operation.actions.go_back.accessibility.hint.label'));

      expect(closeButton).toBeTruthy();

      fireEvent.press(closeButton);
      expect(onClose.mock.calls.length).toBe(1);
    });
    it('When press HowToUse ok button', () => {
      const onPress = jest.fn();

      const { queryByA11yLabel } = render(
        <HowToUse
          onPress={onPress}
        />,
      );

      const okButton = queryByA11yLabel(i18n.translate('screens.operation.actions.ok.accessibility.hint.label'));

      expect(okButton).toBeTruthy();

      fireEvent.press(okButton);
      expect(onPress.mock.calls.length).toBe(1);
    });
  });
});
