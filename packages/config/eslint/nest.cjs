const base = require('./base.cjs');

module.exports = {
  ...base,
  env: {
    ...base.env,
    jest: true,
  },
  overrides: [
    {
      files: ['*.controller.ts', '*.service.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
