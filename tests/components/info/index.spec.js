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

import { DARK, LIGHT, AUTO } from '@app/common/theme';

import i18n, { languages } from '@app/services/i18n';

import Info from '@settings/components/Info';

describe('Info Screen', () => {
  describe('Info renders correctly', () => {
    it('When infection status is infected.', () => {
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          tracingEnabled
          isInfected
        />,
      );

      const tracingButton = queryByA11yLabel(i18n.translate('screens.settings.tracing.accessibility.label'));

      expect(tracingButton).toBeTruthy();

      expect(tracingButton).toBeDisabled();
    });
    it('When infection status is not infected.', () => {
      const version = '1.1.1';
      const build = '0';

      const { queryByA11yLabel, queryByText } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          appVersion={version}
          appBuild={build}
          tracingEnabled
        />,
      );

      const versionLabel = queryByText(i18n.translate('screens.settings.version', { version, build }));
      const tracingButton = queryByA11yLabel(i18n.translate('screens.settings.tracing.accessibility.label'));

      expect(versionLabel).toBeTruthy();
      expect(tracingButton).toBeTruthy();

      expect(tracingButton).toBeEnabled();
    });
    it('When tracing is enabled.', () => {
      const { queryByText, queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          tracingEnabled
        />,
      );

      const tracingSwitch = queryByA11yLabel(i18n.translate('screens.settings.tracing.accessibility.label'));
      const tracingText = queryByText(i18n.translate('common.words.enabled'));
      const descriptionText = queryByText(i18n.translate('screens.settings.tracing.description.enabled'));

      expect(tracingText).toBeTruthy();
      expect(tracingSwitch).toBeTruthy();
      expect(descriptionText).toBeTruthy();

      expect(tracingSwitch.props.accessibilityValue.text).toBe(true);
    });
    it('When tracing is disabled.', () => {
      const { queryByText, queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
        />,
      );

      const tracingSwitch = queryByA11yLabel(i18n.translate('screens.settings.tracing.accessibility.label'));
      const tracingText = queryByText(i18n.translate('common.words.disabled'));
      const descriptionText = queryByText(i18n.translate('screens.settings.tracing.description.disabled'));

      expect(tracingText).toBeTruthy();
      expect(tracingSwitch).toBeTruthy();
      expect(descriptionText).toBeTruthy();

      expect(tracingSwitch.props.accessibilityValue.text).toBe(false);
    });
    it('When language is EN.', () => {
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          tracingEnabled
        />,
      );

      const languageButton = queryByA11yLabel(i18n.translate('screens.settings.language.accessibility.label'));

      expect(languageButton).toBeTruthy();

      expect(languageButton.props.accessibilityValue.text).toBe(languages.EN.name);
    });
    it('When language is PT.', () => {
      const { queryByA11yLabel } = render(
        <Info
          language={languages.PT}
          theme={AUTO}
          tracingEnabled
        />,
      );

      const languageButton = queryByA11yLabel(i18n.translate('screens.settings.language.accessibility.label'));

      expect(languageButton).toBeTruthy();

      expect(languageButton.props.accessibilityValue.text).toBe(languages.PT.name);
    });
    it.each([LIGHT, DARK, AUTO])('When theme is %s.', (theme) => {
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={theme}
          tracingEnabled
        />,
      );

      const themeButton = queryByA11yLabel(i18n.translate('screens.settings.theme.accessibility.label'));

      expect(themeButton).toBeTruthy();

      expect(themeButton.props.accessibilityValue.text).toBe(i18n.translate(`screens.settings.theme.${theme}`));
    });
  });
  describe('Info buttons interaction work', () => {
    it('When press close button.', () => {
      const onClose = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          tracingEnabled
          onClose={onClose}
        />,
      );

      const closeButton = queryByA11yLabel(i18n.translate('screens.settings.actions.back.accessibility.label'));

      expect(closeButton).toBeTruthy();
      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
    it('When press tracing button.', () => {
      const onPressTracing = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          tracingEnabled
          onPressTracing={onPressTracing}
        />,
      );

      const tracingButton = queryByA11yLabel(i18n.translate('screens.settings.tracing.accessibility.label'));

      expect(tracingButton).toBeTruthy();
      fireEvent.press(tracingButton);
      expect(onPressTracing).toHaveBeenCalled();
    });
    it('When press language button.', () => {
      const onPressLanguage = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          language={languages.PT}
          theme={AUTO}
          tracingEnabled
          onPressLanguage={onPressLanguage}
        />,
      );

      const languageButton = queryByA11yLabel(i18n.translate('screens.settings.language.accessibility.label'));

      expect(languageButton).toBeTruthy();
      fireEvent.press(languageButton);
      expect(onPressLanguage).toHaveBeenCalled();
    });
    it.each([LIGHT, DARK, AUTO])('When press \'%s\' theme button.', (theme) => {
      const onPressTheme = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={theme}
          tracingEnabled
          onPressTheme={onPressTheme}
        />,
      );

      const themeButton = queryByA11yLabel(i18n.translate('screens.settings.theme.accessibility.label'));

      expect(themeButton).toBeTruthy();
      fireEvent.press(themeButton);
      expect(onPressTheme).toHaveBeenCalled();
    });
    it('When press support button.', () => {
      const onPressSupport = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          tracingEnabled
          onPressSupport={onPressSupport}
        />,
      );

      const supportButton = queryByA11yLabel(i18n.translate('screens.settings.support.accessibility.label'));

      expect(supportButton).toBeTruthy();
      fireEvent.press(supportButton);
      expect(onPressSupport).toHaveBeenCalled();
    });
    it('When press how to use button.', () => {
      const onPressHowToUse = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          tracingEnabled
          onPressHowToUse={onPressHowToUse}
        />,
      );

      const howToUseButton = queryByA11yLabel(i18n.translate('screens.settings.how_to_use.accessibility.label'));

      expect(howToUseButton).toBeTruthy();
      fireEvent.press(howToUseButton);
      expect(onPressHowToUse).toHaveBeenCalled();
    });
    it('When press faqs button.', () => {
      const onPressFaqs = jest.fn();
      const { queryByA11yLabel } = render(
        <Info
          language={languages.EN}
          theme={AUTO}
          tracingEnabled
          onPressFaqs={onPressFaqs}
        />,
      );

      const faqsButton = queryByA11yLabel(i18n.translate('screens.settings.faqs.accessibility.label'));

      expect(faqsButton).toBeTruthy();
      fireEvent.press(faqsButton);
      expect(onPressFaqs).toHaveBeenCalled();
    });
  });
});
