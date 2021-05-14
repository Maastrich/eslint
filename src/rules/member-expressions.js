const { isIntrisic } = require("../intrinsic");

const allowedProperties = ["bind"];

module.exports = {
  create: (context) => {
    return {
      CallExpression(node) {
        const { callee } = node;
        if (callee && callee.type === "MemberExpression") {
          const { object, property } = callee;
          if (
            object &&
            property &&
            object.type === "Identifier" &&
            property.type === "Identifier"
          ) {
            const { name: objectName } = object;
            const { name: propertyName } = property;
            if (
              objectName &&
              propertyName &&
              objectName.match(/^[A-Z]/) &&
              !isIntrisic({ objectName, propertyName }) &&
              allowedProperties.indexOf(propertyName) === -1
            ) {
              context.report({
                node,
                message: `do not call “${objectName}.${propertyName}”, please import “${propertyName}” in the current scope`,
              });
            }
          }
          if (property && property.type === "Identifier") {
            const { name: propertyName } = property;
            if (["then", "catch", "finally"].indexOf(propertyName) >= 0) {
              context.report({
                node,
                message: `do not call “.${propertyName}”, please use async functions`,
              });
            }
          }
        }
      },
    };
  },
};
