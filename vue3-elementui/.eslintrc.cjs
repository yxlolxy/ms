/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // override
    'vue/multi-word-component-names': 'off',
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ], // 尽可能单引号
    'jsx-quotes': ['error', 'prefer-double'], // jsx 强制双引号
    semi: [
      'error',
      'never',
      {
        beforeStatementContinuationChars: 'always',
      },
    ], // 强制不使用分号
    'no-cond-assign': ['error', 'always'], // 禁止在条件语句中出现赋值语句
  },
}
