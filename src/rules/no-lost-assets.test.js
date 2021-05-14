const rule = require("./no-lost-assets");
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

ruleTester.run("disallow import files outside of src/assets", rule, {
  valid: [
    {
      code: `import { ReactComponent as ShopCart } from "@myplugin-devops/streamline/regular/09-Shopping-Ecommerce/01-Shops/shop-cart.svg";`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import '../assets/test-valid.jpg';`,
      filename: `${cwd}/src/foo/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `import './test.js';`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
    },
    {
      code: `import './src/test-invalid.jpg';`,
      filename: `${cwd}/src/__tests__/test.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import './test-invalid.jpg';`,
      filename: `${cwd}/src/test.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
