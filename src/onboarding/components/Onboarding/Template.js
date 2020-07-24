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
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Text from '@app/common/components/Text';
import Images from '@app/common/assets/images';
import { sizes } from '@app/common/theme';

const styles = (colors) => StyleSheet.create({
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
    backgroundColor: colors.white,
    paddingHorizontal: sizes.size24,
    paddingTop: '15%',
    borderTopRightRadius: 250,
    paddingBottom: sizes.size24 + sizes.size8 + sizes.size24,
  },
  centeredContainer: {
    flex: 1,
    paddingTop: '15%',
    backgroundColor: colors.white,
    paddingHorizontal: sizes.size24,
    justifyContent: 'center',
    borderTopRightRadius: 250,
  },
});

export default function Template (props) {
  const { header, description, image } = props;

  const renderContent = (colors) => {
    if (description.length === 0) {
      return (
        <Layout padding='horizontal' style={styles(colors).centeredContainer}>
          <Text weight='bold' size='xxlarge' style={styles(colors).mainHeader}>{header}</Text>
        </Layout>
      );
    }

    return (
      <Layout padding='horizontal' style={styles(colors).contentContainer}>
        {header.length > 0 && <Text weight='bold' size='xxlarge' style={styles(colors).header}>{header}</Text> }
        {description.length > 0 && <Text style={styles(colors).description}>{description}</Text>}
      </Layout>
    );
  };

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <ImageBackground
            source={image}
            style={styles(colors).imageContainer}
          >
            <View style={styles(colors).topContainer} />
            <View style={styles(colors).bottomContainer}>
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
  image: PropTypes.oneOf(Object.values(Images)).isRequired,
};
