const path = require("path");

const importDeclaration = (context) => (node) => {
  const {
    source: { value: sourceValue },
    specifiers,
  } = node;

  if (sourceValue.match(/^\//)) {
    context.report({
      node,
      message: `do not use absolute path imports`,
    });
  }
  if (sourceValue.match(/^(?!@|\.{1,2}|\/).+\/.+$/)) {
    context.report({
      node,
      message: `do not import a submodule except for scope imports`,
    });
  }

  const defaultSpecifier = specifiers.find(
    ({ type }) => type === "ImportDefaultSpecifier"
  );

  if (sourceValue.match(/^[./]/) && defaultSpecifier) {
    const sourceBasename = path.basename(
      sourceValue,
      path.extname(sourceValue)
    );
    //const sourceBasenameIsLowercase = isLowercase(sourceBasename);
    const {
      local: { name: localName },
    } = defaultSpecifier;
    //const localNameIsLowercase = isLowercase(localName);

    /*
    if (sourceBasenameIsLowercase !== localNameIsLowercase) {
      context.report({
        node,
        message: `default import case mismatch, “${sourceBasename}” was imported as “${localName}”`,
      });
    }
    */
    const expectImport = sourceBasename.match(/-/)
      ? sourceBasename
        .split("-")
        .map(
          (x, i) =>
            (i
              ? x.substr(0, 1).toUpperCase()
              : sourceBasename[0].match(/[A-Z]/)
                ? x.substr(0, 1).toUpperCase()
                : x.substr(0, 1).toLowerCase()) + x.substr(1)
        )
        .join("")
      : sourceBasename;
    if (expectImport !== localName) {
      context.report({
        node,
        message: `default import name mismatch, expected “${sourceBasename}” to be imported as “${expectImport}”, was imported as “${localName}”`,
      });
    }
  }
};

module.exports = importDeclaration;
