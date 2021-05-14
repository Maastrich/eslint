const rule = require("./lingui");
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

ruleTester.run("use a magic hash name for the lingui JS strings", rule, {
  valid: [
    {
      code: `import { t } from '@lingui/macro'; function Foo() { return t\`#Foo.text\` }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { plural } from '@lingui/macro'; function Foo() { return plural(1, { one: "#Foo.one" }) }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { t } from '@lingui/macro'; function Foo() { return (t+t)\`#Foo.Text\` }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { t } from '@lingui/macro'; function Foo() { return bar\`#Foo.Text\` }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { plural } from '@lingui/macro'; function Foo() { return (bar())(1, { one: "#Foo.one", ...rest }) }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import { plural } from '@lingui/macro'; function Foo() { return plural(1, { one: "#Foo.one", ...rest }) }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { plural } from '@lingui/macro'; function Foo() { return plural(1, xs) }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { plural } from '@lingui/macro'; function Foo() { return plural(1) }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { plural } from '@lingui/macro'; function Foo() { return plural(1, { one: "#Foo.One" }) }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { t } from '@lingui/macro'; function Foo() { return t\`#Foo.Text\` }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { t } from '@lingui/macro'; function Foo() { return t('#Foo.text') }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("do not import @lingui/react", rule, {
  valid: [
    {
      code: `import { Trans } from '@lingui/macro'`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import { Trans } from '@lingui/react'`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});

ruleTester.run("use a magic hash name for the lingui strings", rule, {
  valid: [
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>#Foo.text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>{"#Foo.text"}</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>{\`#Foo.text\`}</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>\n#Foo.text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>#Foo.Bar.text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Bar/Bar.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Foo.Bar>Foo Bar</Foo.Bar> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Trans } from 'another-lib'; function Foo() { return <Trans>#Foo.Text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Trans2 as Trans } from '@lingui/macro'; function Foo() { return <Trans>#Foo.Text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Plural } from '@lingui/macro'; function Foo() { return <Plural _1="#Foo.valid" value="#Foo.valid" zero="#Foo.valid" one="#Foo.valid" two="#Foo.valid" few="#Foo.valid" many="#Foo.valid" other="#Foo.valid" unknownProperty="#Foo.valid" /> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { SelectOrdinal } from '@lingui/macro'; function Foo() { return <SelectOrdinal _1="#Foo.valid" value="#Foo.valid" zero="#Foo.valid" one="#Foo.valid" two="#Foo.valid" few="#Foo.valid" many="#Foo.valid" other="#Foo.valid" unknownProperty="#Foo.valid" /> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
    {
      code: `import { Select } from '@lingui/macro'; function Foo() { return <Select value={gender} male="#Foo.hisBook" female="#Foo.herBook" other="#Foo.theirBook" /> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import { Select } from '@lingui/macro'; function Foo() { return <Select value={gender} male="#Foo.hisBook" {...bogusSpread } /> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Select } from '@lingui/macro'; function Foo() { return <Select value={gender} male="#Foo.hisBook">Bogus</Select> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Select } from '@lingui/macro'; function Foo() { return <Select value={gender} male="#Bogus.hisBook" female="#Bogus.herBook" other="#Bogus.theirBook" /> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 3,
    },
    {
      code: `import { Plural } from '@lingui/macro'; function Foo() { return <Plural>#Foo.Text</Plural> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Plural } from '@lingui/macro'; function Foo() { return <Plural _1="#Foo.valid" value="#Foo.valid" zero="#Foo.valid" one="#Foo.valid" two="#Foo.valid" few="#Foo.valid" many="#Foo.valid" other="#Foo.valid" unknownProperty="#Foo.valid" {...invalidSpread} /> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Plural } from '@lingui/macro'; function Foo() { return <Plural _1="#Foo.Bogus" value="#Foo.Bogus" zero="#Foo.Bogus" one="#Foo.Bogus" two="#Foo.Bogus" few="#Foo.Bogus" many="#Foo.Bogus" other="#Foo.Bogus" unknownProperty="#Foo.Bogus" /> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 8,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>#Foo.Text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>#Foo.Bar.Text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Bar/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans></Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans><div/>#Foo.text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>#Foo</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>Arbitrary Text</Trans> }`,
      filename: `${cwd}/src/components/Foo/Foo.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Bar() { return <Trans>#Bar</Trans> }`,
      filename: `${cwd}/src/components/Bar/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>#Foo.barText</Trans> }`,
      filename: `${cwd}/src/components/Foo/Bar/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
    {
      code: `import { Trans } from '@lingui/macro'; function Foo() { return <Trans>#Foo.bar</Trans> }`,
      filename: `${cwd}/src/components/Foo/Bar/Bar.js`,
      parser,
      parserOptions,
      errors: 1,
    },
  ],
});
