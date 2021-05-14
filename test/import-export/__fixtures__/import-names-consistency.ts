import { RuleTester } from "eslint";
import { cwd, parser, parserOptions } from "../../utils";

const valid: Array<RuleTester.ValidTestCase> = [
  {
    code: `import React from 'react';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `import foo from './foo';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `import foo from './foo.json';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `import FooBar from './Foo-bar.js';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `import fooBar from './foo-bar.json';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `import fooBar from '@foo-bar/fooBar';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `import fooBar from './foo/bar/fooBar';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `import fooBar from '../foo/bar/fooBar';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
];

const invalid: Array<RuleTester.InvalidTestCase> = [
  {
    code: `import fooBar from './Foo-bar.js';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
  {
    code: `import FooBar from './foo-bar.json';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
  {
    code: `import Foo from './foo';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
  {
    code: `import Foo from './foo.json';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
  {
    code: `import Foo from './fooBar.json';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
  {
    code: `import foo from 'foo-bar/foo/Bar';`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
    errors: 1,
  },
];

export default {
  valid,
  invalid,
};
