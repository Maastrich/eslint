"use strict";
var _a = require("../naming"), isCamelCase = _a.isCamelCase, isPascalCase = _a.isPascalCase;
var getmypluginPathFromContext = require("../eslint-utils").getmypluginPathFromContext;
module.exports = {
    create: function (context) {
        return {
            VariableDeclaration: function (node) {
                var kind = node.kind, declarations = node.declarations;
                if (kind === "var") {
                    context.report({
                        node: node,
                        message: "do not use var"
                    });
                }
                if (declarations.length > 1) {
                    context.report({
                        node: node,
                        message: "do not declare several variables on the same line"
                    });
                }
                var _a = declarations[0], _b = _a.id, name = _b.name, type = _b.type, init = _a.init;
                if (type === "Identifier") {
                    if (!init ||
                        [
                            "ArrowFunctionExpression",
                            "FunctionExpression",
                            "TaggedTemplateExpression",
                            "CallExpression",
                        ].indexOf(init.type) === -1) {
                        // constant/variable
                        if (!isCamelCase(name)) {
                            context.report({
                                node: node,
                                message: kind === "const"
                                    ? "constant \u201C" + name + "\u201D should be in lower camel-case"
                                    : "variable \u201C" + name + "\u201D should be in lower camel-case"
                            });
                        }
                    }
                }
            },
            RestElement: function (node) {
                var name = node.argument.name;
                if (!isCamelCase(name)) {
                    context.report({
                        node: node,
                        message: "rest variable \u201C" + name + "\u201D should be in lower camel-case"
                    });
                }
            },
            ArrayPattern: function (node) {
                var elements = node.elements;
                elements.filter(Boolean).forEach(function (_a) {
                    var name = _a.name;
                    if (name && !isCamelCase(name)) {
                        context.report({
                            node: node,
                            message: "destructuring array item \u201C" + name + "\u201D should be in lower camel-case"
                        });
                    }
                });
            },
            ObjectPattern: function (node) {
                var properties = node.properties;
                properties.forEach(function (_a) {
                    var value = _a.value;
                    if (value &&
                        value.type === "Identifier" &&
                        !isCamelCase(value.name) &&
                        !isPascalCase(value.name)) {
                        context.report({
                            node: node,
                            message: "destructuring property \u201C" + value.name + "\u201D should be in lower camelCase or upper PascalCase"
                        });
                    }
                });
            },
            ArrowFunctionExpression: function (node) {
                var params = node.params;
                params.forEach(function (_a) {
                    var type = _a.type, name = _a.name, left = _a.left;
                    var paramName = type === "Identifier" ? name : left ? left.name : null;
                    if (paramName && !isCamelCase(paramName)) {
                        context.report({
                            node: node,
                            message: "arrow function parameter name \u201C" + name + "\u201D should be in lower camel-case"
                        });
                    }
                });
            },
            FunctionDeclaration: function (node) {
                var _a = getmypluginPathFromContext(context), ext = _a.ext, filename = _a.filename, localDirname = _a.localDirname;
                if (!node.id) {
                    return;
                }
                var params = node.params, functionName = node.id.name;
                if (isPascalCase(functionName)) {
                    if (!localDirname.match(/src\/(components|theme|entry-points)\//)) {
                        return context.report({
                            node: node,
                            message: "function component \u201C" + functionName + "\u201D should be in src/components/ or src/theme/ or src/entry-points/"
                        });
                    }
                    var expectedFunctionComponentName = filename;
                    if (functionName !== expectedFunctionComponentName) {
                        context.report({
                            node: node,
                            message: "function component " + functionName + " is not valid within the file " + filename + ext + ", please factor the component out"
                        });
                    }
                }
                else if (!isCamelCase(functionName)) {
                    context.report({
                        node: node,
                        message: "function name \u201C" + functionName + "\u201D should be in lower camel-case"
                    });
                }
                params.forEach(function (_a) {
                    var type = _a.type, name = _a.name, left = _a.left;
                    var paramName = type === "Identifier" ? name : left ? left.name : null;
                    if (paramName && !isCamelCase(paramName)) {
                        context.report({
                            node: node,
                            message: "function parameter name \u201C" + paramName + "\u201D should be in lower camel-case"
                        });
                    }
                });
            }
        };
    }
};
