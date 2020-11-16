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
import Moment from 'moment';

import Icon from '@app/common/components/Icon';

import i18n from '@app/services/i18n';
import { INFECTION_STATUS } from '@app/services/tracking';

import { iconSizes, fontWeights } from '@app/common/theme';
import Images from '@app/common/assets/images';

import Home from '@main/components/Home';

describe('Home Screen', () => {
  describe('Home renders correctly', () => {
    it('When infection status is healthy.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
      const onPress = jest.fn();
      const onLongPress = jest.fn();
      const lastSync = new Moment();
      const error = {
        status: false,
        title: '',
        message: '',
        icon: undefined,
        main: {
          label: '',
          accessibility: {
            label: '',
            hint: '',
          },
          onPress: () => {},
        },
      };

      const { queryByText, queryByTestId, queryByA11yLabel } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          onPress={onPress}
          onLongPress={onLongPress}
          lastSync={lastSync}
          error={error}
        />,
      );

      const header = queryByText(i18n.translate('screens.home.healthy.title'));
      const shareButton = queryByA11yLabel(i18n.translate('screens.home.actions.share.accessibility.label'));
      const descriptionFirst = queryByText(i18n.translate('screens.home.healthy.description.first'));
      const descriptionSecond = queryByText(i18n.translate('screens.home.healthy.description.second'));
      const image = queryByTestId('home_image_background');

      expect(header).toBeTruthy();
      expect(shareButton).toBeTruthy();
      expect(descriptionFirst).toBeTruthy();
      expect(descriptionSecond).toBeTruthy();
      expect(image).toBeTruthy();

      expect(descriptionFirst.props.style.fontWeight).toBe(fontWeights.bold);
      expect(descriptionSecond.props.style.fontWeight).toBe(fontWeights.normal);
      expect(image.props.source).toBe(Images.healthy);
    });
    it('When infection status is exposed.', () => {
      const infectionStatus = INFECTION_STATUS.EXPOSED;
      const lastSync = new Moment();
      const error = {
        status: false,
        title: '',
        message: '',
        icon: undefined,
        main: {
          label: '',
          accessibility: {
            label: '',
            hint: '',
          },
          onPress: () => {},
        },
      };

      const { queryByText, queryByTestId, queryByA11yLabel } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          lastSync={lastSync}
          error={error}
        />,
      );

      const header = queryByText(i18n.translate('screens.home.exposed.title'));
      const shareButton = queryByA11yLabel(i18n.translate('screens.home.actions.share.accessibility.label'));
      const descriptionFirst = queryByText(i18n.translate('screens.home.exposed.description.first'));
      const descriptionSecond = queryByText(i18n.translate('screens.home.exposed.description.second'));
      const descriptionThird = queryByText(i18n.translate('screens.home.exposed.description.third'));
      const descriptionFourth = queryByText(i18n.translate('screens.home.exposed.description.fourth'));
      const descriptionFifth = queryByText(i18n.translate('screens.home.exposed.description.fifth'));
      const descriptionSixth = queryByText(i18n.translate('screens.home.exposed.description.sixth'));
      const descriptionSeventh = queryByText(i18n.translate('screens.home.exposed.description.seventh'));
      const descriptionEighth = queryByText(i18n.translate('screens.home.exposed.description.eighth'));
      const image = queryByTestId('home_image_background');

      expect(header).toBeTruthy();
      expect(shareButton).toBeTruthy();
      expect(descriptionFirst).toBeTruthy();
      expect(descriptionSecond).toBeTruthy();
      expect(descriptionThird).toBeTruthy();
      expect(descriptionFourth).toBeTruthy();
      expect(descriptionFifth).toBeTruthy();
      expect(descriptionSixth).toBeTruthy();
      expect(descriptionSeventh).toBeTruthy();
      expect(descriptionEighth).toBeTruthy();
      expect(image).toBeTruthy();

      expect(descriptionFirst.props.style.fontWeight).toBe(fontWeights.bold);
      expect(descriptionSecond.props.style.fontWeight).toBe(fontWeights.normal);
      expect(descriptionThird.props.style.fontWeight).toBe(fontWeights.normal);
      expect(descriptionFourth.props.style.fontWeight).toBe(fontWeights.bold);
      expect(descriptionFifth.props.style.fontWeight).toBe(fontWeights.normal);
      expect(descriptionSixth.props.style.fontWeight).toBe(fontWeights.normal);
      expect(descriptionSeventh.props.style.fontWeight).toBe(fontWeights.bold);
      expect(descriptionEighth.props.style.fontWeight).toBe(fontWeights.normal);
      expect(image.props.source).toBe(Images.exposed);
    });
    it('When infection status is infected.', () => {
      const infectionStatus = INFECTION_STATUS.INFECTED;
      const lastSync = new Moment();
      const error = {
        status: false,
        title: '',
        message: '',
        icon: undefined,
        main: {
          label: '',
          accessibility: {
            label: '',
            hint: '',
          },
          onPress: () => {},
        },
      };

      const { queryByText, queryByTestId, queryByA11yLabel } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          lastSync={lastSync}
          error={error}
        />,
      );

      const header = queryByText(i18n.translate('screens.home.infected.title'));
      const shareButton = queryByA11yLabel(i18n.translate('screens.home.actions.share.accessibility.label'));
      const descriptionFirst = queryByText(i18n.translate('screens.home.infected.description.first'));
      const descriptionSecond = queryByText(i18n.translate('screens.home.infected.description.second'));
      const image = queryByTestId('home_image_background');

      expect(header).toBeTruthy();
      expect(shareButton).toBeTruthy();
      expect(descriptionFirst).toBeTruthy();
      expect(descriptionSecond).toBeTruthy();
      expect(image).toBeTruthy();

      expect(descriptionFirst.props.style.fontWeight).toBe(fontWeights.bold);
      expect(descriptionSecond.props.style.fontWeight).toBe(fontWeights.normal);
      expect(image.props.source).toBe(Images.infected);
    });
    it('When an error occurs.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
      const lastSync = new Moment();
      const error = {
        status: true,
        title: i18n.translate('screens.home.errors.battery.title'),
        message: i18n.translate('screens.home.errors.battery.message'),
        submessage: i18n.translate('screens.home.errors.battery.submessage'),
        icon: <Icon name='battery_optimized' width={iconSizes.size14} height={iconSizes.size28} />,
        main: {
          label: i18n.translate('screens.home.errors.battery.actions.main.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.battery.actions.main.accessibility.label'),
            hint: i18n.translate('screens.home.errors.battery.actions.main.accessibility.hint'),
          },
          onPress: () => jest.fn(),
        },
        alternative: {
          label: i18n.translate('screens.home.errors.battery.actions.alternative.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.label'),
            hint: i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.hint'),
          },
          onPress: () => jest.fn(),
        },
      };

      const { queryByText, queryByA11yLabel, queryByA11yHint } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          lastSync={lastSync}
          error={error}
        />,
      );

      const header = queryByText(i18n.translate('screens.home.healthy.title'));
      const errorTitle = queryByText(i18n.translate('screens.home.errors.battery.title'));
      const errorMessage = queryByText(i18n.translate('screens.home.errors.battery.message'));
      const errorSubMessage = queryByText(i18n.translate('screens.home.errors.battery.submessage'));
      const mainAccessibilityLabel = queryByA11yLabel(i18n.translate('screens.home.errors.battery.actions.main.accessibility.label'));
      const mainAccessibilityHint = queryByA11yHint(i18n.translate('screens.home.errors.battery.actions.main.accessibility.hint'));
      const alternativeAccessibilityLabel = queryByA11yLabel(i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.label'));
      const alternativeAccessibilityHint = queryByA11yHint(i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.hint'));

      expect(header).toBeNull();
      expect(errorTitle).toBeTruthy();
      expect(errorMessage).toBeTruthy();
      expect(errorSubMessage).toBeTruthy();
      expect(mainAccessibilityLabel).toBeTruthy();
      expect(mainAccessibilityHint).toBeTruthy();
      expect(alternativeAccessibilityLabel).toBeTruthy();
      expect(alternativeAccessibilityHint).toBeTruthy();
    });
  });
  describe('Home buttons interaction work', () => {
    it('When press settings button.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
      const onPressSettings = jest.fn();
      const onLongPressSettings = jest.fn();
      const lastSync = new Moment();
      const error = {
        status: false,
        title: '',
        message: '',
        icon: undefined,
        main: {
          label: '',
          accessibility: {
            label: '',
            hint: '',
          },
          onPress: () => {},
        },
      };

      const { queryByA11yLabel } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          onPressSettings={onPressSettings}
          onLongPressSettings={onLongPressSettings}
          lastSync={lastSync}
          error={error}
        />,
      );

      const settingsButton = queryByA11yLabel(i18n.translate('screens.home.actions.settings.accessibility.label'));

      expect(settingsButton).toBeTruthy();
      fireEvent.press(settingsButton);
      fireEvent(settingsButton, 'onLongPress');
      expect(onPressSettings).toHaveBeenCalled();
      expect(onLongPressSettings).toHaveBeenCalled();
    });
    it('When press share button.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
      const onPressShare = jest.fn();
      const lastSync = new Moment();
      const error = {
        status: false,
        title: '',
        message: '',
        icon: undefined,
        main: {
          label: '',
          accessibility: {
            label: '',
            hint: '',
          },
          onPress: () => {},
        },
      };

      const { queryByA11yLabel } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          onPressShare={onPressShare}
          lastSync={lastSync}
          error={error}
        />,
      );

      const shareButton = queryByA11yLabel(i18n.translate('screens.home.actions.share.accessibility.label'));

      expect(shareButton).toBeTruthy();
      fireEvent.press(shareButton);
      expect(onPressShare).toHaveBeenCalled();
    });

    it('When press error button.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
      const lastSync = new Moment();
      const onPressMainButtonError = jest.fn();
      const onPressAlternativeButtonError = jest.fn();
      const error = {
        status: true,
        title: i18n.translate('screens.home.errors.battery.title'),
        message: i18n.translate('screens.home.errors.battery.message'),
        submessage: i18n.translate('screens.home.errors.battery.submessage'),
        icon: <Icon name='battery_optimized' width={iconSizes.size14} height={iconSizes.size28} />,
        main: {
          label: i18n.translate('screens.home.errors.battery.actions.main.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.battery.actions.main.accessibility.label'),
            hint: i18n.translate('screens.home.errors.battery.actions.main.accessibility.hint'),
          },
          onPress: onPressMainButtonError,
        },
        alternative: {
          label: i18n.translate('screens.home.errors.battery.actions.alternative.label'),
          accessibility: {
            label: i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.label'),
            hint: i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.hint'),
          },
          onPress: onPressAlternativeButtonError,
        },
      };

      const { queryByA11yLabel } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          lastSync={lastSync}
          error={error}
        />,
      );

      const mainButton = queryByA11yLabel(i18n.translate('screens.home.errors.battery.actions.main.accessibility.label'));
      const alternativeButton = queryByA11yLabel(i18n.translate('screens.home.errors.battery.actions.alternative.accessibility.label'));

      expect(mainButton).toBeTruthy();
      expect(alternativeButton).toBeTruthy();
      fireEvent.press(mainButton);
      fireEvent.press(alternativeButton);
      expect(onPressMainButtonError).toHaveBeenCalled();
      expect(onPressAlternativeButtonError).toHaveBeenCalled();
    });
  });
});
