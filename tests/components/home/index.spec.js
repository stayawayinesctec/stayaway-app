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

import i18n from '@app/services/i18n';
import { INFECTION_STATUS } from '@app/services/tracking';

import { fontWeights } from '@app/common/theme';
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
        accessibility: {
          label: '',
          hint: '',
        },
        icon: '',
        onPress: () => {},
        clickable: false,
      };

      const { queryByText, queryByTestId } = render(
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
      const descriptionFirst = queryByText(i18n.translate('screens.home.healthy.description.first'));
      const descriptionSecond = queryByText(i18n.translate('screens.home.healthy.description.second'));
      const image = queryByTestId('home_image_background');

      expect(header).toBeTruthy();
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
        accessibility: {
          label: '',
          hint: '',
        },
        icon: '',
        onPress: () => {},
        clickable: false,
      };

      const { queryByText, queryByTestId } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          lastSync={lastSync}
          error={error}
        />,
      );

      const header = queryByText(i18n.translate('screens.home.exposed.title'));
      const descriptionFirst = queryByText(i18n.translate('screens.home.exposed.description.first'));
      const descriptionSecond = queryByText(i18n.translate('screens.home.exposed.description.second'));
      const descriptionThird = queryByText(i18n.translate('screens.home.exposed.description.third'));
      const descriptionFourth = queryByText(i18n.translate('screens.home.exposed.description.fourth'));
      const descriptionFifth = queryByText(i18n.translate('screens.home.exposed.description.fifth'));
      const image = queryByTestId('home_image_background');

      expect(header).toBeTruthy();
      expect(descriptionFirst).toBeTruthy();
      expect(descriptionSecond).toBeTruthy();
      expect(descriptionThird).toBeTruthy();
      expect(descriptionFourth).toBeTruthy();
      expect(descriptionFifth).toBeTruthy();
      expect(image).toBeTruthy();

      expect(descriptionFirst.props.style.fontWeight).toBe(fontWeights.bold);
      expect(descriptionSecond.props.style.fontWeight).toBe(fontWeights.normal);
      expect(descriptionThird.props.style.fontWeight).toBe(fontWeights.normal);
      expect(descriptionFourth.props.style.fontWeight).toBe(fontWeights.bold);
      expect(descriptionFifth.props.style.fontWeight).toBe(fontWeights.normal);
      expect(image.props.source).toBe(Images.exposed);
    });
    it('When infection status is infected.', () => {
      const infectionStatus = INFECTION_STATUS.INFECTED;
      const lastSync = new Moment();
      const error = {
        status: false,
        title: '',
        message: '',
        accessibility: {
          label: '',
          hint: '',
        },
        icon: '',
        onPress: () => {},
        clickable: false,
      };

      const { queryByText, queryByTestId } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          lastSync={lastSync}
          error={error}
        />,
      );

      const header = queryByText(i18n.translate('screens.home.infected.title'));
      const descriptionFirst = queryByText(i18n.translate('screens.home.infected.description.first'));
      const descriptionSecond = queryByText(i18n.translate('screens.home.infected.description.second'));
      const image = queryByTestId('home_image_background');

      expect(header).toBeTruthy();
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
        title: i18n.translate('screens.home.errors.gaen.title'),
        message: i18n.translate('screens.home.errors.gaen.message'),
        accessibility: {
          label: i18n.translate('screens.home.errors.gaen.accessibility.label'),
          hint: i18n.translate('screens.home.errors.gaen.accessibility.hint'),
        },
        icon: 'gaen_disconnected',
        onPress: jest.fn(),
        clickable: true,
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
      const errorTitle = queryByText(i18n.translate('screens.home.errors.gaen.title'));
      const headerMessage = queryByText(i18n.translate('screens.home.errors.gaen.message'));
      const accessibilityLabel = queryByA11yLabel(i18n.translate('screens.home.errors.gaen.accessibility.label'));
      const accessibilityHint = queryByA11yHint(i18n.translate('screens.home.errors.gaen.accessibility.hint'));

      expect(header).toBeNull();
      expect(errorTitle).toBeTruthy();
      expect(headerMessage).toBeTruthy();
      expect(accessibilityLabel).toBeTruthy();
      expect(accessibilityHint).toBeTruthy();
    });
  });
  describe('Home buttons interaction work', () => {
    it('When press settings button.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
      const onPress = jest.fn();
      const onLongPress = jest.fn();
      const lastSync = new Moment();
      const error = {
        status: false,
        title: '',
        message: '',
        accessibility: {
          label: '',
          hint: '',
        },
        icon: '',
        onPress: () => {},
        clickable: false,
      };

      const { queryByA11yLabel } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          onPress={onPress}
          onLongPress={onLongPress}
          lastSync={lastSync}
          error={error}
        />,
      );

      const settingsButton = queryByA11yLabel(i18n.translate('screens.home.actions.settings.accessibility.label'));

      expect(settingsButton).toBeTruthy();
      fireEvent.press(settingsButton);
      fireEvent(settingsButton, 'onLongPress');
      expect(onPress).toHaveBeenCalled();
      expect(onLongPress).toHaveBeenCalled();
    });
    it('When press error button.', () => {
      const infectionStatus = INFECTION_STATUS.HEALTHY;
      const lastSync = new Moment();
      const onPressError = jest.fn();
      const error = {
        status: true,
        title: i18n.translate('screens.home.errors.gaen.title'),
        message: i18n.translate('screens.home.errors.gaen.message'),
        accessibility: {
          label: i18n.translate('screens.home.errors.gaen.accessibility.label'),
          hint: i18n.translate('screens.home.errors.gaen.accessibility.hint'),
        },
        icon: 'gaen_disconnected',
        onPress: onPressError,
        clickable: true,
      };

      const { queryByA11yLabel } = render(
        <Home
          trackingEnabled
          infectionStatus={infectionStatus}
          lastSync={lastSync}
          error={error}
        />,
      );

      const errorButton = queryByA11yLabel(i18n.translate('screens.home.errors.gaen.accessibility.label'));

      expect(errorButton).toBeTruthy();
      fireEvent.press(errorButton);
      expect(onPressError).toHaveBeenCalled();
    });
  });
});
