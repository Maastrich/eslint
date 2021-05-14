import { RuleTester } from "eslint";
import { cwd, parser, parserOptions } from "../../utils";

const valid: Array<RuleTester.ValidTestCase> = [
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
  },
  {
    code: `export default function Bar() {};`,
    filename: `${cwd}/src/components/Parent/Bar/Bar.js`,
    parser,
    parserOptions,
  },
  {
    code: `export default function Foo() {};`,
    filename: `${cwd}/src/components/Parent/Bar/Foo.js`,
    parser,
    parserOptions,
  },
  {
    code: `export default function foo() {};`,
    filename: `${cwd}/src/bar.js`,
    parser,
    parserOptions,
  },
];

const invalid: Array<RuleTester.InvalidTestCase> = [
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
];

export default {
  valid,
  invalid,
};
