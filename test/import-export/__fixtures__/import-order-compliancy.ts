import { RuleTester } from "eslint";
import { cwd, parser, parserOptions } from "../../utils";

const valid: Array<RuleTester.ValidTestCase> = [
  {
    code: `import React from 'react'; import bar from '@scope/bar'; import foo from 'foo'; import alice from './alice';`,
    filename: `${cwd}/src/Bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `import alice from './alice'; import bob from './bob';`,
    filename: `${cwd}/src/Bar.js`,
    parser,
    parserOptions,
  },
];

const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: `import React from 'react'; import foo from 'foo'; import bar from '@scope/bar'; import alice from './alice';`,
    filename: `${cwd}/src/Bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
  {
    code: `import foo from 'foo'; import React from 'react'; import alice from './alice';`,
    filename: `${cwd}/src/Bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
  {
    code: `import React from 'react'; import alice from './alice'; import foo from 'foo';`,
    filename: `${cwd}/src/Bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
  {
    code: `import bob from './bob'; import alice from './alice'; `,
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
