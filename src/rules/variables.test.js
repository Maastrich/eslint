const rule = require("./variables");
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

ruleTester.run("no use of var", rule, {
  valid: [
    {
      code: `let { x } = y;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x = 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `var x;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("case of variables must be valid", rule, {
  valid: [
    {
      code: `let x1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `let xXx;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `let fooBar;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x1 = 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const xXx = 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const fooBar = 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const Template = (args) => null`,
      filename: `${cwd}/src/components/ProductComment/Reviewer/__stories__/Reviewer.stories.js`,
      parser,
      parserOptions,
    },
    {
      code: `const Button = styled.button\`\``,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `let X;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let foo_bar;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `const X = 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `const foo_bar = 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("no declarations of multiple variables", rule, {
  valid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x = 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `let x, y;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `const x = 1, y = 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("arrow function parameter is valid", rule, {
  valid: [
    {
      code: `export default function() {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function x ({...a}) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function x ({a}) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x = ({a}) => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function x ([...a]) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function x ([a]) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function x ([,a]) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x = ([a]) => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x = a => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x = (a = 1) => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x = (a, b) => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `const x = ({A}) => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `const x = ({a_b}) => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function x ({...A}) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function x ([...A]) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `const x = ([A]) => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `const x = A => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `const x = a_1 => 1;`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("function name is be valid", rule, {
  valid: [
    {
      code: `function a() {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function a1() {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function fooBar() {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function Foo() {}`,
      filename: `${cwd}/src/components/A/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `function A() {}`,
      filename: `${cwd}/src/components/A/A.js`,
      parser,
      parserOptions,
    },
    {
      code: `function DashboardThemeProvider() {} export default DashboardThemeProvider`,
      filename: `${cwd}/src/theme/DashboardThemeProvider.js`,
      parser,
      parserOptions,
    },
    {
      code: `function DashboardV2() {} export default DashboardV2`,
      filename: `${cwd}/src/entry-points/DashboardV2.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `function a_1() {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FOO_BAR() {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function AComponent() {}`,
      filename: `${cwd}/src/components/A/A.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Bar() {}`,
      filename: `${cwd}/src/components/A/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Bar2() {}`,
      filename: `${cwd}/src/Bar2.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("function parameter is valid", rule, {
  valid: [
    {
      code: `function f(a) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function f(a=1) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `function f(a, b) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `function f(A) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function f(a_1) {}`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
