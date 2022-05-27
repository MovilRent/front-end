/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier"
  ],
  "env": {
    "vue/setup-compiler-macros": true,
    browser: true,
    node: true,
    es6: true
  },
  "globals": {
    "$": true,
    "require": true,
    "process": true
  },
}
