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

import { ThemeConsumer } from '@app/contexts/Theme';

import Template from '@main/components/Recommendations/Template';
import Icon from '@app/common/components/Icon';

import { iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

export default function RecommendationsHealthy (props) {
  const recommendations = [
    [
      {
        "key": "1",
        "text": i18n.translate('screens.recommendations.healthy.distance'),
        "renderIcon": (style) => <Icon name="distance" width={iconSizes.size78} height={iconSizes.size61} style={style} />,
      },
      {
        "key": "2",
        "text": i18n.translate('screens.recommendations.healthy.wear_mask'),
        "renderIcon": (style) => <Icon name="wear_mask" width={iconSizes.size70} height={iconSizes.size70} style={style} />,
      },
    ],
    [
      {
        "key": "3",
        "text": i18n.translate('screens.recommendations.healthy.wash_hands'),
        "renderIcon": (style) => <Icon name="wash_hands" width={iconSizes.size60} height={iconSizes.size61} style={style} />,
      },
      {
        "key": "4",
        "text": i18n.translate('screens.recommendations.healthy.feeling_sick'),
        "renderIcon": (style) => <Icon name="feeling_sick" width={iconSizes.size60} height={iconSizes.size61} style={style} />,
      },
    ],
  ];

  return (
    <ThemeConsumer>
      {({colors}) => (
        <Template
          recommendations={recommendations}
          color={colors.green}
          backgroundColor={colors.greenLight}
          {...props}
        />
      )}
    </ThemeConsumer>
  );
}
