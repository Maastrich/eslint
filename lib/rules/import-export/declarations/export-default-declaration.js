"use strict";
var getmypluginPathFromContext = require("../../../eslint-utils").getmypluginPathFromContext;
var exportDefaultDeclaration = function (context) { return function (node) {
    var _a = node.declaration, id = _a.id, name = _a.name;
    var exportName = id ? id.name : name;
    var filename = getmypluginPathFromContext(context).filename;
    var expected = filename;
    /*
    console.log("DEBUG", {
      localDirname,
      filename,
      base: localDirname.split("/").slice(-2, -1).shift(),
      test: localDirname.match(/^src\/components\//),
      expected,
      exportName,
    });
    */
    if (exportName && expected !== exportName) {
        if (filename.match(/^[A-Z]/)) {
            context.report({
                node: node,
                message: "default export name mismatch, expected \u201C" + expected + "\u201D, was exported as \u201C" + exportName + "\u201D"
            });
        }
        else if (exportName.match(/^[A-Z]/)) {
            context.report({
                node: node,
                message: "default export name mismatch, did not expect an identifier in UpperPascalCase: \u201C" + exportName + "\u201D"
            });
        }
    }
}; };
module.exports = exportDefaultDeclaration;
