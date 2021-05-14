import { Linter } from "eslint";
import process from "process";

export const cwd = process.cwd();
export const parser = require.resolve("@babel/eslint-parser");
export const parserOptions: Linter.ParserOptions = {
  sourceType: "module",
  allowImportExportEverywhere: false,
  ecmaFeatures: {
    globalReturn: false,
  },
  requireConfigFile: false,
  babelOptions: {},
};
