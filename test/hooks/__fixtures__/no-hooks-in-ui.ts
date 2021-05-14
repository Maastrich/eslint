import { RuleTester } from "eslint";
import { cwd, parser, parserOptions } from "../../utils";

const valid: Array<RuleTester.ValidTestCase> = [
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
  },
  {
    code: `function FooBase() { const onClick = useCallback; }`,
    filename: `${cwd}/src/components/X/FooBase.js`,
    parser,
    parserOptions,
  },
  {
    code: `function FooBase() { const onClick = (function useCallback(){})(); }`,
    filename: `${cwd}/src/components/X/FooBase.js`,
    parser,
    parserOptions,
  },
];

const invalid: Array<RuleTester.InvalidTestCase> = [
  // {
  //   code: `function Foo() { useBar(); }`,
  //   filename: `${cwd}/src/components/X/Foo.js`,
  //   parser,
  //   parserOptions,
  //   errors: 1,
  // },
  // {
  //   code: `function FooBase() { const onClick = useCallback(() => {}) }`,
  //   filename: `${cwd}/src/components/X/FooBase.js`,
  //   parser,
  //   parserOptions,
  //   errors: 1,
  // },
];

export default {
  valid,
  invalid,
};
