// eslint-disable-next-line import/prefer-default-export
export const Platform = {
  OS: 'android',
  select: (specifics) => specifics.android,
};

export const NativeModules = {
  TracingManager: {
    isIgnoringBatteryOptimizationsPermission: () => Promise.resolve(true),
  },
  NativeEventEmitter () {
    return {
      addListener: () => {},
      removeListener: () => {},
    };
  },
};
