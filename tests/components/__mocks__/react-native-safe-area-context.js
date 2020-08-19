import React from 'react';
import { View } from 'react-native';

const insets = {
  top: 0, left: 0, right: 0, bottom: 0,
};

const SafeAreaConsumer = ({ children }) => {
  return children(insets);
};

const SafeAreaProvider = ({ children }) => {
  return <View>{children}</View>;
};

export {
  SafeAreaConsumer,
  SafeAreaProvider,
};
