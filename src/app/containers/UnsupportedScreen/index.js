/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useEffect, useState } from 'react';

import Unsupported from '@app/components/Unsupported';

import TracingManager from '@app/services/tracing';

export default function UnsupportedScreen () {
  const [supportedVersion, setSupportedVersion] = useState('');

  useEffect(() => {
    TracingManager.getInfo()
    .then(({
      OSVersion,
    }) => {
      const currentVersion = Number(OSVersion);
      if (currentVersion < 12.5) {
        setSupportedVersion('12.5');
      } else {
        setSupportedVersion('13.5');
      }
    });
  });

  return (
    <Unsupported supportedVersion={supportedVersion} />
  );
}
