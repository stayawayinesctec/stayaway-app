module.exports = function(api) {
  if (api) {
    api.cache(true);
  }

  const common = {
    "presets": ["module:metro-react-native-babel-preset"],
    "plugins": [
      [
        "module-resolver", {
          "root": ["./src"],
          "alias": {
            "@root": "./",
            "@src": "./src",
            "@locales": "./locales",
            "@app": "./src/app",
            "@main": "./src/main",
            "@settings": "./src/settings",
            "@onboarding": "./src/onboarding",
          },
        },
      ],
    ],
  };

  if (process.env.NODE_ENV === 'production' || process.env.BABEL_ENV === 'production') {
    return {
      "presets": common.presets,
      "plugins": [
        ...common.plugins,
        "transform-remove-console",
      ],
    };
  }

  return common;
};
