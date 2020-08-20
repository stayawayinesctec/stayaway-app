import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Moment from 'moment';

import i18n from '@app/services/i18n';
import { INFECTION_STATUS } from '@app/services/tracking';

import { colors, fontWeights } from '@app/common/theme';
import Images from '@app/common/assets/images';

import Recommendations from '@main/components/Recommendations';

describe('Recommendations Screen', () => {
  describe('Recommendations renders correctly', () => {
    it('When infection status is healthy.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;

      const { queryByText, queryByTestId } = render(
        <Recommendations infectionStatus={infectionStatus} />,
      );

      const recommendationHealty = queryByText(i18n.translate('screens.recommendations.healthy.distance'));
      const recommendationSocialContacts = queryByText(i18n.translate('screens.recommendations.healthy.social_contacts'));
      const recommendationWashHands = queryByText(i18n.translate('screens.recommendations.healthy.wash_hands'));
      const recommendationFeelingSick = queryByText(i18n.translate('screens.recommendations.healthy.feeling_sick'));
      const layout = queryByTestId('recommendations_layout');

      expect(recommendationHealty).toBeTruthy();
      expect(recommendationSocialContacts).toBeTruthy();
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

      const linkButton = queryByA11yLabel(i18n.translate('screens.recommendations.more_info.accessibility.label'));

      expect(linkButton).toBeTruthy();
      fireEvent.press(linkButton);
      expect(onPress.mock.calls.length).toBe(1);
    });
  });
});
