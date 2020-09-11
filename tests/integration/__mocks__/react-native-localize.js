/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

const getLocales = () => [
  // you can choose / add the locales you want
  { countryCode: "PT", languageTag: "pt-PT", languageCode: "pt", isRTL: false },
];

// use a provided translation, or return undefined to test your fallback
const findBestAvailableLanguage = () => ({
  languageTag: "pt-PT",
  isRTL: false,
});

const getNumberFormatSettings = () => ({
  decimalSeparator: ".",
  groupingSeparator: ",",
});

const getCalendar = () => "gregorian"; // or "japanese", "buddhist"
const getCountry = () => "PT"; // the country code you want
const getCurrencies = () => ["EUR"]; // can be empty array
const getTemperatureUnit = () => "celsius"; // or "fahrenheit"
const getTimeZone = () => "Europe/Lisbon"; // the timezone you want
const uses24HourClock = () => true;
const usesMetricSystem = () => true;

const addEventListener = jest.fn();
const removeEventListener = jest.fn();

export {
  findBestAvailableLanguage,
  getLocales,
  getNumberFormatSettings,
  getCalendar,
  getCountry,
  getCurrencies,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesMetricSystem,
  addEventListener,
  removeEventListener,
};
