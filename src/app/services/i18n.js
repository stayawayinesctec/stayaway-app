/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

/* eslint-disable global-require */
import { I18nManager } from 'react-native';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import memoize from 'lodash.memoize';

import Moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/pt-br';
import 'moment/locale/en-gb';

export const languages = {
  PT: {
    name: 'Português',
    countryCode: 'PT',
    languageTag: 'pt-PT',
    isRTL: false,
  },
  EN: {
    name: 'English',
    countryCode: 'EN',
    languageTag: 'en-GB',
    isRTL: false,
  },
};

// Fallback if no available language fits
const fallback = languages.EN;

const setMomentLocale = (locale) => {
  const mapper = {
    'pt': 'pt',
    'pt-PT': 'pt',
    'pt-BR': 'pt-br',
    'en': 'en-gb',
    'en-GB': 'en-gb',
    'en-US': 'en',
  };

  // Set moment js config
  Moment.locale([mapper[locale], mapper[fallback.languageTag]]);
};

// Import locales
const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  'pt': () => require('@locales/pt-PT.json'),
  'pt-PT': () => require('@locales/pt-PT.json'),
  'pt-BR': () => require('@locales/pt-PT.json'),
  'en': () => require('@locales/en-GB.json'),
  'en-GB': () => require('@locales/en-GB.json'),
  'en-US': () => require('@locales/en-GB.json'),
};

// Memoized translate method
const translate = memoize(
  (key, config = { formatted: true }) => {
    const { formatted = true, ...otherConfigs } = config;
    const translation = i18n.t(key, otherConfigs);

    if (Array.isArray(translation)) {
      if (formatted) {
        return translation.map(value => ({
          ...value,
          content: i18n.interpolate(value.content, otherConfigs),
        }));
      }

      return translation.reduce((accumulator, value) =>
        accumulator + i18n.interpolate(value.content)
      , '');
    }

    return translation;
  },
  (key, config = {}) => (key + JSON.stringify(config)),
);

// Language information
let currentLocale = {...fallback};

const setupI18n = ({ languageTag, isRTL }) => {
  // Allow RTL alignment in RTL languages
  I18nManager.forceRTL(isRTL);

  // Set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };

  i18n.locale = languageTag;
  i18n.fallbacks = true;
  i18n.defaultLocale = fallback.languageTag;

  // Set moment js config
  setMomentLocale(languageTag);
};

const setI18nConfig = (languageTag) => {
  const language = languages[languageTag.slice(0, 2).toUpperCase()];

  setupI18n(language);

  // Set language information
  currentLocale = language;

  return language;
};

const setDefaultI18nConfig = () => {
  const availableLanguage =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  const language = languages[availableLanguage.languageTag.slice(0, 2).toUpperCase()];

  setupI18n(language);

  // Set language information
  currentLocale = language;

  return language;
};

export default {
  currentLocale,
  translate,
  setI18nConfig,
  setDefaultI18nConfig,
};
