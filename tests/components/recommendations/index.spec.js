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
import { INFECTION_STATUS } from '@app/services/tracking';

import { colors } from '@app/common/theme';

import Recommendations from '@main/components/Recommendations';

describe('Recommendations Screen', () => {
  describe('Recommendations renders correctly', () => {
    it('When infection status is healthy.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;

      const { queryByText, queryByTestId } = render(
        <Recommendations infectionStatus={infectionStatus} />,
      );

      const recommendationHealthy = queryByText(i18n.translate('screens.recommendations.healthy.distance'));
      const recommendationWearMask = queryByText(i18n.translate('screens.recommendations.healthy.wear_mask'));
      const recommendationWashHands = queryByText(i18n.translate('screens.recommendations.healthy.wash_hands'));
      const recommendationFeelingSick = queryByText(i18n.translate('screens.recommendations.healthy.feeling_sick'));
      const layout = queryByTestId('recommendations_layout');

      expect(recommendationHealthy).toBeTruthy();
      expect(recommendationWearMask).toBeTruthy();
      expect(recommendationWashHands).toBeTruthy();
      expect(recommendationFeelingSick).toBeTruthy();
      expect(layout).toBeTruthy();

      expect(layout.props.style.backgroundColor).toBe(colors.greenLight);
    });
    it('When infection status is exposed.', () => {
      const infectionStatus = INFECTION_STATUS.EXPOSED;

      const { queryByText, queryByTestId } = render(
        <Recommendations infectionStatus={infectionStatus} />,
      );

      const recommendationEnclousedSpaces = queryByText(i18n.translate('screens.recommendations.exposed.encloused_spaces'));
      const recommendationStayHome = queryByText(i18n.translate('screens.recommendations.exposed.stay_home'));
      const recommendationIncreaseHygiene = queryByText(i18n.translate('screens.recommendations.exposed.increase_hygiene'));
      const recommendationWearMask = queryByText(i18n.translate('screens.recommendations.exposed.wear_mask'));
      const layout = queryByTestId('recommendations_layout');

      expect(recommendationEnclousedSpaces).toBeTruthy();
      expect(recommendationStayHome).toBeTruthy();
      expect(recommendationIncreaseHygiene).toBeTruthy();
      expect(recommendationWearMask).toBeTruthy();
      expect(layout).toBeTruthy();

      expect(layout.props.style.backgroundColor).toBe(colors.yellowLight);
    });
  });
  describe('Recommendations buttons interaction work', () => {
    it('When press source button.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
      const onPress = jest.fn();

      const { queryByA11yLabel } = render(
        <Recommendations
          infectionStatus={infectionStatus}
          onPress={onPress}
        />,
      );

      const linkButton = queryByA11yLabel(i18n.translate('screens.recommendations.source.accessibility.label'));

      expect(linkButton).toBeTruthy();
      fireEvent.press(linkButton);
      expect(onPress).toHaveBeenCalled();
    });
  });
});
