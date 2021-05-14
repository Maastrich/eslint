const rule = require("./layout");
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

ruleTester.run("only JS files", rule, {
  valid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/x.ts`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("source must be in src", rule, {
  valid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/lib/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("scope is valid", rule, {
  valid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/__tests__/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/__tests__/__fixtures__/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/__tests__/__snapshots__/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/__stories__/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/__fixtures__/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
ruleTester.run("index.js allowed only src/components or src/features", rule, {
  valid: [
    {
      code: `export { default } from './Component';`,
      filename: `${cwd}/src/components/Component/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export { default } from './ComponentBase';`,
      filename: `${cwd}/src/components/Component/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/features/feature1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/components/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("only store.js is allowed in src/app", rule, {
  valid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/app/store.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/app/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

/* FEATURES */
ruleTester.run("no JavaScript files directly in src/features", rule, {
  valid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/features/x/store.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/features/store.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run(
  "no subdirectories allowed inside src/features/<feature>",
  rule,
  {
    valid: [
      {
        code: `let x;`,
        filename: `${cwd}/src/features/feature1/x.js`,
        parser,
        parserOptions,
        errors: 1,
      },
    ],
    invalid: [
      {
        code: `let x;`,
        filename: `${cwd}/src/features/feature1/directory/x.js`,
        parser,
        parserOptions,
        errors: 1,
      },
    ],
  }
);

ruleTester.run("feature name is valid", rule, {
  valid: [
    {
      code: `let x1;`,
      filename: `${cwd}/src/features/feature1/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x2;`,
      filename: `${cwd}/src/features/feature-1/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x3;`,
      filename: `${cwd}/src/features/feature-1/featureSlice.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x4;`,
      filename: `${cwd}/src/features/Feature1/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },

    {
      code: `let x5;`,
      filename: `${cwd}/src/features/feature_1/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x6;`,
      filename: `${cwd}/src/features/feaTUre1/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("file name in feature is valid", rule, {
  valid: [
    {
      code: `let x1;`,
      filename: `${cwd}/src/features/feature1/file1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x2;`,
      filename: `${cwd}/src/features/feature1/file-1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x3;`,
      filename: `${cwd}/src/features/feature1/__tests__/file1.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x4;`,
      filename: `${cwd}/src/features/feature1/__tests__/file-1.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x5;`,
      filename: `${cwd}/src/features/feature1/File1.js`,
      parser,
      parserOptions,
      errors: 1,
    },

    {
      code: `let x6;`,
      filename: `${cwd}/src/features/feature1/file_1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

/* COMPONENTS */
ruleTester.run("no JavaScript files directly in src/components", rule, {
  valid: [],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/components/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run(
  "subdirectories allowed inside src/components/<component>",
  rule,
  {
    valid: [
      {
        code: `export { default } from './Component2';`,
        filename: `${cwd}/src/components/Component1/Component2/index.js`,
        parser,
        parserOptions,
        errors: 1,
      },
    ],
    invalid: [],
  }
);

ruleTester.run("component name is valid", rule, {
  valid: [
    {
      code: `export { default } from './Component1';`,
      filename: `${cwd}/src/components/Component1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `export { default } from './Component-1'`,
      filename: `${cwd}/src/components/Component-1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export { default } from './Component_1'`,
      filename: `${cwd}/src/components/Component_1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("file name in component is valid", rule, {
  valid: [
    {
      code: `export { default } from './Component1';`,
      filename: `${cwd}/src/components/Component1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component1() {} export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component1Base() {} export default Component1Base`,
      filename: `${cwd}/src/components/Component1/Component1Base.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x3;`,
      filename: `${cwd}/src/components/Component1/__tests__/Component1.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x3;`,
      filename: `${cwd}/src/components/Component1/__tests__/Component1Base.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x4;`,
      filename: `${cwd}/src/components/Component1/__stories__/Component1.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x4;`,
      filename: `${cwd}/src/components/Component1/__stories__/Component1Base.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/components/Component1/__stories__/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/components/Component1/__stories__/Component1.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component1() {} export default Component1`,
      filename: `${cwd}/src/components/Component1/__tests__/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x3;`,
      filename: `${cwd}/src/components/Component1/Component1.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x5;`,
      filename: `${cwd}/src/components/Component1/Component1.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x6;`,
      filename: `${cwd}/src/components/Component1/__tests__/index.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x7;`,
      filename: `${cwd}/src/components/Component1/__stories__/index.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export { default } from './Component9'`,
      filename: `${cwd}/src/components/Component1/Component9.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x8;`,
      filename: `${cwd}/src/components/Component1/__tests__/Component9.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x9;`,
      filename: `${cwd}/src/components/Component1/__stories__/Component9.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("file name in subcomponent is valid", rule, {
  valid: [
    {
      code: `export { default } from './Component2';`,
      filename: `${cwd}/src/components/Component1/Component2/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component2() {} export default Component2`,
      filename: `${cwd}/src/components/Component1/Component2/Component2.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component2Base() {} export default Component2Base`,
      filename: `${cwd}/src/components/Component1/Component2/Component2Base.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/components/Component1/Component2/__tests__/Component2.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/components/Component1/Component2/__tests__/Component2Base.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/components/Component1/Component2/__stories__/Component2.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x;`,
      filename: `${cwd}/src/components/Component1/Component2/__stories__/Component2Base.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Sub() {} export default Sub`,
      filename: `${cwd}/src/components/Component/Sub/Sub.js`,
      parser,
      parserOptions,
      errors: 0,
    },
  ],
  invalid: [
    {
      code: `let x1;`,
      filename: `${cwd}/src/components/Component1/Component2/__stories__/index.test.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x2;`,
      filename: `${cwd}/src/components/Component1/__stories__/index.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component9() {} export default Component9`,
      filename: `${cwd}/src/components/Component1/Component2/Component9.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x3;`,
      filename: `${cwd}/src/components/Component1/Component2/__test__/Component9.test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x4;`,
      filename: `${cwd}/src/components/Component1/Component2/__stories__/Component9.stories.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function ComponentSub() {} export default ComponentSub`,
      filename: `${cwd}/src/components/Component/ComponentSub/ComponentSub.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("exported component must not have a displayName", rule, {
  valid: [
    {
      code: `function Component1() {} export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
    },
    {
      code: `function Component1() {} Component1.x = 'Component1'; export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
    },
    {
      code: `function Component1Base() {} Component1Base.x = 'Component1'; export default Component1Base`,
      filename: `${cwd}/src/components/Component1/Component1Base.js`,
      parser,
      parserOptions,
    },
    {
      code: `function Component1() {} function X() {} X.displayName = 'Component9'; export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `function Component1() {} Component1.displayName = 'Component1'; export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component1() {} Component1.x = 'Component1'; Component1.displayName = 'bogus'; export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component1() {} Component1.x = 'Component1'; Component1.displayName = 'Component1'; export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component1() {} Component1.displayName = 'Component9'; export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component1Base() {} Component1Base.displayName = 'Component9Base'; Component1Base.x = 'Component1'; export default Component1Base`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("component must have a valid default export", rule, {
  valid: [
    {
      code: `function Component2() {} export default Component2`,
      filename: `${cwd}/src/components/Component2/Component2.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component2Base() {} export default Component2Base`,
      filename: `${cwd}/src/components/Component2/Component2Base.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `function Component2() {}`,
      filename: `${cwd}/src/components/Component2/Component2.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `function Component2Component() {} export default Component2Component`,
      filename: `${cwd}/src/components/Component2/Component2.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("index.js must re-export current component", rule, {
  valid: [
    {
      code: `export { default } from './Component1'`,
      filename: `${cwd}/src/components/Component1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export { default } from './Component1Base'`,
      filename: `${cwd}/src/components/Component1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/components/Component1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `let x; let y`,
      filename: `${cwd}/src/components/Component1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `export { Component1 } from './Component1'`,
      filename: `${cwd}/src/components/Component1/index.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

/* LOCALES */
ruleTester.run("no JavaScript files directly in src/locales", rule, {
  valid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/locales/en/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/locales/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run(
  "src/locales subdirectory must be `_build`, `fr`, or `en``",
  rule,
  {
    valid: [
      {
        code: `let x;`,
        filename: `${cwd}/src/locales/_build/x.js`,
        parser,
        parserOptions,
        errors: 1,
      },
      {
        code: `let x;`,
        filename: `${cwd}/src/locales/fr/x.js`,
        parser,
        parserOptions,
        errors: 1,
      },
      {
        code: `let x;`,
        filename: `${cwd}/src/locales/en/x.js`,
        parser,
        parserOptions,
        errors: 1,
      },
    ],
    invalid: [
      {
        code: `let x;`,
        filename: `${cwd}/src/locales/x/x.js`,
        parser,
        parserOptions,
        errors: 1,
      },
    ],
  }
);

/* THEMES */
ruleTester.run("no subdirectory in src/theme", rule, {
  valid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/theme/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
  invalid: [
    {
      code: `let x;`,
      filename: `${cwd}/src/theme/x/x.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("do not override displayName", rule, {
  valid: [
    {
      code: `function Component1() {} export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `function Component1() {} Component1.displayName = 'Component1'; export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("define components in function, not arrow functions", rule, {
  valid: [
    {
      code: `function Component1() {} export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `const Component1 = () => null; export default Component1`,
      filename: `${cwd}/src/components/Component1/Component1.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
