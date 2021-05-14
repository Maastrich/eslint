const { getmypluginPathFromContext, isJSXText } = require("../eslint-utils");
const path = require("path");

function getLinguiComponentNames(context) {
  const sourceCode = context.getSourceCode();

  const names = {
    Trans: "@@notbeingused@@",
    Plural: "@@notbeingused@@",
    SelectOrdinal: "@@notbeingused@@",
    Select: "@@notbeingused@@",
    t: "@@notbeingused@@",
    plural: "@@notbeingused@@",
    selectOrdinal: "@@notbeingused@@",
    select: "@@notbeingused@@",
  };

  const { ast: program } = sourceCode;

  program.body
    .filter(({ type }) => type === "ImportDeclaration")
    .filter(({ source: { value } }) => value === "@lingui/macro")
    .forEach(({ specifiers }) => {
      specifiers
        .filter(({ type }) => type === "ImportSpecifier")
        .forEach(
          ({
            imported: { name: importedName },
            local: { name: localName },
          }) => {
            if (importedName in names) {
              names[importedName] = localName;
            }
          }
        );
    });

  return names;
}

function getExpectedValueStart(context) {
  const { filename, localDirname } = getmypluginPathFromContext(context);
  const prefix = path
    .dirname(localDirname)
    .replace(/^src\/components\/?/, "")
    .replace(/\//g, ".");
  const expectedValueStart = `#${prefix}${prefix ? "." : ""}${filename}.`;
  return expectedValueStart;
}

function isUsageIncorrect({ value, expectedValueStart }) {
  if (value.substr(0, expectedValueStart.length) !== expectedValueStart) {
    return true;
  }
  const tail = value.substr(expectedValueStart.length);
  if (!tail.match(/^[a-z]/)) {
    return true;
  }
}

function nodeToApproximateStringLiteral(node) {
  if (isJSXText(node)) {
    return node.value.replace(/^\s+/, "");
  }
  const { type } = node;
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

function checkUsageTrans({ context, node, expectedValueStart }) {
  const { children } = node;
  if (children[0]) {
    const value = nodeToApproximateStringLiteral(children[0]);
    if (value) {
      if (isUsageIncorrect({ value, expectedValueStart })) {
        context.report({
          node,
          message: `expected <Trans> string to begin with “${expectedValueStart}” followed by a lower-case character, found: ${JSON.stringify(
            value
          )}`,
        });
      }
    } else {
      context.report({
        node,
        message: `expected <Trans> element to contain a string that starts with ${expectedValueStart}, found ${children.length} children`,
      });
    }
  } else {
    context.report({
      node,
      message: `expected <Trans> element to contain a string that starts with ${expectedValueStart}, found ${children.length} children`,
    });
  }
}

function checkUsageJSt({ context, node, expectedValueStart }) {
  const { quasi } = node;
  const [firstQuasi] = quasi.quasis;
  const value = firstQuasi.value.cooked;
  if (isUsageIncorrect({ value, expectedValueStart })) {
    context.report({
      node,
      message: `expected t\`\` template string to begin with “${expectedValueStart}” followed by a lower-case character, found: ${JSON.stringify(
        value
      )}`,
    });
  }
}

function checkUsageJSPluralSelectSelectOrdinal({ context, node }) {
  const name = node.callee.name;
  if (node.arguments.length < 2) {
    return context.report({
      node,
      message: `not enough arguments to ${name}()`,
    });
  } else if (node.arguments[1].type !== "ObjectExpression") {
    return context.report({
      node,
      message: `${name}()'s second argument should be an object`,
    });
  } else {
    const expectedValueStart = getExpectedValueStart(context);
    for (const objectProperty of node.arguments[1].properties) {
      if (objectProperty.type === "Property") {
        const value = nodeToApproximateStringLiteral(objectProperty.value);
        if (isUsageIncorrect({ value, expectedValueStart })) {
          context.report({
            node,
            message: `expected ${name} values to begin with “${expectedValueStart}” followed by a lower-case character, found: ${JSON.stringify(
              value
            )}`,
          });
        }
      } else {
        context.report({
          node,
          message: `${name}()'s second argument should be an object with string literals`,
        });
      }
    }
  }
}

function checkUsageSelect({ context, node, expectedValueStart }) {
  const {
    children,
    openingElement: { attributes },
  } = node;
  if (children.length) {
    context.report({
      node,
      message: `expected <Select> element to have no children`,
    });
  }
  attributes.forEach((attribute) => {
    if (attribute.type !== "JSXAttribute") {
      context.report({
        node,
        message: `expected <Select> element to contain only explicit attributes (not spread)`,
      });
    } else {
      const {
        name: { name: attributeName },
        value: attributeValue,
      } = attribute;
      if (attributeName !== "value") {
        const value = nodeToApproximateStringLiteral(attributeValue);
        if (isUsageIncorrect({ value, expectedValueStart })) {
          context.report({
            node,
            message: `expected Select attribute “${attributeName}” to begin with “${expectedValueStart}” followed by a lower-case character, found: ${JSON.stringify(
              value
            )}`,
          });
        }
      }
    }
  });
}

function checkUsagePluralSelectOrdinal({
  name,
  context,
  node,
  expectedValueStart,
}) {
  const {
    children,
    openingElement: { attributes },
  } = node;
  if (children.length) {
    context.report({
      node,
      message: `expected <${name}> element to have no children`,
    });
  }
  attributes.forEach((attribute) => {
    if (attribute.type !== "JSXAttribute") {
      context.report({
        node,
        message: `expected <${name}> element to contain only explicit attributes (not spread)`,
      });
    } else {
      const {
        name: { name: attributeName },
        value: attributeValue,
      } = attribute;
      if (
        attributeName.match(/^_[0-9]+$/) ||
        ["value", "zero", "one", "two", "few", "many", "other"].indexOf(
          attributeName
        ) >= 0
      ) {
        const value = nodeToApproximateStringLiteral(attributeValue);
        if (isUsageIncorrect({ value, expectedValueStart })) {
          context.report({
            node,
            message: `expected <${name}> attribute “${attributeName}” to begin with “${expectedValueStart}” followed by a lower-case character, found: ${JSON.stringify(
              value
            )}`,
          });
        }
      }
    }
  });
}

module.exports = {
  create: (context) => {
    return {
      JSXElement(node) {
        const { openingElement } = node;
        const {
          Trans: nameTrans,
          Plural: namePlural,
          SelectOrdinal: nameSelectOrdinal,
          Select: nameSelect,
        } = getLinguiComponentNames(context);

        if (
          openingElement.name.type === "JSXIdentifier" &&
          [nameTrans, namePlural, nameSelectOrdinal, nameSelect].indexOf(
            openingElement.name.name
          ) >= 0
        ) {
          const elementName = openingElement.name.name;
          const expectedValueStart = getExpectedValueStart(context);
          if (elementName === nameTrans) {
            checkUsageTrans({ context, node, expectedValueStart });
          } else if (elementName === namePlural) {
            checkUsagePluralSelectOrdinal({
              name: "Plural",
              context,
              node,
              expectedValueStart,
            });
          } else if (elementName === nameSelectOrdinal) {
            checkUsagePluralSelectOrdinal({
              name: "SelectOrdinal",
              context,
              node,
              expectedValueStart,
            });
          } else {
            checkUsageSelect({ context, node, expectedValueStart });
          }
        }
      },
      TaggedTemplateExpression(node) {
        const { t: nameT } = getLinguiComponentNames(context);
        if (node.tag.type === "Identifier") {
          const expectedValueStart = getExpectedValueStart(context);
          if (node.tag.name === nameT) {
            checkUsageJSt({
              context,
              node,
              expectedValueStart,
            });
          }
        }
      },
      CallExpression(node) {
        const {
          t: nameT,
          plural: namePlural,
          selectOrdinal: nameSelectOrdinal,
          select: nameSelect,
        } = getLinguiComponentNames(context);
        if (node.callee.type === "Identifier") {
          if (node.callee.name === nameT) {
            context.report({
              node,
              message: `do not use the call expression form t(), use instead the template literal form t\`\``,
            });
          } else if (
            [namePlural, nameSelect, nameSelectOrdinal].indexOf(
              node.callee.name
            ) >= 0
          ) {
            checkUsageJSPluralSelectSelectOrdinal({ context, node });
          }
        }
      },
      ImportDeclaration(node) {
        if (node.source.value === "@lingui/react") {
          context.report({
            node,
            message: `do not import for @lingui/react, please use @lingui/macro`,
          });
        }
      },
    };
  },
};
