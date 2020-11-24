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

export default function RecommendationsExposed (props) {
  const recommendations = [
    [
      {
        "key": "1",
        "text": i18n.translate('screens.recommendations.exposed.encloused_spaces'),
        "renderIcon": (color) => <Icon name="encloused_spaces" width={iconSizes.size68} height={iconSizes.size70} tintColor={color} />,
      },
      {
        "key": "2",
        "text": i18n.translate('screens.recommendations.exposed.stay_home'),
        "renderIcon": (color) => <Icon name="stay_home" width={iconSizes.size59} height={iconSizes.size60} tintColor={color} />,
      },
    ],
    [
      {
        "key": "3",
        "text": i18n.translate('screens.recommendations.exposed.increase_hygiene'),
        "renderIcon": (color) => <Icon name="increase_hygiene" width={iconSizes.size70} height={iconSizes.size70} tintColor={color} />,
      },
      {
        "key": "4",
        "text": i18n.translate('screens.recommendations.exposed.wear_mask'),
        "renderIcon": (color) => <Icon name="wear_mask" width={iconSizes.size70} height={iconSizes.size70} tintColor={color} />,
      },
    ],
  ];

  return (
    <ThemeConsumer>
      {({colors}) => (
        <Template
          recommendations={recommendations}
          borderColor={colors.exposedYellow}
          panelBorderColor={colors.recommendationsYellowPanelBorderColor}
          backgroundColor={colors.recommendationsYellowPanelBackgroundColor}
          {...props}
        />
      )}
    </ThemeConsumer>
  );
}
