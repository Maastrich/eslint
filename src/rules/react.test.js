const rule = require("./react");
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
  babelOptions: {
    presets: ["@babel/preset-react"],
    plugins: ["@babel/plugin-syntax-jsx"],
  },
};

const ruleTester = new RuleTester();

const cwd = process.cwd();

ruleTester.run("export default should be last in components", rule, {
  valid: [
    {
      code: `function Foo(){} export default Foo`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `function foo(){} export default foo; foo(); `,
      filename: `${cwd}/src/features/foo/foo.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `function Foo(){} export default Foo; foo(); `,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("no (arrow) function expression in JSX expressions", rule, {
  valid: [
    {
      code: `function F() { return <Foo x={foo} />; }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `function F() { return <Foo x={()=>null} />; }`,
      filename: `${cwd}/src/components/Foo/__tests__/Foo.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function F() { const foo = useCallback(()=>null); return <Foo x={foo} />; }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `const foo = ()=>null; function F() { return <Foo x={foo} />; }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `const foo = ()=>null; function F() { const foo = ()=>null; return <Foo x={foo} />; }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function F() { const foo = ()=>null; return <Foo x={foo} />; }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function F() { return <Foo x={()=>null} />; }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function F() { return <Foo x={function(){}} />; }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("no function expression in React hooks", rule, {
  valid: [
    {
      code: `function F() { useMemo(()=>null); }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `function F() { useFoo(function(){}); }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `function F() { useMemo(function(){}); }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("no argument named handleXXX in a component", rule, {
  valid: [
    {
      code: `function FooComponent() {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `function FooComponent({ onClick = () => {} }) {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `function FooComponent({ onClick }) {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `function FooComponent({ onClick, ...props }) {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `function fooFeature({ handleClick }) {}`,
      filename: `${cwd}/src/features/foo/foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FooComponent({ handleClick }) {}`,
      filename: `${cwd}/src/components/Foo/__tests__/Foo.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FooComponent(props, { handleClick }) {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FooComponent([{ handleClick }]) {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FooComponent({ onClick: handleClick }) {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function FooComponent({ ["handleClick"]: handleClick }) {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `function FooComponent({ handleClick }) {}`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
