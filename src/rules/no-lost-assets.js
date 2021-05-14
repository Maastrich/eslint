const path = require("path");
const { getmypluginPathFromContext } = require("../eslint-utils");

module.exports = {
  create: (context) => {
    return {
      ImportDeclaration(node) {
        const { scope, localDirname } = getmypluginPathFromContext(context);
        const {
          source: { value: sourceValue },
        } = node;
        if (sourceValue.match(/^@/)) {
          return;
        }
        const ext = path.extname(sourceValue);
        if (!ext || [".js", ".ts"].indexOf(ext) >= 0) {
          // folder or JS/TS file, ignore
          return;
        }
        //const filename = context.getFilename();
        const cwd = path.normalize(context.getCwd());
        const importedFile = path.normalize(
          `${cwd}/${localDirname}/${sourceValue}`
        );
        const expectedAssetDir = path.normalize(`${cwd}/src/assets`);
        /*
        console.log({
          sourceValue,
          filename,
          cwd,
          importedFile,
          expectedAssetDir,
        });
        */

        if (
          !scope &&
          importedFile.substr(0, expectedAssetDir.length) !== expectedAssetDir
        ) {
          context.report({
            node,
            message: `expected asset to be imported from ${expectedAssetDir}`,
          });
        }
      },
    };
  },
};
