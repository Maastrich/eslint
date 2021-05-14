"use strict";
var _a = require("../eslint-utils"), getNodeName = _a.getNodeName, getmypluginPathFromContext = _a.getmypluginPathFromContext;
module.exports = {
    create: function (context) {
        return {
            Program: function (node) {
                var body = node.body;
                var _a = getmypluginPathFromContext(context), ext = _a.ext, filename = _a.filename, localDirname = _a.localDirname, scope = _a.scope;
                // only .js files
                if (ext !== ".js") {
                    context.report({
                        node: node,
                        message: "use only .js as file extension"
                    });
                }
                // only in src
                if (!localDirname.match(/^src\//)) {
                    context.report({
                        node: node,
                        message: "JavaScript files must reside in src/"
                    });
                }
                // index.js valid only in src/components or src/features
                if (filename === "index") {
                    if (!localDirname.match(/^src\/(components|features)\//)) {
                        context.report({
                            node: node,
                            message: "index.js files are not valid in this path"
                        });
                    }
                }
                // scope is valid
                if (scope) {
                    switch (scope) {
                        case "__tests__":
                        case "__tests__/__snapshots__":
                        case "__tests__/__fixtures__":
                        case "__stories__":
                            break;
                        default:
                            return context.report({
                                node: node,
                                message: "scope " + scope + " is not valid"
                            });
                    }
                }
                // app files
                var mApp = localDirname.match(/^src\/app\//);
                if (mApp) {
                    if (filename !== "store") {
                        context.report({
                            node: node,
                            message: "src/app must contain only store.js"
                        });
                    }
                    return;
                }
                // src/features files
                var mFeatureFilename = localDirname.match(/^src\/features\/(?<featureFilename>.*)/);
                if (mFeatureFilename) {
                    var featureFilename = mFeatureFilename.groups.featureFilename;
                    var featureFileparts = featureFilename.split("/");
                    if (featureFileparts.length === 1) {
                        return context.report({
                            node: node,
                            message: "src/features cannot contain JavaScript files, store them in subdirectories"
                        });
                    }
                    else if (featureFileparts.length > 2) {
                        return context.report({
                            node: node,
                            message: "src/features cannot nest more than one subdirectory"
                        });
                    }
                    var featureName = featureFileparts[0];
                    if (!featureName.match(/^[a-z0-9-]+$/)) {
                        context.report({
                            node: node,
                            message: "invalid feature name: " + featureName
                        });
                    }
                    if (!filename.match(/^[a-z][a-zA-Z0-9-]*(\.test)?$/)) {
                        context.report({
                            node: node,
                            message: "invalid file name: " + filename
                        });
                    }
                    return;
                }
                // src/components files
                var mComponentFilename = localDirname.match(/^src\/components\/(?<componentFilename>.*)/);
                if (mComponentFilename) {
                    var componentFilename = mComponentFilename.groups.componentFilename;
                    var componentFileparts = componentFilename.split("/");
                    if (componentFileparts.length === 1) {
                        context.report({
                            node: node,
                            message: "src/components cannot contain JavaScript, store them in subdirectories"
                        });
                    }
                    var mComponent = localDirname.match(/^src\/components\/(?<componentPath>.+)\//);
                    if (mComponent) {
                        var componentPath = mComponent.groups.componentPath;
                        var componentDirectories_1 = componentPath.split("/");
                        var componentName = componentDirectories_1[componentDirectories_1.length - 1];
                        /*
                        console.log({
                          localDirname,
                          componentFilename,
                          componentFileparts,
                          componentName,
                          componentDirectories,
                          scope,
                        });
                        */
                        if (componentDirectories_1.some(function (x) { return !x.match(/^([A-Z][a-z0-9]*)+$/); })) {
                            context.report({
                                node: node,
                                message: "directory name is invalid, must be in upper camel case: " + componentName
                            });
                        }
                        var filenameParts = filename.split(".");
                        if (!((filenameParts[0] === "index" && filenameParts.length === 1) ||
                            ((filenameParts[0] === componentName ||
                                filenameParts[0] === componentName + "Base") &&
                                (filenameParts[1] === undefined ||
                                    ["test", "stories"].indexOf(filenameParts[1]) >= 0) &&
                                filenameParts.length <= 2))) {
                            return context.report({
                                node: node,
                                message: "component file name for component is invalid, must be index.js, `" + componentName + "`, or `" + componentName + "Base`: " + filename
                            });
                        }
                        if (filenameParts[1] === "stories" && scope !== "__stories__") {
                            return context.report({
                                node: node,
                                message: "stories must be in __stories__/"
                            });
                        }
                        if (filenameParts[1] === "test" && scope !== "__tests__") {
                            return context.report({
                                node: node,
                                message: "test must be in __tests__/"
                            });
                        }
                        if (scope === "__tests__" && filenameParts[1] !== "test") {
                            return context.report({
                                node: node,
                                message: "files in __tests__ must be postfixed in \u201C.test.js\u201D"
                            });
                        }
                        if (scope === "__stories__" && filenameParts[1] !== "stories") {
                            return context.report({
                                node: node,
                                message: "files in __stories__ must be postfixed in \u201C.stories.js\u201D"
                            });
                        }
                        if (filename === "index") {
                            if (body.length !== 1) {
                                return context.report({
                                    node: node,
                                    message: "component index.js must contain: export { default } from './" + componentName + "|./" + componentName + "Base';"
                                });
                            }
                            var type = body[0].type;
                            if (type !== "ExportNamedDeclaration") {
                                return context.report({
                                    node: node,
                                    message: "component index.js must contain: export { default } from './" + componentName + "|./" + componentName + "Base';"
                                });
                            }
                            var _b = body[0], specifiers = _b.specifiers, sourceValue = _b.source.value;
                            var _c = specifiers.filter(function (_a) {
                                var type = _a.type;
                                return type === "ExportSpecifier";
                            })[0], localName = _c.local.name, exportedName = _c.exported.name;
                            if (localName !== "default" ||
                                exportedName !== "default" ||
                                (sourceValue !== "./" + componentName &&
                                    sourceValue !== "./" + componentName + "Base")) {
                                return context.report({
                                    node: node,
                                    message: "component index.js must contain: export { default } from './" + componentName + "|./" + componentName + "Base';"
                                });
                            }
                        }
                        else if (filenameParts[1] === undefined) {
                            // filename is not index, make sure we are exporting a default with the same name
                            var defaultExport = body.find(function (_a) {
                                var type = _a.type;
                                return type === "ExportDefaultDeclaration";
                            });
                            var expectedExportName_1 = filename.match(/Base$/)
                                ? componentName + "Base"
                                : "" + componentName;
                            if (!defaultExport) {
                                return context.report({
                                    node: node,
                                    message: "must have a default export named " + expectedExportName_1
                                });
                            }
                            var declaration = defaultExport.declaration;
                            var defaultExportName = getNodeName(declaration);
                            if (defaultExportName !== expectedExportName_1) {
                                return context.report({
                                    node: node,
                                    message: "expected a default export named " + expectedExportName_1 + ", found " + defaultExportName
                                });
                            }
                            var functionDeclaration = body.find(function (node) {
                                return node.type === "FunctionDeclaration" &&
                                    node.id.name === expectedExportName_1;
                            });
                            if (!functionDeclaration) {
                                return context.report({
                                    node: node,
                                    message: "expected " + expectedExportName_1 + " to be a function definition"
                                });
                            }
                            // this file is the main file for this component, it must have a displayName set
                            var expressionStatement = body
                                .filter(function (_a) {
                                var type = _a.type;
                                return type === "ExpressionStatement";
                            })
                                .find(function (_a) {
                                var left = _a.expression.left;
                                if (!left.object || left.object.name !== expectedExportName_1) {
                                    return false;
                                }
                                if (!left.property || left.property.name !== "displayName") {
                                    return false;
                                }
                                return true;
                            });
                            if (expressionStatement) {
                                return context.report({
                                    node: node,
                                    message: expectedExportName_1 + " must not have a displayName"
                                });
                            }
                        }
                        if (componentDirectories_1.some(function (d, i) {
                            return componentDirectories_1
                                .slice(i + 1)
                                .some(function (d2) { return d2.substr(0, d.length) === d; });
                        })) {
                            context.report({
                                node: node,
                                message: "sub-component name must not be prefixed with the name of a parent component: " + componentName
                            });
                        }
                    }
                    return;
                }
                // src/locales files
                var mLocaleFilename = localDirname.match(/^src\/locales\/(?<localFilename>.*)/);
                if (mLocaleFilename) {
                    var localFilename = mLocaleFilename.groups.localFilename;
                    var featureFileparts = localFilename.split("/");
                    if (featureFileparts.length === 1) {
                        return context.report({
                            node: node,
                            message: "src/locales cannot contain JavaScript, store them in subdirectories"
                        });
                    }
                    else if (!localDirname.match(/^src\/locales\/(_build|fr|en)\//)) {
                        return context.report({
                            node: node,
                            message: "invalid locale"
                        });
                    }
                    return;
                }
                // src/theme files
                var mThemeFilename = localDirname.match(/^src\/theme\/(?<localThemename>.*)/);
                if (mThemeFilename) {
                    var localThemename = mThemeFilename.groups.localThemename;
                    var themeFileparts = localThemename.split("/");
                    if (themeFileparts.length > 1) {
                        return context.report({
                            node: node,
                            message: "src/theme cannot contain sub-directories"
                        });
                    }
                    return;
                }
            }
        };
    }
};
