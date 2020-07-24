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

export default function RecommendationsInfected (props) {
  const recommendations = [
    [
      {
        "key": "1",
        "text": i18n.translate('screens.recommendations.infected.encloused_spaces'),
        "renderIcon": (style) => <Icon name="encloused_spaces" width={iconSizes.size68} height={iconSizes.size70} style={style} />,
      },
      {
        "key": "2",
        "text": i18n.translate('screens.recommendations.infected.stay_home'),
        "renderIcon": (style) => <Icon name="stay_home" width={iconSizes.size59} height={iconSizes.size60} style={style} />,
      },
    ],
    [
      {
        "key": "3",
        "text": i18n.translate('screens.recommendations.infected.increase_hygiene'),
        "renderIcon": (style) => <Icon name="increase_hygiene" width={iconSizes.size70} height={iconSizes.size70} style={style} />,
      },
      {
        "key": "4",
        "text": i18n.translate('screens.recommendations.infected.wear_mask'),
        "renderIcon": (style) => <Icon name="wear_mask" width={iconSizes.size70} height={iconSizes.size70} style={style} />,
      },
    ],
  ];

  return (
    <ThemeConsumer>
      {({colors}) => (
        <Template
          recommendations={recommendations}
          color={colors.yellowLight}
          {...props}
        />
      )}
    </ThemeConsumer>
  );
}
