import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import i18n from '@app/services/i18n';

import Tracking from '@settings/components/Tracking';

describe('Tracking Screen', () => {
  describe('Tracking renders correctly', () => {
    it('When tracking is enabled.', () => {
      const { queryByA11yLabel, queryByText } = render(
        <Tracking trackingEnabled />,
      );

      const trackingSwitch = queryByA11yLabel(i18n.translate('screens.tracking.switch.accessibility.label'));
      const warningText = queryByText(i18n.translate('screens.tracking.switch.legend'));

      expect(trackingSwitch).toBeTruthy();
      expect(warningText).toBeTruthy();

      expect(trackingSwitch.props.accessibilityState.checked).toBe(true);
    });
    it('When tracking is disabled.', () => {
      const { queryByA11yLabel, queryByText } = render(
        <Tracking />,
      );

      const trackingSwitch = queryByA11yLabel(i18n.translate('screens.tracking.switch.accessibility.label'));
      const warningText = queryByText(i18n.translate('screens.tracking.switch.legend'));

      expect(trackingSwitch).toBeTruthy();
      expect(warningText).toBeNull();

      expect(trackingSwitch.props.accessibilityState.checked).toBe(false);
    });
  });
  describe('Info buttons interaction work', () => {
    it('When press close button.', () => {
      const onClose = jest.fn();
      const { queryByA11yLabel } = render(
        <Tracking onClose={onClose} />,
      );

      const closeButton = queryByA11yLabel(i18n.translate('screens.tracking.actions.go_back.accessibility.hint.label'));

      expect(closeButton).toBeTruthy();
      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
    it('When press tracking button.', () => {
      const onPress = jest.fn();
      const { queryByA11yRole } = render(
        <Tracking onPress={onPress} />,
      );

      const trackingButton = queryByA11yRole('switch');

      expect(trackingButton).toBeTruthy();
      fireEvent.press(trackingButton);
      expect(onPress).toHaveBeenCalled();
    });
    it('When press tracking switch.', () => {
      const onPress = jest.fn();
      const { queryByA11yLabel } = render(
        <Tracking onPress={onPress} />,
      );

      const trackingSwitch = queryByA11yLabel(i18n.translate('screens.tracking.switch.accessibility.label'));

      expect(trackingSwitch).toBeTruthy();
      fireEvent.press(trackingSwitch);
      expect(onPress).toHaveBeenCalled();
    });
  });
});
