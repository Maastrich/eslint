const rule = require("./hooks");
const process = require("process");

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

const cwd = process.cwd();
ruleTester.run("disallow hooks in UI components", rule, {
  valid: [
    {
      code: `function Foo() { for(const x of {}) true; }`,
      filename: `${cwd}/src/x.js`,
      parser,
      parserOptions,
    },
    {
      code: `function Foo() { useBar(); }`,
      filename: `${cwd}/src/x.js`,
      parser,
      parserOptions,
    },
    {
      code: `function Foo() { useBar(); }`,
      filename: `${cwd}/src/features/x.js`,
      parser,
      parserOptions,
    },
    {
      code: `function FooBase() { useBar(); }`,
      filename: `${cwd}/src/components/X/FooBase.js`,
      parser,
      parserOptions,
    },
    {
      code: `function FooBase() { const handleClick = useCallback(() => {}) }`,
      filename: `${cwd}/src/components/X/FooBase.js`,
      parser,
      parserOptions,
    },
    {
      code: `function FooBase() { const {onClick} = useCallback(() => {}) }`,
      filename: `${cwd}/src/components/X/FooBase.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FooBase() { const onClick = useCallback; }`,
      filename: `${cwd}/src/components/X/FooBase.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FooBase() { const onClick = (function useCallback(){})(); }`,
      filename: `${cwd}/src/components/X/FooBase.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `function Foo() { useBar(); }`,
      filename: `${cwd}/src/components/X/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FooBase() { const onClick = useCallback(() => {}) }`,
      filename: `${cwd}/src/components/X/FooBase.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
