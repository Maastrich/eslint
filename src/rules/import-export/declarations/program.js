const { regexSort, arrayEquals } = require("../utils");

const program = (context) => (node) => {
  const { body } = node;
  const imports = body
    .filter(({ type }) => type === "ImportDeclaration")
    .map(({ source: { value } }) => value);
  const expectedImports = regexSort(
    [...imports],
    [
      /^react$/, // from 'react'
      /^@(.+)\/(.+)/, // from '@foo/bar'
      /^(?!([.]?[.]\/))/, // from 'foo/bar'
      /^([.]{2}\/.*)/, // from '../foo'
      /^([.]\/.*)/, // from './foo'
    ]
  );
  if (!arrayEquals(imports, expectedImports)) {
    context.report({
      node,
      message: `the order of imports is not compliant with myplugin policy, received: ${imports.join(
        ","
      )}, expected: ${expectedImports.join(",")}`,
    });
  }
};

module.exports = program;
