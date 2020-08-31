import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import i18n from '@app/services/i18n';

import TechnicalSheet from '@settings/components/TechnicalSheet';

describe('Technical Sheet Screen', () => {
  it('Technical Sheet renders correctly', () => {
    const version = '1.1.1';
    const build = '0';

    const { queryByA11yLabel, queryByText } = render(
      <TechnicalSheet
        version={version}
        build={build}
      />,
    );

    const versionLabel = queryByText(i18n.translate('screens.technical_sheet.version', { version, build }));
    const inesctecButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.inesctec.accessibility.label'));
    const ISPUPButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.ispup.accessibility.label'));
    const keyruptiveButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.keyruptive.accessibility.label'));
    const ubiriderButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.ubirider.accessibility.label'));
    const spmsButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.spms.accessibility.label'));

    expect(versionLabel).toBeTruthy();
    expect(inesctecButton).toBeTruthy();
    expect(ISPUPButton).toBeTruthy();
    expect(keyruptiveButton).toBeTruthy();
    expect(ubiriderButton).toBeTruthy();
    expect(spmsButton).toBeTruthy();
  });
  describe('Technical Sheet buttons interaction work', () => {
    it('When press close button.', () => {
      const onClose = jest.fn();

      const { queryByA11yLabel } = render(
        <TechnicalSheet
          onClose={onClose}
        />,
      );

      const closeButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.actions.go_back.accessibility.label'));

      expect(closeButton).toBeTruthy();

      expect(closeButton).toBeTruthy();
      fireEvent.press(closeButton);
      expect(onClose.mock.calls.length).toBe(1);
    });
    it('When press coordinator button.', () => {
      const onPressCoordinator = jest.fn();

      const { queryByA11yLabel } = render(
        <TechnicalSheet
          onPressCoordinator={onPressCoordinator}
        />,
      );

      const coordinatorButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.inesctec.accessibility.label'));

      expect(coordinatorButton).toBeTruthy();

      expect(coordinatorButton).toBeTruthy();
      fireEvent.press(coordinatorButton);
      expect(onPressCoordinator.mock.calls.length).toBe(1);
    });
    it('When press ISPUP button.', () => {
      const onPressISPUP = jest.fn();

      const { queryByA11yLabel } = render(
        <TechnicalSheet
          onPressISPUP={onPressISPUP}
        />,
      );

      const ispupButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.ispup.accessibility.label'));

      expect(ispupButton).toBeTruthy();

      expect(ispupButton).toBeTruthy();
      fireEvent.press(ispupButton);
      expect(onPressISPUP.mock.calls.length).toBe(1);
    });
    it('When press Keyruptive button.', () => {
      const onPressKeyruptive = jest.fn();

      const { queryByA11yLabel } = render(
        <TechnicalSheet
          onPressKeyruptive={onPressKeyruptive}
        />,
      );

      const keyruptiveButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.keyruptive.accessibility.label'));

      expect(keyruptiveButton).toBeTruthy();

      expect(keyruptiveButton).toBeTruthy();
      fireEvent.press(keyruptiveButton);
      expect(onPressKeyruptive.mock.calls.length).toBe(1);
    });
    it('When press Ubirider button.', () => {
      const onPressUbirider = jest.fn();

      const { queryByA11yLabel } = render(
        <TechnicalSheet
          onPressUbirider={onPressUbirider}
        />,
      );

      const ubiriderButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.ubirider.accessibility.label'));

      expect(ubiriderButton).toBeTruthy();

      expect(ubiriderButton).toBeTruthy();
      fireEvent.press(ubiriderButton);
      expect(onPressUbirider.mock.calls.length).toBe(1);
    });
    it('When press SPMS button.', () => {
      const onPressSPMS = jest.fn();

      const { queryByA11yLabel } = render(
        <TechnicalSheet
          onPressSPMS={onPressSPMS}
        />,
      );

      const spmsButton = queryByA11yLabel(i18n.translate('screens.technical_sheet.spms.accessibility.label'));

      expect(spmsButton).toBeTruthy();

      expect(spmsButton).toBeTruthy();
      fireEvent.press(spmsButton);
      expect(onPressSPMS.mock.calls.length).toBe(1);
    });
  });
});
