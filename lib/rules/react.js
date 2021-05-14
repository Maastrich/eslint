"use strict";
var getmypluginPathFromContext = require("../eslint-utils").getmypluginPathFromContext;
function isIdentifierAFunctionExpression(_a) {
    var context = _a.context, identifier = _a.identifier;
    for (var _i = 0, _b = context.getAncestors().reverse(); _i < _b.length; _i++) {
        var ancestor = _b[_i];
        if (ancestor.type === "FunctionDeclaration") {
            return;
        }
        if (Array.isArray(ancestor.body)) {
            for (var _c = 0, _d = ancestor.body; _c < _d.length; _c++) {
                var element = _d[_c];
                if (element.type === "VariableDeclaration") {
                    for (var _e = 0, _f = element.declarations; _e < _f.length; _e++) {
                        var declaration = _f[_e];
                        if (declaration.id.type === "Identifier" &&
                            declaration.id.name === identifier &&
                            ["ArrowFunctionExpression", "FunctionExpression"].indexOf(declaration.init.type) >= 0) {
                            return true;
                        }
                    }
                }
            }
        }
    }
}
module.exports = {
    create: function (context) {
        var FunctionOrArrowExpression = function (node) {
            var _a = getmypluginPathFromContext(context), localDirname = _a.localDirname, scope = _a.scope;
            if (scope || !localDirname.match(/src\/components\//)) {
                return;
            }
            var params = node.params;
            if (!params.length) {
                return;
            }
            var param = params[0];
            if (param.type !== "ObjectPattern") {
                return;
            }
            param.properties.forEach(function (property) {
                var key = property.key;
                if (key) {
                    var keyType = key.type, keyName = key.name;
                    if (keyType !== "Identifier") {
                        return;
                    }
                    if (keyName && keyName.match(/^handle[A-Z]/)) {
                        context.report({
                            node: node,
                            message: "components must not have a parameter starting with handle, consider renaming to \u201C" + key.name.replace(/^handle/, "on") + "\u201D"
                        });
                    }
                }
            });
        };
        return {
            FunctionDeclaration: FunctionOrArrowExpression,
            FunctionExpression: FunctionOrArrowExpression,
            ArrowFunctionExpression: FunctionOrArrowExpression,
            CallExpression: function (node) {
                if (node.callee.type === "Identifier" &&
                    [
                        "useCallback",
                        "useMemo",
                        "useEffect",
                        "useRef",
                        "useLayoutEffect",
                    ].indexOf(node.callee.name) >= 0) {
                    var firstArgument = node.arguments[0];
                    if (firstArgument.type === "FunctionExpression") {
                        context.report({
                            node: node,
                            message: "you should use an arrow function instead of a function expression in " + node.callee.name
                        });
                    }
                }
            },
            JSXExpressionContainer: function (node) {
                var scope = getmypluginPathFromContext(context).scope;
                if (scope) {
                    return;
                }
                if (node.expression.type === "ArrowFunctionExpression") {
                    context.report({
                        node: node,
                        message: "this arrow function expression would be best wrapped in a useCallback()"
                    });
                }
                else if (node.expression.type === "FunctionExpression") {
                    context.report({
                        node: node,
                        message: "this function expression would be best wrapped in a useCallback()"
                    });
                }
                else if (node.expression.type === "Identifier" &&
                    isIdentifierAFunctionExpression({
                        context: context,
                        identifier: node.expression.name
                    })) {
                    context.report({
                        node: node,
                        message: "this variable maps to a function expression that would be best wrapped in a useCallback()"
                    });
                }
            },
            ExportDefaultDeclaration: function (node) {
                var _a = getmypluginPathFromContext(context), localDirname = _a.localDirname, scope = _a.scope;
                if (scope || !localDirname.match(/src\/components\//)) {
                    return;
                }
                if (node.parent.body[node.parent.body.length - 1] !== node) {
                    context.report({
                        node: node,
                        message: "export default should be last in components"
                    });
                }
            }
        };
    }
};
