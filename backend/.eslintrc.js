module.exports = {
  env: {
    es6: true,
    es2021: true,
    node: true,
    browser: true,
  },
  extends: ["eslint:recommended", "@vue/prettier"],
  rules: {
    indent: ["error", "tab"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "linebreak-style": ["error", "unix"],
    "require-jsdoc": "off",
    "max-len": "off",
    "new-cap": "off",
    "no-console": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "no-useless-escape": "off",
    "no-prototype-builtins": "off",
    "valid-typeof": "off",
  },
};
