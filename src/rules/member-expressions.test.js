const rule = require("./member-expressions");
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

ruleTester.run("no use of member expression except on intrisic", rule, {
  valid: [
    {
      code: `x => a.y.z`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `x => a.b()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `x => a().b()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `x => Foo.y.z`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `x => Foo.bind()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `Array.from();`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `Array.prototype.from();`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `React.useEffect;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `PropTypes.arrayOf();`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `Buffer.from();`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `React.useMemo();`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `PropTypes.invalidFunction();`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `Buffer.invalidFunction();`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("no use of then/catch", rule, {
  valid: [
    {
      code: `(async() => await foo())()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `foo().foo()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `(getMe())["bli"]`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `foo().then`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `foo().then.if()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `a[then()]()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `foo().then()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `foo().catch()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `foo().finally()`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
