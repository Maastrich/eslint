"use strict";
var program = require("./declarations/program");
var importDeclaration = require("./declarations/import-declaration");
var exportDefaultDeclaration = require("./declarations/export-default-declaration");
module.exports = {
    create: function (context) {
        return {
            Program: program(context),
            ImportDeclaration: importDeclaration(context),
            ExportDefaultDeclaration: exportDefaultDeclaration(context)
        };
    }
};
