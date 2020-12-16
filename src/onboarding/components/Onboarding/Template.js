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
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Text from '@app/common/components/FormattedText';
import { images } from '@app/common/assets/images';
import { sizes } from '@app/common/theme';

const styles = (colors, insets) => StyleSheet.create({
  imageContainer: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  topContainer: {
    height: 300,
  },
  bottomContainer: {
    flex: 1,
  },
  mainHeader: {
    marginBottom: sizes.size24,
  },
  header: {
    width: '60%',
    marginBottom: sizes.size24,
  },
  description: {
    width: '90%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: sizes.size24,
    paddingTop: '15%',
    borderTopRightRadius: 250,
    paddingBottom: insets.bottom + sizes.size24 * 2 + sizes.size16,
  },
  centeredContainer: {
    flex: 1,
    paddingTop: '15%',
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: sizes.size24,
    justifyContent: 'center',
    borderTopRightRadius: 250,
  },
});

export default function Template (props) {
  const { header, description, image } = props;

  const insets = useSafeAreaInsets();

  const renderContent = (colors) => {
    if (description.length === 0) {
      return (
        <Layout padding='horizontal' style={styles(colors, insets).centeredContainer}>
          <Text weight='bold' size='xxlarge' style={styles(colors, insets).mainHeader}>{header}</Text>
        </Layout>
      );
    }

    return (
      <Layout padding='horizontal' style={styles(colors, insets).contentContainer}>
        {header.length > 0 && <Text weight='bold' size='xxlarge' style={styles(colors, insets).header}>{header}</Text> }
        {description.length > 0 && <Text style={styles(colors, insets).description}>{description}</Text>}
      </Layout>
    );
  };

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <ImageBackground
            source={image}
            style={styles(colors, insets).imageContainer}
          >
            <View style={styles(colors, insets).topContainer} />
            <View style={styles(colors, insets).bottomContainer}>
              {renderContent(colors)}
            </View>
          </ImageBackground>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Template.defaultProps = {
  header: '',
  description: '',
};

Template.propTypes = {
  header: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.oneOf(Object.values(images)).isRequired,
};
