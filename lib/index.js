"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var requireindex_1 = __importDefault(require("requireindex"));
var plugin = {
    rules: requireindex_1["default"](__dirname + '/rules')
};
exports["default"] = plugin;
