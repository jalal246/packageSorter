module.exports = {
  parser: "babel-eslint",

  env: {
    browser: true,
    es6: true
  },
  extends: ["airbnb-base", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {},
  globals: {
    // jest: true,
    describe: true,
    it: true,
    // before: true,
    // after: true,
    // beforeEach: true,
    // afterEach: true,
    // expect: true,
    // render: true
  }
};
