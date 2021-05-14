"use strict";
var path = require("path");
module.exports = {
    create: function (context) {
        return {
            ImportDeclaration: function (node) {
                var sourceValue = node.source.value;
                var ext = path.extname(sourceValue);
                if (ext === ".css") {
                    context.report({
                        node: node,
                        message: "do not import CSS files"
                    });
                }
                if (ext === ".scss") {
                    context.report({
                        node: node,
                        message: "do not import SCSS files"
                    });
                }
            }
        };
    }
};
