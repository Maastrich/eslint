const path = require("path");

module.exports = {
  create: (context) => {
    return {
      ImportDeclaration(node) {
        const {
          source: { value: sourceValue },
        } = node;
        const ext = path.extname(sourceValue);
        if (ext === ".css") {
          context.report({
            node,
            message: "do not import CSS files",
          });
        }
        if (ext === ".scss") {
          context.report({
            node,
            message: "do not import SCSS files",
          });
        }
      },
    };
  },
};
