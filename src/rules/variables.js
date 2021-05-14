const { isCamelCase, isPascalCase } = require("../naming");
const { getmypluginPathFromContext } = require("../eslint-utils");

module.exports = {
  create: (context) => {
    return {
      VariableDeclaration(node) {
        const { kind, declarations } = node;
        if (kind === "var") {
          context.report({
            node,
            message: "do not use var",
          });
        }
        if (declarations.length > 1) {
          context.report({
            node,
            message: "do not declare several variables on the same line",
          });
        }
        const [
          {
            id: { name, type },
            init,
          },
        ] = declarations;
        if (type === "Identifier") {
          if (
            !init ||
            [
              "ArrowFunctionExpression",
              "FunctionExpression",
              "TaggedTemplateExpression",
              "CallExpression",
            ].indexOf(init.type) === -1
          ) {
            // constant/variable
            if (!isCamelCase(name)) {
              context.report({
                node,
                message:
                  kind === "const"
                    ? `constant “${name}” should be in lower camel-case`
                    : `variable “${name}” should be in lower camel-case`,
              });
            }
          }
        }
      },

      RestElement(node) {
        const {
          argument: { name },
        } = node;
        if (!isCamelCase(name)) {
          context.report({
            node,
            message: `rest variable “${name}” should be in lower camel-case`,
          });
        }
      },

      ArrayPattern(node) {
        const { elements } = node;
        elements.filter(Boolean).forEach(({ name }) => {
          if (name && !isCamelCase(name)) {
            context.report({
              node,
              message: `destructuring array item “${name}” should be in lower camel-case`,
            });
          }
        });
      },

      ObjectPattern(node) {
        const { properties } = node;
        properties.forEach(({ value }) => {
          if (
            value &&
            value.type === "Identifier" &&
            !isCamelCase(value.name) &&
            !isPascalCase(value.name)
          ) {
            context.report({
              node,
              message: `destructuring property “${value.name}” should be in lower camelCase or upper PascalCase`,
            });
          }
        });
      },

      ArrowFunctionExpression(node) {
        const { params } = node;
        params.forEach(({ type, name, left }) => {
          const paramName =
            type === "Identifier" ? name : left ? left.name : null;
          if (paramName && !isCamelCase(paramName)) {
            context.report({
              node,
              message: `arrow function parameter name “${name}” should be in lower camel-case`,
            });
          }
        });
      },

      FunctionDeclaration(node) {
        const { ext, filename, localDirname } = getmypluginPathFromContext(
          context
        );
        if (!node.id) {
          return;
        }
        const {
          params,
          id: { name: functionName },
        } = node;
        if (isPascalCase(functionName)) {
          if (!localDirname.match(/src\/(components|theme|entry-points)\//)) {
            return context.report({
              node,
              message: `function component “${functionName}” should be in src/components/ or src/theme/ or src/entry-points/`,
            });
          }
          const expectedFunctionComponentName = filename;

          if (functionName !== expectedFunctionComponentName) {
            context.report({
              node,
              message: `function component ${functionName} is not valid within the file ${filename}${ext}, please factor the component out`,
            });
          }
        } else if (!isCamelCase(functionName)) {
          context.report({
            node,
            message: `function name “${functionName}” should be in lower camel-case`,
          });
        }
        params.forEach(({ type, name, left }) => {
          const paramName =
            type === "Identifier" ? name : left ? left.name : null;
          if (paramName && !isCamelCase(paramName)) {
            context.report({
              node,
              message: `function parameter name “${paramName}” should be in lower camel-case`,
            });
          }
        });
      },
    };
  },
};
