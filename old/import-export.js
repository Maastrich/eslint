const {
  getmypluginPathFromContext,
  regexSort,
  arrayEquals,
} = require("../eslint-utils");

const path = require("path");

module.exports = {
  create: (context) => {
    return {
      Program(node) {
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
      },
      ImportNamespaceSpecifier(node) {
        context.report({
          node,
          message: `do not import a namespace in full, pick the exports that you need`,
        });
      },
      ImportDeclaration(node) {
        const {
          source: { value: sourceValue },
          specifiers,
        } = node;

        if (sourceValue.match(/^\//)) {
          context.report({
            node,
            message: `do not use absolute path imports`,
          });
        }
        if (sourceValue.match(/^(?!@|\.{1,2}|\/).+\/.+$/)) {
          context.report({
            node,
            message: `do not import a submodule except for scope imports`,
          });
        }

        const defaultSpecifier = specifiers.find(
          ({ type }) => type === "ImportDefaultSpecifier"
        );

        if (sourceValue.match(/^[./]/) && defaultSpecifier) {
          const sourceBasename = path.basename(
            sourceValue,
            path.extname(sourceValue)
          );
          //const sourceBasenameIsLowercase = isLowercase(sourceBasename);
          const {
            local: { name: localName },
          } = defaultSpecifier;
          //const localNameIsLowercase = isLowercase(localName);

          /*
          if (sourceBasenameIsLowercase !== localNameIsLowercase) {
            context.report({
              node,
              message: `default import case mismatch, “${sourceBasename}” was imported as “${localName}”`,
            });
          }
          */
          const expectImport = sourceBasename.match(/-/)
            ? sourceBasename
                .split("-")
                .map(
                  (x, i) =>
                    (i
                      ? x.substr(0, 1).toUpperCase()
                      : sourceBasename[0].match(/[A-Z]/)
                      ? x.substr(0, 1).toUpperCase()
                      : x.substr(0, 1).toLowerCase()) + x.substr(1)
                )
                .join("")
            : sourceBasename;
          if (expectImport !== localName) {
            context.report({
              node,
              message: `default import name mismatch, expected “${sourceBasename}” to be imported as “${expectImport}”, was imported as “${localName}”`,
            });
          }
        }
      },
      ExportDefaultDeclaration(node) {
        const {
          declaration: { id, name },
        } = node;
        const exportName = id ? id.name : name;
        const { filename } = getmypluginPathFromContext(context);

        const expected = filename;
        /*
        console.log("DEBUG", {
          localDirname,
          filename,
          base: localDirname.split("/").slice(-2, -1).shift(),
          test: localDirname.match(/^src\/components\//),
          expected,
          exportName,
        });
        */

        if (exportName && expected !== exportName) {
          if (filename.match(/^[A-Z]/)) {
            context.report({
              node,
              message: `default export name mismatch, expected “${expected}”, was exported as “${exportName}”`,
            });
          } else if (exportName.match(/^[A-Z]/)) {
            context.report({
              node,
              message: `default export name mismatch, did not expect an identifier in UpperPascalCase: “${exportName}”`,
            });
          }
        }
      },
    };
  },
};
