const { getmypluginPathFromContext } = require("../eslint-utils");

function isHookName(s) {
  return /^use[A-Z0-9].*$/.test(s);
}
module.exports = {
  create: (context) => {
    return {
      CallExpression(node) {
        const { filename, localDirname } = getmypluginPathFromContext(
          context
        );
        const {
          callee: { name },
        } = node;
        if (
          isHookName(name) &&
          localDirname.match(/src\/components\//) &&
          !filename.match(/Base$/)
        ) {
          return context.report({
            node,
            message: `you cannnot call hooks in UI components, consider moving the hook into “${
              localDirname.split("/").slice(-2, -1)[0]
            }Base”`,
          });
        }
      },
      VariableDeclarator(node) {
        const { id, init } = node;
        if (!init) {
          return;
        }
        if (id.type !== "Identifier") {
          return;
        }
        if (init.type !== "CallExpression") {
          return;
        }
        const { name: idName } = id;
        const { callee } = init;
        if (callee.type !== "Identifier") {
          return;
        }
        const { name: calleeName } = callee;
        if (calleeName === "useCallback" && idName.match(/^on[A-Z]/)) {
          context.report({
            node,
            message: `“${idName}” would be better written as “${idName.replace(
              /^on/,
              "handle"
            )}”`,
          });
        }
      },
    };
  },
};
