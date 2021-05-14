const {
  getNodeName,
  getmypluginPathFromContext,
} = require("../eslint-utils");

module.exports = {
  create: (context) => {
    return {
      Program(node) {
        const { body } = node;
        const {
          ext,
          filename,
          localDirname,
          scope,
        } = getmypluginPathFromContext(context);

        // only .js files
        if (ext !== ".js") {
          context.report({
            node,
            message: "use only .js as file extension",
          });
        }

        // only in src
        if (!localDirname.match(/^src\//)) {
          context.report({
            node,
            message: "JavaScript files must reside in src/",
          });
        }

        // index.js valid only in src/components or src/features
        if (filename === "index") {
          if (!localDirname.match(/^src\/(components|features)\//)) {
            context.report({
              node,
              message: "index.js files are not valid in this path",
            });
          }
        }

        // scope is valid
        if (scope) {
          switch (scope) {
            case "__tests__":
            case "__tests__/__snapshots__":
            case "__tests__/__fixtures__":
            case "__stories__":
              break;
            default:
              return context.report({
                node,
                message: `scope ${scope} is not valid`,
              });
          }
        }

        // app files
        let mApp = localDirname.match(/^src\/app\//);
        if (mApp) {
          if (filename !== "store") {
            context.report({
              node,
              message: "src/app must contain only store.js",
            });
          }
          return;
        }

        // src/features files
        let mFeatureFilename = localDirname.match(
          /^src\/features\/(?<featureFilename>.*)/
        );
        if (mFeatureFilename) {
          const { featureFilename } = mFeatureFilename.groups;
          const featureFileparts = featureFilename.split("/");
          if (featureFileparts.length === 1) {
            return context.report({
              node,
              message:
                "src/features cannot contain JavaScript files, store them in subdirectories",
            });
          } else if (featureFileparts.length > 2) {
            return context.report({
              node,
              message: "src/features cannot nest more than one subdirectory",
            });
          }
          const [featureName] = featureFileparts;
          if (!featureName.match(/^[a-z0-9-]+$/)) {
            context.report({
              node,
              message: `invalid feature name: ${featureName}`,
            });
          }
          if (!filename.match(/^[a-z][a-zA-Z0-9-]*(\.test)?$/)) {
            context.report({
              node,
              message: `invalid file name: ${filename}`,
            });
          }
          return;
        }

        // src/components files
        let mComponentFilename = localDirname.match(
          /^src\/components\/(?<componentFilename>.*)/
        );
        if (mComponentFilename) {
          const { componentFilename } = mComponentFilename.groups;
          const componentFileparts = componentFilename.split("/");
          if (componentFileparts.length === 1) {
            context.report({
              node,
              message:
                "src/components cannot contain JavaScript, store them in subdirectories",
            });
          }
          let mComponent = localDirname.match(
            /^src\/components\/(?<componentPath>.+)\//
          );
          if (mComponent) {
            const { componentPath } = mComponent.groups;
            const componentDirectories = componentPath.split("/");
            const componentName =
              componentDirectories[componentDirectories.length - 1];
            /*
            console.log({
              localDirname,
              componentFilename,
              componentFileparts,
              componentName,
              componentDirectories,
              scope,
            });
            */
            if (
              componentDirectories.some((x) => !x.match(/^([A-Z][a-z0-9]*)+$/))
            ) {
              context.report({
                node,
                message: `directory name is invalid, must be in upper camel case: ${componentName}`,
              });
            }

            const filenameParts = filename.split(".");
            if (
              !(
                (filenameParts[0] === "index" && filenameParts.length === 1) ||
                ((filenameParts[0] === componentName ||
                  filenameParts[0] === `${componentName}Base`) &&
                  (filenameParts[1] === undefined ||
                    ["test", "stories"].indexOf(filenameParts[1]) >= 0) &&
                  filenameParts.length <= 2)
              )
            ) {
              return context.report({
                node,
                message: `component file name for component is invalid, must be index.js, \`${componentName}\`, or \`${componentName}Base\`: ${filename}`,
              });
            }
            if (filenameParts[1] === "stories" && scope !== "__stories__") {
              return context.report({
                node,
                message: `stories must be in __stories__/`,
              });
            }
            if (filenameParts[1] === "test" && scope !== "__tests__") {
              return context.report({
                node,
                message: `test must be in __tests__/`,
              });
            }
            if (scope === "__tests__" && filenameParts[1] !== "test") {
              return context.report({
                node,
                message: `files in __tests__ must be postfixed in “.test.js”`,
              });
            }
            if (scope === "__stories__" && filenameParts[1] !== "stories") {
              return context.report({
                node,
                message: `files in __stories__ must be postfixed in “.stories.js”`,
              });
            }

            if (filename === "index") {
              if (body.length !== 1) {
                return context.report({
                  node,
                  message: `component index.js must contain: export { default } from './${componentName}|./${componentName}Base';`,
                });
              }

              const [{ type }] = body;
              if (type !== "ExportNamedDeclaration") {
                return context.report({
                  node,
                  message: `component index.js must contain: export { default } from './${componentName}|./${componentName}Base';`,
                });
              }
              const [
                {
                  specifiers,
                  source: { value: sourceValue },
                },
              ] = body;
              const [
                {
                  local: { name: localName },
                  exported: { name: exportedName },
                },
              ] = specifiers.filter(({ type }) => type === "ExportSpecifier");

              if (
                localName !== "default" ||
                exportedName !== "default" ||
                (sourceValue !== `./${componentName}` &&
                  sourceValue !== `./${componentName}Base`)
              ) {
                return context.report({
                  node,
                  message: `component index.js must contain: export { default } from './${componentName}|./${componentName}Base';`,
                });
              }
            } else if (filenameParts[1] === undefined) {
              // filename is not index, make sure we are exporting a default with the same name
              const defaultExport = body.find(
                ({ type }) => type === "ExportDefaultDeclaration"
              );
              const expectedExportName = filename.match(/Base$/)
                ? `${componentName}Base`
                : `${componentName}`;
              if (!defaultExport) {
                return context.report({
                  node,
                  message: `must have a default export named ${expectedExportName}`,
                });
              }
              const { declaration } = defaultExport;
              const defaultExportName = getNodeName(declaration);
              if (defaultExportName !== expectedExportName) {
                return context.report({
                  node,
                  message: `expected a default export named ${expectedExportName}, found ${defaultExportName}`,
                });
              }

              const functionDeclaration = body.find(
                (node) =>
                  node.type === "FunctionDeclaration" &&
                  node.id.name === expectedExportName
              );
              if (!functionDeclaration) {
                return context.report({
                  node,
                  message: `expected ${expectedExportName} to be a function definition`,
                });
              }

              // this file is the main file for this component, it must have a displayName set
              const expressionStatement = body
                .filter(({ type }) => type === "ExpressionStatement")
                .find(({ expression: { left } }) => {
                  if (!left.object || left.object.name !== expectedExportName) {
                    return false;
                  }
                  if (!left.property || left.property.name !== "displayName") {
                    return false;
                  }
                  return true;
                });
              if (expressionStatement) {
                return context.report({
                  node,
                  message: `${expectedExportName} must not have a displayName`,
                });
              }
            }

            if (
              componentDirectories.some((d, i) =>
                componentDirectories
                  .slice(i + 1)
                  .some((d2) => d2.substr(0, d.length) === d)
              )
            ) {
              context.report({
                node,
                message: `sub-component name must not be prefixed with the name of a parent component: ${componentName}`,
              });
            }
          }

          return;
        }

        // src/locales files
        let mLocaleFilename = localDirname.match(
          /^src\/locales\/(?<localFilename>.*)/
        );
        if (mLocaleFilename) {
          const { localFilename } = mLocaleFilename.groups;
          const featureFileparts = localFilename.split("/");
          if (featureFileparts.length === 1) {
            return context.report({
              node,
              message:
                "src/locales cannot contain JavaScript, store them in subdirectories",
            });
          } else if (!localDirname.match(/^src\/locales\/(_build|fr|en)\//)) {
            return context.report({
              node,
              message: "invalid locale",
            });
          }
          return;
        }

        // src/theme files
        let mThemeFilename = localDirname.match(
          /^src\/theme\/(?<localThemename>.*)/
        );
        if (mThemeFilename) {
          const { localThemename } = mThemeFilename.groups;
          const themeFileparts = localThemename.split("/");
          if (themeFileparts.length > 1) {
            return context.report({
              node,
              message: "src/theme cannot contain sub-directories",
            });
          }
          return;
        }
      },
    };
  },
};
