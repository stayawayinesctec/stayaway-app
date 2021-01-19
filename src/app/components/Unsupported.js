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
import { View, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import i18n from '@app/services/i18n';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Text from '@app/common/components/FormattedText';

import { getThemedImage } from '@app/common/assets/images';

import { sizes } from '@app/common/theme';

const styles = (insets) => StyleSheet.create({
  content: {
  },
  title: {
    paddingBottom: sizes.size32,
  },
  imagesContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 0,
  },
  sponsors: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: sizes.size24 + insets.bottom,
    left: sizes.size24,
    zIndex: 0,
  },
  republicaPortuguesaImage: {
    marginRight: sizes.size24,
  },
  dgsImage: {
  },
  splashImage: {
    alignSelf: 'flex-end',
  },
});

export default function Unsupported (props) {
  const { supportedVersion } = props;

  const insets = useSafeAreaInsets();

  return (
    <ThemeConsumer>
      {({name}) => (
        <TopComponent>
          <Layout>
            <Text size='large' weight='bold' textAlign='center' style={styles(insets).title}>{i18n.translate('screens.unsupported.title')}</Text>
            <Text>{i18n.translate('screens.unsupported.description', { supported_version: supportedVersion })}</Text>
          </Layout>
          <View style={styles(insets).imagesContainer}>
            <View style={styles(insets).sponsors}>
              <Image source={getThemedImage('republica_portuguesa', name)} style={styles(insets).republicaPortuguesaImage} />
              <Image source={getThemedImage('logo_dgs', name)} style={styles(insets).dgsImage} />
            </View>
            <Image source={getThemedImage('splash', name)} style={styles(insets).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Unsupported.defaultProps = {
  supportedVersion: '',
};

Unsupported.propTypes = {
  supportedVersion: PropTypes.string,
};
