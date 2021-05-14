"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var _a = require("../utils"), regexSort = _a.regexSort, arrayEquals = _a.arrayEquals;
var program = function (context) { return function (node) {
    var body = node.body;
    var imports = body
        .filter(function (_a) {
        var type = _a.type;
        return type === "ImportDeclaration";
    })
        .map(function (_a) {
        var value = _a.source.value;
        return value;
    });
    var expectedImports = regexSort(__spreadArray([], imports), [
        /^react$/,
        /^@(.+)\/(.+)/,
        /^(?!([.]?[.]\/))/,
        /^([.]{2}\/.*)/,
        /^([.]\/.*)/, // from './foo'
    ]);
    if (!arrayEquals(imports, expectedImports)) {
        context.report({
            node: node,
            message: "the order of imports is not compliant with myplugin policy, received: " + imports.join(",") + ", expected: " + expectedImports.join(",")
        });
    }
}; };
module.exports = program;
