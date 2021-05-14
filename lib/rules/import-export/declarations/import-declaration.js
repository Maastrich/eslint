"use strict";
var path = require("path");
var importDeclaration = function (context) { return function (node) {
    var sourceValue = node.source.value, specifiers = node.specifiers;
    if (sourceValue.match(/^\//)) {
        context.report({
            node: node,
            message: "do not use absolute path imports"
        });
    }
    if (sourceValue.match(/^(?!@|\.{1,2}|\/).+\/.+$/)) {
        context.report({
            node: node,
            message: "do not import a submodule except for scope imports"
        });
    }
    var defaultSpecifier = specifiers.find(function (_a) {
        var type = _a.type;
        return type === "ImportDefaultSpecifier";
    });
    if (sourceValue.match(/^[./]/) && defaultSpecifier) {
        var sourceBasename_1 = path.basename(sourceValue, path.extname(sourceValue));
        //const sourceBasenameIsLowercase = isLowercase(sourceBasename);
        var localName = defaultSpecifier.local.name;
        //const localNameIsLowercase = isLowercase(localName);
        /*
        if (sourceBasenameIsLowercase !== localNameIsLowercase) {
          context.report({
            node,
            message: `default import case mismatch, “${sourceBasename}” was imported as “${localName}”`,
          });
        }
        */
        var expectImport = sourceBasename_1.match(/-/)
            ? sourceBasename_1
                .split("-")
                .map(function (x, i) {
                return (i
                    ? x.substr(0, 1).toUpperCase()
                    : sourceBasename_1[0].match(/[A-Z]/)
                        ? x.substr(0, 1).toUpperCase()
                        : x.substr(0, 1).toLowerCase()) + x.substr(1);
            })
                .join("")
            : sourceBasename_1;
        if (expectImport !== localName) {
            context.report({
                node: node,
                message: "default import name mismatch, expected \u201C" + sourceBasename_1 + "\u201D to be imported as \u201C" + expectImport + "\u201D, was imported as \u201C" + localName + "\u201D"
            });
        }
    }
}; };
module.exports = importDeclaration;
