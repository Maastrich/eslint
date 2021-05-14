const rule = require("./no-scss");

const RuleTester = require("eslint").RuleTester;

RuleTester.describe = describe;
RuleTester.it = test;

const parser = require.resolve("@babel/eslint-parser");
const parserOptions = {
  sourceType: "module",
  allowImportExportEverywhere: false,
  ecmaFeatures: {
    globalReturn: false,
  },
  requireConfigFile: false,
  babelOptions: {},
};

const ruleTester = new RuleTester();

ruleTester.run("disallow import CSS files", rule, {
  valid: [],
  invalid: [{ code: "import './x.css';", parser, parserOptions, errors: 1 }],
});

ruleTester.run("disallow import SCSS files", rule, {
  valid: [],
  invalid: [{ code: "import './x.scss';", parser, parserOptions, errors: 1 }],
});
