"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.typeIfyNode = exports.typeIfyNodes = exports.isJSXText = exports.contextProvider = exports.arrayEquals = exports.regexSort = exports.getmypluginPathFromContext = exports.getNodeName = void 0;
var myplugin_path_1 = require("./myplugin-path");
var typescript_natural_sort_1 = __importDefault(require("typescript-natural-sort"));
var context_utils_1 = require("./context-utils");
function getNodeName(node) {
    var type = node.type, name = node.name;
    if (type === "Identifier") {
        return name;
    }
    var id = node.id;
    if (id) {
        var type_1 = id.type, name_1 = id.name;
        if (type_1 === "Identifier") {
            return name_1;
        }
    }
}
exports.getNodeName = getNodeName;
;
function getmypluginPathFromContext(context) {
    var filepath = context.getFilename();
    var rootDir = context.getCwd() + "/";
    return myplugin_path_1.parsemypluginPath({ filepath: filepath, rootDir: rootDir });
}
exports.getmypluginPathFromContext = getmypluginPathFromContext;
;
function presetIndex(input, patterns) {
    for (var i = 0; i < patterns.length; ++i) {
        if (patterns[i].test(input)) {
            return i;
        }
    }
    return patterns.length + 1;
}
function regexSort(list, patterns) {
    var importGroups = {};
    list.forEach(function (c) {
        importGroups[presetIndex(c, patterns)] = __spreadArray(__spreadArray([], (importGroups[presetIndex(c, patterns)] || [])), [
            c,
        ]);
    });
    var importGroupsArr = Object.keys(importGroups).map(function (groupKey) {
        var group = importGroups[groupKey];
        return {
            index: groupKey,
            group: group.sort(function (a, b) {
                //a.localeCompare(b, undefined, { sensitivity: "base" })
                return typescript_natural_sort_1["default"](a, b);
            })
        };
    });
    importGroupsArr.sort(function (a, b) {
        return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
    });
    var sorted = [];
    importGroupsArr
        .map(function (importPath) { return importPath.group; })
        .forEach(function (group) { return sorted.push.apply(sorted, group); });
    return sorted;
}
exports.regexSort = regexSort;
;
function arrayEquals(source, compare) {
    return (Array.isArray(source) &&
        Array.isArray(compare) &&
        source.length === compare.length &&
        source.every(function (val, index) { return val === compare[index]; }));
}
exports.arrayEquals = arrayEquals;
;
function contextProvider(cb) {
    return (function (context) { return function (node) {
        try {
            cb(context, node);
        }
        catch (e) {
            if (e.type === "ContextError") {
                context_utils_1.report(context, e);
            }
            else {
                console.error(e.message);
            }
        }
    }; });
}
exports.contextProvider = contextProvider;
function isJSXText(node) {
    // just a nifty utility because parsers don't always agree
    // how to represent text in JSX
    return node.type == "JSXText" || node.type === "Literal";
}
exports.isJSXText = isJSXText;
;
function typeIfyNodes(nodes, types, cb) {
    var _a, _b;
    if (((_a = nodes[0]) === null || _a === void 0 ? void 0 : _a.type) === types[0] && ((_b = nodes[1]) === null || _b === void 0 ? void 0 : _b.type) === types[1]) {
        cb(nodes[0], nodes[1]);
    }
}
exports.typeIfyNodes = typeIfyNodes;
function typeIfyNode(node, type, cb) {
    if ((node === null || node === void 0 ? void 0 : node.type) === type) {
        cb(node);
    }
}
exports.typeIfyNode = typeIfyNode;
