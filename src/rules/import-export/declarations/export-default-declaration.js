const { getmypluginPathFromContext } = require("../../../eslint-utils");

const exportDefaultDeclaration = (context) => (node) => {
  const {
    declaration: { id, name },
  } = node;
  const exportName = id ? id.name : name;
  const { filename } = getmypluginPathFromContext(context);

  const expected = filename;
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
        node,
        message: `default export name mismatch, expected “${expected}”, was exported as “${exportName}”`,
      });
    } else if (exportName.match(/^[A-Z]/)) {
      context.report({
        node,
        message: `default export name mismatch, did not expect an identifier in UpperPascalCase: “${exportName}”`,
      });
    }
  }
};

module.exports = exportDefaultDeclaration;
