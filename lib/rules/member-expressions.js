"use strict";
var isIntrisic = require("../intrinsic").isIntrisic;
var allowedProperties = ["bind"];
module.exports = {
    create: function (context) {
        return {
            CallExpression: function (node) {
                var callee = node.callee;
                if (callee && callee.type === "MemberExpression") {
                    var object = callee.object, property = callee.property;
                    if (object &&
                        property &&
                        object.type === "Identifier" &&
                        property.type === "Identifier") {
                        var objectName = object.name;
                        var propertyName = property.name;
                        if (objectName &&
                            propertyName &&
                            objectName.match(/^[A-Z]/) &&
                            !isIntrisic({ objectName: objectName, propertyName: propertyName }) &&
                            allowedProperties.indexOf(propertyName) === -1) {
                            context.report({
                                node: node,
                                message: "do not call \u201C" + objectName + "." + propertyName + "\u201D, please import \u201C" + propertyName + "\u201D in the current scope"
                            });
                        }
                    }
                    if (property && property.type === "Identifier") {
                        var propertyName = property.name;
                        if (["then", "catch", "finally"].indexOf(propertyName) >= 0) {
                            context.report({
                                node: node,
                                message: "do not call \u201C." + propertyName + "\u201D, please use async functions"
                            });
                        }
                    }
                }
            }
        };
    }
};
