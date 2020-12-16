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
import { INFECTION_STATUS } from '@app/services/tracing';

import Diagnosis from '@main/components/Diagnosis';

describe('Diagnosis Screen', () => {
  describe('Diagnosis code input renders correctly', () => {
    it('When infection status is healthy.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
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
      const description = queryByText(i18n.translate('screens.diagnosis.code_input.description', { formatted: false }));
      const input = queryByPlaceholderText(i18n.translate('common.placeholders.code'));
      const submit = queryByA11yLabel(i18n.translate('screens.diagnosis.code_input.accessibility.label'));

      expect(title).toBeTruthy();
      expect(description).toBeTruthy();
      expect(input).toBeTruthy();
      expect(submit).toBeTruthy();

      expect(submit).toBeDisabled();
    });
    it('When infection status is exposed.', () => {
      const infectionStatus = INFECTION_STATUS.EXPOSED;
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
      const description = queryByText(i18n.translate('screens.diagnosis.code_input.description', { formatted: false }));
      const input = queryByPlaceholderText(i18n.translate('common.placeholders.code'));
      const submit = queryByA11yLabel(i18n.translate('screens.diagnosis.code_input.accessibility.label'));

      expect(title).toBeTruthy();
      expect(description).toBeTruthy();
      expect(input).toBeTruthy();
      expect(submit).toBeTruthy();

      expect(submit).toBeDisabled();
    });
    it('When an diagnosis code is entered.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
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
      const infectionStatus = INFECTION_STATUS.HEALTHY;
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
      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledWith('123456789012');
    });
  });
  describe('Diagnosis completed renders correctly', () => {
    it('When infection status is infected.', () => {
      const infectionStatus = INFECTION_STATUS.INFECTED;
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
      const infectionStatus = INFECTION_STATUS.INFECTED;
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
      expect(onPress).toHaveBeenCalled();
    });
  });
});
