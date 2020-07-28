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
import { StyleSheet, View, Image } from 'react-native';
import Moment from 'moment';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { INFECTED_STATUS } from '@app/services/tracking';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Icon from '@app/common/components/Icon';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/Text';

import Images from '@app/common/assets/images';

import { sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors) => StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: sizes.size8,
    left: -sizes.size8,
    padding: sizes.size8,
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    zIndex: 10,
  },
  itemsContainer: {
    marginBottom: sizes.size48,
  },
  title: {
    paddingVertical: sizes.size16,
    marginBottom: sizes.size48,
  },
  description: {
    marginBottom: sizes.size48,
  },
  stat: {
    flexDirection: 'row',
    marginBottom: sizes.size8,
  },
  legendContainer: {
    marginTop: sizes.size16,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
    bottom: sizes.size24,
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

export default function Debug (props) {
  const {
    signUp,
    status,
    onClose,
  } = props;

  let infectionStatusName = i18n.translate('screens.debug.infection_status.healthy');

  if (status.infectionStatus === INFECTED_STATUS.EXPOSED ) {
    infectionStatusName = i18n.translate('screens.debug.infection_status.exposed');
  }

  if (status.infectionStatus === INFECTED_STATUS.INFECTED ) {
    infectionStatusName = i18n.translate('screens.debug.infection_status.infected');
  }

  const exposedDays =
    status?.exposureDays
    .map(day => Moment(day.exposedDate).format('l').replace(/\//gi,'.'))
    .join(',');

  const errors = status?.errors.join(',');

  return (
    <ThemeConsumer>
      {({colors}) => (
        <TopComponent>
          <Layout style={styles(colors).layoutContainer}>
            <View style={styles(colors).header}>
              <ButtonWrapper
                onPress={onClose}
                style={styles(colors).closeButton}
                accessibilityLabel={i18n.translate('screens.debug.actions.back.accessibility.label')}
                accessibilityHint={i18n.translate('screens.debug.actions.back.accessibility.hint')}
              >
                <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
              </ButtonWrapper>
              <Text size='xlarge' weight='bold' style={styles(colors).title}>{i18n.translate('screens.debug.title')}</Text>
            </View>
            <View style={styles(colors).content}>
              <View style={styles(colors).stat}>
                <Text weight='bold'>{`${i18n.translate('screens.debug.sign_up')}: `}</Text>
                <Text>{Moment(signUp).format('l').replace(/\//gi,'.')}</Text>
              </View>
              <View style={styles(colors).stat}>
                <Text weight='bold'>{`${i18n.translate('screens.debug.last_sync')}: `}</Text>
                <Text>{Moment(status.lastSyncDate).format('l').replace(/\//gi,'.')}</Text>
              </View>
              <View style={styles(colors).stat}>
                <Text weight='bold'>{`${i18n.translate('screens.debug.infection_status.label')}: `}</Text>
                <Text>{infectionStatusName}</Text>
              </View>
              <View style={styles(colors).stat}>
                <Text weight='bold'>{`${i18n.translate('screens.debug.exposure_days')}: `}</Text>
                <Text>{exposedDays}</Text>
              </View>
              <View style={styles(colors).stat}>
                <Text weight='bold'>{`${i18n.translate('screens.debug.errors')}: `}</Text>
                <Text>{errors}</Text>
              </View>
            </View>
          </Layout>
          <View style={styles(colors).imagesContainer}>
            <View style={styles(colors).sponsors}>
              <Image source={Images.republica_portuguesa} style={styles(colors).republicaPortuguesaImage} />
              <Image source={Images.logo_dgs} style={styles(colors).dgsImage} />
            </View>
            <Image source={Images.splash} style={styles(colors).splashImage} />
          </View>
        </TopComponent>
      )}
    </ThemeConsumer>
  );
}

Debug.defaultProps = {
  signUp: Moment(),
  onClose: () => {},
};

Debug.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  signUp: PropTypes.object,
  status: PropTypes.shape({
    lastSyncDate: PropTypes.number,
    infectionStatus: PropTypes.number,
    exposureDays: PropTypes.array,
    errors: PropTypes.array,
  }).isRequired,
  onClose: PropTypes.func,
};
