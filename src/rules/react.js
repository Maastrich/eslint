const { getmypluginPathFromContext } = require("../eslint-utils");

function isIdentifierAFunctionExpression({ context, identifier }) {
  for (const ancestor of context.getAncestors().reverse()) {
    if (ancestor.type === "FunctionDeclaration") {
      return;
    }
    if (Array.isArray(ancestor.body)) {
      for (const element of ancestor.body) {
        if (element.type === "VariableDeclaration") {
          for (const declaration of element.declarations) {
            if (
              declaration.id.type === "Identifier" &&
              declaration.id.name === identifier &&
              ["ArrowFunctionExpression", "FunctionExpression"].indexOf(
                declaration.init.type
              ) >= 0
            ) {
              return true;
            }
          }
        }
      }
    }
  }
}

module.exports = {
  create: (context) => {
    const FunctionOrArrowExpression = (node) => {
      const { localDirname, scope } = getmypluginPathFromContext(context);
      if (scope || !localDirname.match(/src\/components\//)) {
        return;
      }
      const { params } = node;
      if (!params.length) {
        return;
      }
      const [param] = params;
      if (param.type !== "ObjectPattern") {
        return;
      }
      param.properties.forEach((property) => {
        const { key } = property;
        if (key) {
          const { type: keyType, name: keyName } = key;
          if (keyType !== "Identifier") {
            return;
          }
          if (keyName && keyName.match(/^handle[A-Z]/)) {
            context.report({
              node,
              message: `components must not have a parameter starting with handle, consider renaming to “${key.name.replace(
                /^handle/,
                "on"
              )}”`,
            });
          }
        }
      });
    };
    return {
      FunctionDeclaration: FunctionOrArrowExpression,
      FunctionExpression: FunctionOrArrowExpression,
      ArrowFunctionExpression: FunctionOrArrowExpression,
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          [
            "useCallback",
            "useMemo",
            "useEffect",
            "useRef",
            "useLayoutEffect",
          ].indexOf(node.callee.name) >= 0
        ) {
          const [firstArgument] = node.arguments;
          if (firstArgument.type === "FunctionExpression") {
            context.report({
              node,
              message: `you should use an arrow function instead of a function expression in ${node.callee.name}`,
            });
          }
        }
      },
      JSXExpressionContainer(node) {
        const { scope } = getmypluginPathFromContext(context);
        if (scope) {
          return;
        }
        if (node.expression.type === "ArrowFunctionExpression") {
          context.report({
            node,
            message: `this arrow function expression would be best wrapped in a useCallback()`,
          });
        } else if (node.expression.type === "FunctionExpression") {
          context.report({
            node,
            message: `this function expression would be best wrapped in a useCallback()`,
          });
        } else if (
          node.expression.type === "Identifier" &&
          isIdentifierAFunctionExpression({
            context,
            identifier: node.expression.name,
          })
        ) {
          context.report({
            node,
            message: `this variable maps to a function expression that would be best wrapped in a useCallback()`,
          });
        }
      },

      ExportDefaultDeclaration(node) {
        const { localDirname, scope } = getmypluginPathFromContext(context);
        if (scope || !localDirname.match(/src\/components\//)) {
          return;
        }
        if (node.parent.body[node.parent.body.length - 1] !== node) {
          context.report({
            node,
            message: `export default should be last in components`,
          });
        }
      },
    };
  },
};
