const base = require('./base.cjs');

module.exports = {
  ...base,
  env: {
    ...base.env,
    reactnative: true,
  },
  plugins: [...new Set([...(base.plugins || []), 'react', 'react-native'])],
  extends: [...base.extends, 'plugin:react/recommended', 'plugin:react-native/all'],
  settings: {
    ...base.settings,
    react: {
      version: 'detect',
    },
  },
};
