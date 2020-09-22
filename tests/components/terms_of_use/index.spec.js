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

import TermsOfUse from '@settings/components/TermsOfUse';

describe('Terms Of Use Screen', () => {
  describe('Terms Of Use correctly', () => {
    it('', () => {
      const { queryByText } = render(
        <TermsOfUse />,
      );

      const title = queryByText(i18n.translate('screens.terms_of_use.title'));

      expect(title).toBeTruthy();
    });
  });
  describe('Terms Of Use buttons interaction work', () => {
    it('When press close button.', () => {
      const onClose = jest.fn();
      const { queryByA11yLabel } = render(
        <TermsOfUse
          onClose={onClose}
        />,
      );

      const closeButton = queryByA11yLabel(i18n.translate('screens.terms_of_use.actions.back.accessibility.label'));

      expect(closeButton).toBeTruthy();
      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
  });
});
