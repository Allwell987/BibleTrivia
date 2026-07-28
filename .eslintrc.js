module.exports = {
  root: true,
  globals: {
    __DEV__: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-undef': 'warn',
  },
  overrides: [
    {
      files: ['*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
};
