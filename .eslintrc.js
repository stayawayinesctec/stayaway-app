module.exports = {
  "plugins": ["react", "react-native","jsx-a11y", "import", "jest", "module-resolver"],
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      }
  },
  "extends": ["airbnb", "prettier", "plugin:jsx-a11y/recommended", "plugin:jest/recommended"],
  "rules": {
    "react/jsx-filename-extension": [
      1, { "extensions": [".js", ".jsx"] }
    ],
    "jsx-a11y/anchor-is-valid": 0,
    "no-plusplus": 0,
    "no-await-in-loop": 0,
    "consistent-return": 0,
    "no-debugger": 0,
    "react/no-multi-comp": [2, { "ignoreStateless": true }],
    "react/prefer-stateless-function": 0,
    "react/jsx-wrap-multilines": 0,
    "import/no-extraneous-dependencies": 0,
    "class-methods-use-this": 0,
    "prefer-promise-reject-errors": 0,
    "module-resolver/use-alias": 2,
    "no-console": 0,
    "react/no-did-update-set-state": 0,
    "semi": [2, "always", { "omitLastInOneLineBlock": true }],
    "comma-dangle": [2, "always-multiline"]
  },
  "settings": {
    "import/resolver": {
      "babel-module": {}
    }
  },
  "env": {
    "jest": true,
    "browser": true,
    "es6": true,
    "react-native/react-native": true
  },
  "globals": {
    "__DEV__": true,
    "window": true
  }
}
