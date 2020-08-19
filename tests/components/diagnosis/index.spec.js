import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import i18n from '@app/services/i18n';
import { INFECTED_STATUS } from '@app/services/tracking';

import Diagnosis from '@main/components/Diagnosis';

describe('Diagnosis Screen', () => {
  describe('Diagnosis code input renders correctly', () => {
    it('When infection status is healthy.', () => {
      const infectionStatus = INFECTED_STATUS.HEALTHY;
      const loading = false;
      const error = '';

      const { queryByText, queryByA11yLabel, queryByPlaceholderText } = render(
        <Diagnosis
          infectionStatus={infectionStatus}
          loading={loading}
          error={error}
        />,
      );

      const title = queryByText(i18n.translate('screens.diagnosis.code_input.title'));
      const descriptionFirst = queryByText(i18n.translate('screens.diagnosis.code_input.description.first'));
      const descriptionSecond = queryByText(i18n.translate('screens.diagnosis.code_input.description.second'));
      const input = queryByPlaceholderText(i18n.translate('common.placeholders.code'));
      const submit = queryByA11yLabel(i18n.translate('screens.diagnosis.code_input.accessibility.label'));

      expect(title).toBeTruthy();
      expect(descriptionFirst).toBeTruthy();
      expect(descriptionSecond).toBeTruthy();
      expect(input).toBeTruthy();
      expect(submit).toBeTruthy();

      expect(submit).toBeDisabled();
    });
    it('When infection status is exposed.', () => {
      const infectionStatus = INFECTED_STATUS.EXPOSED;
      const loading = false;
      const error = '';

      const { queryByText, queryByA11yLabel, queryByPlaceholderText } = render(
        <Diagnosis
          infectionStatus={infectionStatus}
          loading={loading}
          error={error}
        />,
      );

      const title = queryByText(i18n.translate('screens.diagnosis.code_input.title'));
      const descriptionFirst = queryByText(i18n.translate('screens.diagnosis.code_input.description.first'));
      const descriptionSecond = queryByText(i18n.translate('screens.diagnosis.code_input.description.second'));
      const input = queryByPlaceholderText(i18n.translate('common.placeholders.code'));
      const submit = queryByA11yLabel(i18n.translate('screens.diagnosis.code_input.accessibility.label'));

      expect(title).toBeTruthy();
      expect(descriptionFirst).toBeTruthy();
      expect(descriptionSecond).toBeTruthy();
      expect(input).toBeTruthy();
      expect(submit).toBeTruthy();

      expect(submit).toBeDisabled();
    });
    it('When an diagnosis code is entered.', () => {
      const infectionStatus = INFECTED_STATUS.HEALTHY;
      const loading = false;
      const error = '';

      const { queryByA11yLabel, queryByPlaceholderText } = render(
        <Diagnosis
          infectionStatus={infectionStatus}
          loading={loading}
          error={error}
        />,
      );

      const input = queryByPlaceholderText(i18n.translate('common.placeholders.code'));
      const submit = queryByA11yLabel(i18n.translate('screens.diagnosis.code_input.accessibility.label'));

      expect(input).toBeTruthy();
      expect(submit).toBeTruthy();

      expect(submit).toBeDisabled();
      fireEvent.changeText(input, '123456789012');
      expect(submit).toBeEnabled();
    });
    it('When diagnosis code is being submitted.', () => {
      const infectionStatus = INFECTED_STATUS.HEALTHY;
      const loading = false;
      const onSubmit = jest.fn();
      const error = '';

      const { queryByA11yLabel, queryByPlaceholderText } = render(
        <Diagnosis
          infectionStatus={infectionStatus}
          loading={loading}
          error={error}
          onSubmit={onSubmit}
        />,
      );

      const input = queryByPlaceholderText(i18n.translate('common.placeholders.code'));
      const submit = queryByA11yLabel(i18n.translate('screens.diagnosis.code_input.accessibility.label'));

      expect(input).toBeTruthy();
      expect(submit).toBeTruthy();

      expect(submit).toBeDisabled();
      fireEvent.changeText(input, '123456789012');
      expect(submit).toBeEnabled();
      fireEvent.press(submit);
      expect(onSubmit.mock.calls.length).toBe(1);
      expect(onSubmit.mock.calls[0][0]).toBe('123456789012');
    });
  });
  describe('Diagnosis completed renders correctly', () => {
    it('When infection status is infected.', () => {
      const infectionStatus = INFECTED_STATUS.INFECTED;
      const loading = false;
      const error = '';

      const { queryByText, queryByA11yLabel } = render(
        <Diagnosis
          infectionStatus={infectionStatus}
          loading={loading}
          error={error}
        />,
      );

      const title = queryByText(i18n.translate('screens.diagnosis.completed.title'));
      const description = queryByText(i18n.translate('screens.diagnosis.completed.description'));
      const button = queryByA11yLabel(i18n.translate('screens.diagnosis.completed.accessibility.label'));

      expect(title).toBeTruthy();
      expect(description).toBeTruthy();
      expect(button).toBeTruthy();
    });
    it('When "Ok" button is clicked.', () => {
      const infectionStatus = INFECTED_STATUS.INFECTED;
      const loading = false;
      const onPress = jest.fn();
      const error = '';

      const { queryByA11yLabel } = render(
        <Diagnosis
          infectionStatus={infectionStatus}
          loading={loading}
          error={error}
          onPress={onPress}
        />,
      );

      const button = queryByA11yLabel(i18n.translate('screens.diagnosis.completed.accessibility.label'));

      expect(button).toBeTruthy();

      fireEvent.press(button);
      expect(onPress.mock.calls.length).toBe(1);
    });
  });
});
