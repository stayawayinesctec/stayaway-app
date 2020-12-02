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

import Licenses from '@settings/components/Licenses';

describe('Privacy Policy Screen', () => {
  describe('Privacy Policy correctly', () => {
    it('', () => {
      const licenses = [
        {
          name: "MIT",
          link: "https://opensource.org/licenses/MIT",
          tools: [
            {
              name: "Cocoapods",
              link: "https://cocoapods.org/",
            },
          ],
          libraries: [
            {
              name:"TrustKit",
              link: "https://github.com/datatheorem/TrustKit",
            },
          ],
          react_native_packages: [
            {
              name: "react-native-tooltips",
              link: "https://github.com/prscX/react-native-tooltips",
            },
          ],
          fonts: [
            {
              name: "Roboto",
              link: "https://fonts.google.com/specimen/Roboto",
            },
          ],
        },
      ];
      const { queryByText } = render(
        <Licenses licenses={licenses} />,
      );

      const title = queryByText(i18n.translate('screens.licenses.title'));
      const project = queryByText(i18n.translate('screens.licenses.project', { formatted: false }));
      const copyrightAndLicenseTitle = queryByText(i18n.translate('screens.licenses.copyright_and_license.title'));
      const thirdPartyTitle = queryByText(i18n.translate('screens.licenses.third_party.title'));

      expect(title).toBeTruthy();
      expect(project).toBeTruthy();
      expect(copyrightAndLicenseTitle).toBeTruthy();
      expect(thirdPartyTitle).toBeTruthy();

      licenses.forEach(license => {
        const licenseName = queryByText(license.name);
        expect(licenseName).toBeTruthy();

        license.tools.forEach(tool => {
          const toolName = queryByText(tool.name);
          expect(toolName).toBeTruthy();
        });

        license.libraries.forEach(library => {
          const libraryName = queryByText(library.name);
          expect(libraryName).toBeTruthy();
        });

        license.react_native_packages.forEach(rnpackage => {
          const rnpackageName = queryByText(rnpackage.name);
          expect(rnpackageName).toBeTruthy();
        });

        license.fonts.forEach(font => {
          const fontName = queryByText(font.name);
          expect(fontName).toBeTruthy();
        });
      });
    });
  });
  describe('Privacy Policy buttons interaction work', () => {
    it('When press close button.', () => {
      const onClose = jest.fn();
      const { queryByA11yLabel } = render(
        <Licenses
          onClose={onClose}
        />,
      );

      const closeButton = queryByA11yLabel(i18n.translate('screens.licenses.actions.back.accessibility.label'));

      expect(closeButton).toBeTruthy();
      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
  });
});
