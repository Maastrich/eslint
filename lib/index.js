"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var layout_1 = __importDefault(require("./rules/layout"));
var no_scss_1 = __importDefault(require("./rules/no-scss"));
var no_lost_assets_1 = __importDefault(require("./rules/no-lost-assets"));
var import_export_1 = __importDefault(require("./rules/import-export"));
var variables_1 = __importDefault(require("./rules/variables"));
var member_expressions_1 = __importDefault(require("./rules/member-expressions"));
var hooks_1 = __importDefault(require("./rules/hooks"));
var react_1 = __importDefault(require("./rules/react"));
var lingui_1 = __importDefault(require("./rules/lingui"));
var plugin = {
    rules: {
        layout: layout_1["default"],
        "import-export": import_export_1["default"],
        "no-scss": no_scss_1["default"],
        "no-lost-assets": no_lost_assets_1["default"],
        variables: variables_1["default"],
        "member-expressions": member_expressions_1["default"],
        hooks: hooks_1["default"],
        react: react_1["default"],
        lingui: lingui_1["default"]
    }
};
console.log(plugin);
exports["default"] = plugin;
