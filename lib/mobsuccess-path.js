"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.parsemypluginPath = void 0;
var path_1 = __importDefault(require("path"));
function parsemypluginPath(_a) {
    var _b;
    var filepath = _a.filepath, rootDir = _a.rootDir;
    var ext = path_1["default"].extname(filepath);
    var filename = path_1["default"].basename(filepath, ext);
    var dirname = path_1["default"].dirname(filepath);
    if (dirname.substr(0, rootDir.length) !== rootDir) {
        throw new Error("received unexpected file " + filepath + " that was not in root directory: " + rootDir);
    }
    var localDirnameWithScope = dirname.substr(rootDir.length) + "/";
    var _c = (_b = localDirnameWithScope.match(/^(?<localDirname>.*?\/)((?<scope>__.*__)\/)?$/)) === null || _b === void 0 ? void 0 : _b.groups, localDirname = _c.localDirname, scope = _c.scope;
    return { filename: filename, ext: ext, localDirname: localDirname, scope: scope };
}
exports.parsemypluginPath = parsemypluginPath;
;
