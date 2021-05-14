"use strict";
var _a = require("../eslint-utils"), getmypluginPathFromContext = _a.getmypluginPathFromContext, isJSXText = _a.isJSXText;
var path = require("path");
function getLinguiComponentNames(context) {
    var sourceCode = context.getSourceCode();
    var names = {
        Trans: "@@notbeingused@@",
        Plural: "@@notbeingused@@",
        SelectOrdinal: "@@notbeingused@@",
        Select: "@@notbeingused@@",
        t: "@@notbeingused@@",
        plural: "@@notbeingused@@",
        selectOrdinal: "@@notbeingused@@",
        select: "@@notbeingused@@"
    };
    var program = sourceCode.ast;
    program.body
        .filter(function (_a) {
        var type = _a.type;
        return type === "ImportDeclaration";
    })
        .filter(function (_a) {
        var value = _a.source.value;
        return value === "@lingui/macro";
    })
        .forEach(function (_a) {
        var specifiers = _a.specifiers;
        specifiers
            .filter(function (_a) {
            var type = _a.type;
            return type === "ImportSpecifier";
        })
            .forEach(function (_a) {
            var importedName = _a.imported.name, localName = _a.local.name;
            if (importedName in names) {
                names[importedName] = localName;
            }
        });
    });
    return names;
}
function getExpectedValueStart(context) {
    var _a = getmypluginPathFromContext(context), filename = _a.filename, localDirname = _a.localDirname;
    var prefix = path
        .dirname(localDirname)
        .replace(/^src\/components\/?/, "")
        .replace(/\//g, ".");
    var expectedValueStart = "#" + prefix + (prefix ? "." : "") + filename + ".";
    return expectedValueStart;
}
function isUsageIncorrect(_a) {
    var value = _a.value, expectedValueStart = _a.expectedValueStart;
    if (value.substr(0, expectedValueStart.length) !== expectedValueStart) {
        return true;
    }
    var tail = value.substr(expectedValueStart.length);
    if (!tail.match(/^[a-z]/)) {
        return true;
    }
}
function nodeToApproximateStringLiteral(node) {
    if (isJSXText(node)) {
        return node.value.replace(/^\s+/, "");
    }
    var type = node.type;
    if (type === "JSXExpressionContainer") {
        return nodeToApproximateStringLiteral(node.expression);
    }
    if (type === "TemplateLiteral") {
        return nodeToApproximateStringLiteral(node.quasis[0]);
    }
    if (type === "TemplateElement") {
        return node.value.cooked;
    }
    return null;
}
function checkUsageTrans(_a) {
    var context = _a.context, node = _a.node, expectedValueStart = _a.expectedValueStart;
    var children = node.children;
    if (children[0]) {
        var value = nodeToApproximateStringLiteral(children[0]);
        if (value) {
            if (isUsageIncorrect({ value: value, expectedValueStart: expectedValueStart })) {
                context.report({
                    node: node,
                    message: "expected <Trans> string to begin with \u201C" + expectedValueStart + "\u201D followed by a lower-case character, found: " + JSON.stringify(value)
                });
            }
        }
        else {
            context.report({
                node: node,
                message: "expected <Trans> element to contain a string that starts with " + expectedValueStart + ", found " + children.length + " children"
            });
        }
    }
    else {
        context.report({
            node: node,
            message: "expected <Trans> element to contain a string that starts with " + expectedValueStart + ", found " + children.length + " children"
        });
    }
}
function checkUsageJSt(_a) {
    var context = _a.context, node = _a.node, expectedValueStart = _a.expectedValueStart;
    var quasi = node.quasi;
    var firstQuasi = quasi.quasis[0];
    var value = firstQuasi.value.cooked;
    if (isUsageIncorrect({ value: value, expectedValueStart: expectedValueStart })) {
        context.report({
            node: node,
            message: "expected t`` template string to begin with \u201C" + expectedValueStart + "\u201D followed by a lower-case character, found: " + JSON.stringify(value)
        });
    }
}
function checkUsageJSPluralSelectSelectOrdinal(_a) {
    var context = _a.context, node = _a.node;
    var name = node.callee.name;
    if (node.arguments.length < 2) {
        return context.report({
            node: node,
            message: "not enough arguments to " + name + "()"
        });
    }
    else if (node.arguments[1].type !== "ObjectExpression") {
        return context.report({
            node: node,
            message: name + "()'s second argument should be an object"
        });
    }
    else {
        var expectedValueStart = getExpectedValueStart(context);
        for (var _i = 0, _b = node.arguments[1].properties; _i < _b.length; _i++) {
            var objectProperty = _b[_i];
            if (objectProperty.type === "Property") {
                var value = nodeToApproximateStringLiteral(objectProperty.value);
                if (isUsageIncorrect({ value: value, expectedValueStart: expectedValueStart })) {
                    context.report({
                        node: node,
                        message: "expected " + name + " values to begin with \u201C" + expectedValueStart + "\u201D followed by a lower-case character, found: " + JSON.stringify(value)
                    });
                }
            }
            else {
                context.report({
                    node: node,
                    message: name + "()'s second argument should be an object with string literals"
                });
            }
        }
    }
}
function checkUsageSelect(_a) {
    var context = _a.context, node = _a.node, expectedValueStart = _a.expectedValueStart;
    var children = node.children, attributes = node.openingElement.attributes;
    if (children.length) {
        context.report({
            node: node,
            message: "expected <Select> element to have no children"
        });
    }
    attributes.forEach(function (attribute) {
        if (attribute.type !== "JSXAttribute") {
            context.report({
                node: node,
                message: "expected <Select> element to contain only explicit attributes (not spread)"
            });
        }
        else {
            var attributeName = attribute.name.name, attributeValue = attribute.value;
            if (attributeName !== "value") {
                var value = nodeToApproximateStringLiteral(attributeValue);
                if (isUsageIncorrect({ value: value, expectedValueStart: expectedValueStart })) {
                    context.report({
                        node: node,
                        message: "expected Select attribute \u201C" + attributeName + "\u201D to begin with \u201C" + expectedValueStart + "\u201D followed by a lower-case character, found: " + JSON.stringify(value)
                    });
                }
            }
        }
    });
}
function checkUsagePluralSelectOrdinal(_a) {
    var name = _a.name, context = _a.context, node = _a.node, expectedValueStart = _a.expectedValueStart;
    var children = node.children, attributes = node.openingElement.attributes;
    if (children.length) {
        context.report({
            node: node,
            message: "expected <" + name + "> element to have no children"
        });
    }
    attributes.forEach(function (attribute) {
        if (attribute.type !== "JSXAttribute") {
            context.report({
                node: node,
                message: "expected <" + name + "> element to contain only explicit attributes (not spread)"
            });
        }
        else {
            var attributeName = attribute.name.name, attributeValue = attribute.value;
            if (attributeName.match(/^_[0-9]+$/) ||
                ["value", "zero", "one", "two", "few", "many", "other"].indexOf(attributeName) >= 0) {
                var value = nodeToApproximateStringLiteral(attributeValue);
                if (isUsageIncorrect({ value: value, expectedValueStart: expectedValueStart })) {
                    context.report({
                        node: node,
                        message: "expected <" + name + "> attribute \u201C" + attributeName + "\u201D to begin with \u201C" + expectedValueStart + "\u201D followed by a lower-case character, found: " + JSON.stringify(value)
                    });
                }
            }
        }
    });
}
module.exports = {
    create: function (context) {
        return {
            JSXElement: function (node) {
                var openingElement = node.openingElement;
                var _a = getLinguiComponentNames(context), nameTrans = _a.Trans, namePlural = _a.Plural, nameSelectOrdinal = _a.SelectOrdinal, nameSelect = _a.Select;
                if (openingElement.name.type === "JSXIdentifier" &&
                    [nameTrans, namePlural, nameSelectOrdinal, nameSelect].indexOf(openingElement.name.name) >= 0) {
                    var elementName = openingElement.name.name;
                    var expectedValueStart = getExpectedValueStart(context);
                    if (elementName === nameTrans) {
                        checkUsageTrans({ context: context, node: node, expectedValueStart: expectedValueStart });
                    }
                    else if (elementName === namePlural) {
                        checkUsagePluralSelectOrdinal({
                            name: "Plural",
                            context: context,
                            node: node,
                            expectedValueStart: expectedValueStart
                        });
                    }
                    else if (elementName === nameSelectOrdinal) {
                        checkUsagePluralSelectOrdinal({
                            name: "SelectOrdinal",
                            context: context,
                            node: node,
                            expectedValueStart: expectedValueStart
                        });
                    }
                    else {
                        checkUsageSelect({ context: context, node: node, expectedValueStart: expectedValueStart });
                    }
                }
            },
            TaggedTemplateExpression: function (node) {
                var nameT = getLinguiComponentNames(context).t;
                if (node.tag.type === "Identifier") {
                    var expectedValueStart = getExpectedValueStart(context);
                    if (node.tag.name === nameT) {
                        checkUsageJSt({
                            context: context,
                            node: node,
                            expectedValueStart: expectedValueStart
                        });
                    }
                }
            },
            CallExpression: function (node) {
                var _a = getLinguiComponentNames(context), nameT = _a.t, namePlural = _a.plural, nameSelectOrdinal = _a.selectOrdinal, nameSelect = _a.select;
                if (node.callee.type === "Identifier") {
                    if (node.callee.name === nameT) {
                        context.report({
                            node: node,
                            message: "do not use the call expression form t(), use instead the template literal form t``"
                        });
                    }
                    else if ([namePlural, nameSelect, nameSelectOrdinal].indexOf(node.callee.name) >= 0) {
                        checkUsageJSPluralSelectSelectOrdinal({ context: context, node: node });
                    }
                }
            },
            ImportDeclaration: function (node) {
                if (node.source.value === "@lingui/react") {
                    context.report({
                        node: node,
                        message: "do not import for @lingui/react, please use @lingui/macro"
                    });
                }
            }
        };
    }
};
