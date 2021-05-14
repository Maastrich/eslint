"use strict";
exports.__esModule = true;
var eslint_utils_1 = require("../../../eslint-utils");
var eslint_utils_2 = require("../../../eslint-utils");
var utils_1 = require("../utils");
var config_1 = require("../../../config");
var context_utils_1 = require("../../../context-utils");
function callExpression(context, node) {
    console.log('callExpression');
    var _a = eslint_utils_2.getmypluginPathFromContext(context), filename = _a.filename, localDirname = _a.localDirname;
    eslint_utils_1.typeIfyNode(node.callee, "Identifier", function (_a) {
        var name = _a.name;
        if (utils_1.isHookName(name) &&
            localDirname.match(/src\/components\//) &&
            !config_1.getConfig().isValidHookName(name) &&
            !filename.match(/Base$/)) {
            var expectedLocation = localDirname.split("/").slice(-2, -1)[0] + "Base";
            throw new context_utils_1.ContextError("You cannnot call {{name}} in UI components, consider moving the hook into \u201C{{expectedLocation}}", node.callee, { name: name, expectedLocation: expectedLocation });
        }
    });
}
;
exports["default"] = eslint_utils_1.contextProvider(callExpression);
