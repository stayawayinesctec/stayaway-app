/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

const RESULTS = {
  UNAVAILABLE: "unavailable",
  DENIED: "denied",
  BLOCKED: "blocked",
  GRANTED: "granted",
};

const PERMISSIONS = {
  ANDROID: {
      ACCEPT_HANDOVER: "android.permission.ACCEPT_HANDOVER",
      ACCESS_BACKGROUND_LOCATION: "android.permission.ACCESS_BACKGROUND_LOCATION",
      ACCESS_COARSE_LOCATION: "android.permission.ACCESS_COARSE_LOCATION",
      ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
      ACTIVITY_RECOGNITION: "android.permission.ACTIVITY_RECOGNITION",
      ADD_VOICEMAIL: "com.android.voicemail.permission.ADD_VOICEMAIL",
      ANSWER_PHONE_CALLS: "android.permission.ANSWER_PHONE_CALLS",
      BODY_SENSORS: "android.permission.BODY_SENSORS",
      CALL_PHONE: "android.permission.CALL_PHONE",
      CAMERA: "android.permission.CAMERA",
      GET_ACCOUNTS: "android.permission.GET_ACCOUNTS",
      PROCESS_OUTGOING_CALLS: "android.permission.PROCESS_OUTGOING_CALLS",
      READ_CALENDAR: "android.permission.READ_CALENDAR",
      READ_CALL_LOG: "android.permission.READ_CALL_LOG",
      READ_CONTACTS: "android.permission.READ_CONTACTS",
      READ_EXTERNAL_STORAGE: "android.permission.READ_EXTERNAL_STORAGE",
      READ_PHONE_NUMBERS: "android.permission.READ_PHONE_NUMBERS",
      READ_PHONE_STATE: "android.permission.READ_PHONE_STATE",
      READ_SMS: "android.permission.READ_SMS",
      RECEIVE_MMS: "android.permission.RECEIVE_MMS",
      RECEIVE_SMS: "android.permission.RECEIVE_SMS",
      RECEIVE_WAP_PUSH: "android.permission.RECEIVE_WAP_PUSH",
      RECORD_AUDIO: "android.permission.RECORD_AUDIO",
      SEND_SMS: "android.permission.SEND_SMS",
      USE_SIP: "android.permission.USE_SIP",
      WRITE_CALENDAR: "android.permission.WRITE_CALENDAR",
      WRITE_CALL_LOG: "android.permission.WRITE_CALL_LOG",
      WRITE_CONTACTS: "android.permission.WRITE_CONTACTS",
      WRITE_EXTERNAL_STORAGE: "android.permission.WRITE_EXTERNAL_STORAGE",
  },
  IOS: {
      BLUETOOTH_PERIPHERAL: "ios.permission.BLUETOOTH_PERIPHERAL",
      CALENDARS: "ios.permission.CALENDARS",
      CAMERA: "ios.permission.CAMERA",
      CONTACTS: "ios.permission.CONTACTS",
      FACE_ID: "ios.permission.FACE_ID",
      LOCATION_ALWAYS: "ios.permission.LOCATION_ALWAYS",
      LOCATION_WHEN_IN_USE: "ios.permission.LOCATION_WHEN_IN_USE",
      MEDIA_LIBRARY: "ios.permission.MEDIA_LIBRARY",
      MICROPHONE: "ios.permission.MICROPHONE",
      MOTION: "ios.permission.MOTION",
      PHOTO_LIBRARY: "ios.permission.PHOTO_LIBRARY",
      REMINDERS: "ios.permission.REMINDERS",
      SIRI: "ios.permission.SIRI",
      SPEECH_RECOGNITION: "ios.permission.SPEECH_RECOGNITION",
      STOREKIT: "ios.permission.STOREKIT",
  },
};

export { PERMISSIONS, RESULTS };
export const openSettings = jest.fn(async () => {});
export const check = jest.fn(async () => RESULTS.GRANTED);
export const request = jest.fn(async () => RESULTS.GRANTED);

const notificationOptions = [
  'alert',
  'badge',
  'sound',
  'criticalAlert',
  'carPlay',
  // 'provisional', // excluded as it's not included in NotificationSettings
];

const notificationSettings = {
  alert: true,
  badge: true,
  sound: true,
  carPlay: true,
  criticalAlert: true,
  lockScreen: true,
  notificationCenter: true,
};

export const checkNotifications = jest.fn(() => Promise.resolve({
  status: RESULTS.GRANTED,
  settings: notificationSettings,
}));

export const requestNotifications = jest.fn((options) => Promise.resolve({
  status: RESULTS.GRANTED,
  settings: options
    .filter((option) => notificationOptions.includes(option))
    .reduce((acc, option) => ({...acc, [option]: true}), {
      lockScreen: true,
      notificationCenter: true,
    }),
}));

export const checkMultiple = jest.fn((permissions) => Promise.resolve(
  permissions.reduce((acc, permission) => ({
    ...acc,
    [permission]: RESULTS.GRANTED,
  })),
));

export const requestMultiple = jest.fn(async (permissions) => Promise.resolve(
  permissions.reduce((acc, permission) => ({
    ...acc,
    [permission]: RESULTS.GRANTED,
  })),
));

export default {
  PERMISSIONS,
  RESULTS,
  openSettings,
  check,
  request,
  checkNotifications,
  requestNotifications,
  checkMultiple,
  requestMultiple,
};
