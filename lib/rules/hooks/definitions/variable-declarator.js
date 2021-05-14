"use strict";
exports.__esModule = true;
var context_utils_1 = require("../../../context-utils");
var eslint_utils_1 = require("../../../eslint-utils");
var utils_1 = require("../utils");
function variableDeclarator(_context, node) {
    eslint_utils_1.typeIfyNodes([node.id, node.init], ["Identifier", "CallExpression"], function (id, _a) {
        var callee = _a.callee;
        eslint_utils_1.typeIfyNode(callee, "Identifier", function (_a) {
            var calleeName = _a.name;
            if (calleeName === "useCallback" && utils_1.isInvalidHandlerName(id.name)) {
                var exprectedName = id.name.replace(/^on/, "handle");
                throw new context_utils_1.ContextError("\u201C{{idName}}\u201D would be better written as \u201Cyolo\u201D", id, { idName: id.name, exprectedName: exprectedName }, exprectedName);
            }
        });
    });
}
;
exports["default"] = eslint_utils_1.contextProvider(variableDeclarator);
