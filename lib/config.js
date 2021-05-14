"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getConfig = exports.Config = void 0;
var fs_1 = __importDefault(require("fs"));
var yaml_1 = __importDefault(require("yaml"));
var Config = /** @class */ (function () {
    function Config(yaml) {
        var _this = this;
        var _a;
        this.validHooksInUiComponents = {
            useMemo: true,
            useCallback: true,
            useRef: true
        };
        if (yaml) {
            (_a = yaml["valid-hooks-in-ui-components"]) === null || _a === void 0 ? void 0 : _a.forEach(function (hook) {
                if (typeof hook === "string") {
                    _this.validHooksInUiComponents[hook] = true;
                }
                else {
                    Object.keys(hook).forEach(function (key) {
                        _this.validHooksInUiComponents[key] = hook[key];
                    });
                }
            });
        }
    }
    Config.prototype.isValidHookName = function (hook) {
        var _a;
        return (_a = this.validHooksInUiComponents[hook]) !== null && _a !== void 0 ? _a : false;
    };
    return Config;
}());
exports.Config = Config;
function getConfig() {
    try {
        var data = fs_1["default"].readFileSync(".eslint.myplugin.yml", {
            encoding: "utf-8"
        });
        var config = new Config(yaml_1["default"].parse(data, { keepNodeTypes: true }));
        return config;
    }
    catch (e) {
        return new Config();
    }
}
exports.getConfig = getConfig;
;
