/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Text from '@app/common/components/Text';

import Linking from '@app/services/linking';

export default class FormattedText extends Component {
  render() {
    const {
      children,
      ...otherProps
    } = this.props;

    if (Array.isArray(children)) {

      return (
        <Text {...otherProps}>
          {children.map(({id: key, content, weight, link}) => {
            const props = {
              key,
              weight,
            };

            const hasLink = link !== undefined;
            if (hasLink) {
              props.onPress = () => Linking.openURL(link);
              props.underline = true;
              props.weight = weight || 'bold';
            }

            return (
              <Text
                {...otherProps}
                {...props}
              >
                { content }
              </Text>
            );
          })}
        </Text>
      );
    }

    return <Text {...this.props} />;
  }
}

FormattedText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
};
