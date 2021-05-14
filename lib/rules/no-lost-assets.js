"use strict";
var path = require("path");
var getmypluginPathFromContext = require("../eslint-utils").getmypluginPathFromContext;
module.exports = {
    create: function (context) {
        return {
            ImportDeclaration: function (node) {
                var _a = getmypluginPathFromContext(context), scope = _a.scope, localDirname = _a.localDirname;
                var sourceValue = node.source.value;
                if (sourceValue.match(/^@/)) {
                    return;
                }
                var ext = path.extname(sourceValue);
                if (!ext || [".js", ".ts"].indexOf(ext) >= 0) {
                    // folder or JS/TS file, ignore
                    return;
                }
                //const filename = context.getFilename();
                var cwd = path.normalize(context.getCwd());
                var importedFile = path.normalize(cwd + "/" + localDirname + "/" + sourceValue);
                var expectedAssetDir = path.normalize(cwd + "/src/assets");
                /*
                console.log({
                  sourceValue,
                  filename,
                  cwd,
                  importedFile,
                  expectedAssetDir,
                });
                */
                if (!scope &&
                    importedFile.substr(0, expectedAssetDir.length) !== expectedAssetDir) {
                    context.report({
                        node: node,
                        message: "expected asset to be imported from " + expectedAssetDir
                    });
                }
            }
        };
    }
};
