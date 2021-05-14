const program = require("./declarations/program");
const importDeclaration = require("./declarations/import-declaration");
const exportDefaultDeclaration = require("./declarations/export-default-declaration");

module.exports = {
  create: (context) => {
    return {
      Program: program(context),
      ImportDeclaration: importDeclaration(context),
      ExportDefaultDeclaration: exportDefaultDeclaration(context),
    };
  },
};
