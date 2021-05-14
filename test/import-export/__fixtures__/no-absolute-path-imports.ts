import { RuleTester } from "eslint";
import { cwd, parser, parserOptions } from "../../utils";

const valid: Array<RuleTester.ValidTestCase> = [
  {
    code: `import foo from 'foo';`,
    filename: `${cwd}/src/Bar.js`,
    parser,
    parserOptions,
  },
];

const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: `import foo from '/foo';`,
    filename: `${cwd}/src/Bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
];

export default {
  valid,
  invalid,
};
