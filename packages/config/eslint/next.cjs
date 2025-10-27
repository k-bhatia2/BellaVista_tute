const base = require('./base.cjs');

module.exports = {
  ...base,
  extends: [...base.extends, 'next/core-web-vitals'],
  env: {
    ...base.env,
    jest: true,
  },
};
