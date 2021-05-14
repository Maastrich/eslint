const rule = require("./import-export");
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

ruleTester.run("do not import all", rule, {
  valid: [
    {
      code: `import leaflet from 'leaflet';`,
      filename: `${cwd}/src/bar.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import * as L from 'leaflet';`,
      filename: `${cwd}/src/bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
ruleTester.run("import name consistent", rule, {
  valid: [
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
  ],
  invalid: [
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
  ],
});

ruleTester.run("export name consistent", rule, {
  valid: [
    {
      code: `const Bar = 1; export default Bar;`,
      filename: `${cwd}/src/Bar.js`,
      parser,
      parserOptions,
    },
    {
      code: `export default function Bar() {};`,
      filename: `${cwd}/src/Bar.js`,
      parser,
      parserOptions,
    },
    {
      code: `export default function Bar() {};`,
      filename: `${cwd}/src/components/Bar/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export default function Bar() {};`,
      filename: `${cwd}/src/components/Parent/Bar/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export default function Foo() {};`,
      filename: `${cwd}/src/components/Parent/Bar/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export default function foo() {};`,
      filename: `${cwd}/src/bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `export default function BarComponent() {};`,
      filename: `${cwd}/src/components/Bar/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export default function BarComponent() {};`,
      filename: `${cwd}/src/components/Parent/Bar/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `const Bar = 1; export default Bar;`,
      filename: `${cwd}/src/bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export default function Bar1() {};`,
      filename: `${cwd}/src/bar1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export default function Bar2Component() {};`,
      filename: `${cwd}/src/components/Bar2/Bar2.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export default function Bar3Component() {};`,
      filename: `${cwd}/src/components/Parent/Bar3/Bar3.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export default function Foo() {};`,
      filename: `${cwd}/src/components/Parent/Bar/foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("import order compliant", rule, {
  valid: [
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
  ],
  invalid: [
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
  ],
});

ruleTester.run("do not use absolute path imports", rule, {
  valid: [
    {
      code: `import foo from 'foo';`,
      filename: `${cwd}/src/Bar.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import foo from '/foo';`,
      filename: `${cwd}/src/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("do not use absolute imports", rule, {
  valid: [
    {
      code: `import foo from '@scope/foo';`,
      filename: `${cwd}/src/Bar.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import foo from 'scope/foo';`,
      filename: `${cwd}/src/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("import order must follow natural sort", rule, {
  valid: [
    {
      code: `import productComments9 from "./__fixtures__/product-comments-9.json"; import productComments10 from "./__fixtures__/product-comments-10.json"`,
      filename: `${cwd}/src/Bar.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import productComments10 from "./__fixtures__/product-comments-10.json"; import productComments9 from "./__fixtures__/product-comments-9.json"`,
      filename: `${cwd}/src/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
