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

import { useTheme } from '@app/contexts/Theme';

import Template from '@main/components/Recommendations/Template';
import Icon from '@app/common/components/Icon';

import { iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

export default function RecommendationsExposed (props) {
  const { colors } = useTheme();

  const recommendations = [
    [
      {
        "key": "1",
        "text": i18n.translate('screens.recommendations.exposed.encloused_spaces'),
        "icon": <Icon name="encloused_spaces" width={iconSizes.size68} height={iconSizes.size70} tintColor={colors.recommendationsPanelIconTintColor} />,
      },
      {
        "key": "2",
        "text": i18n.translate('screens.recommendations.exposed.stay_home'),
        "icon": <Icon name="stay_home" width={iconSizes.size59} height={iconSizes.size60} tintColor={colors.recommendationsPanelIconTintColor} />,
      },
    ],
    [
      {
        "key": "3",
        "text": i18n.translate('screens.recommendations.exposed.increase_hygiene'),
        "icon": <Icon name="increase_hygiene" width={iconSizes.size70} height={iconSizes.size70} tintColor={colors.recommendationsPanelIconTintColor} />,
      },
      {
        "key": "4",
        "text": i18n.translate('screens.recommendations.exposed.wear_mask'),
        "icon": <Icon name="wear_mask" width={iconSizes.size70} height={iconSizes.size70} tintColor={colors.recommendationsPanelIconTintColor} />,
      },
    ],
  ];

  return (
    <Template
      recommendations={recommendations}
      borderColor={colors.exposedYellow}
      panelBorderColor={colors.recommendationsYellowPanelBorderColor}
      backgroundColor={colors.recommendationsYellowPanelBackgroundColor}
      {...props}
    />
  );
}
