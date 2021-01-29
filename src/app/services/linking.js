/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import { Linking } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { openComposer } from 'react-native-email-link';
import i18n from '@app/services/i18n';

const openURL = async (url) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  }
};

const openMailComposer = (to, subject, body) => {
  openComposer({
    title: i18n.translate('common.dialogs.email.title'),
    message: i18n.translate('common.dialogs.email.message'),
    to,
    subject,
    body,
 });
};

export default {
  openURL,
  openMailComposer,
};
