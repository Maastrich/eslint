"use strict";
exports.__esModule = true;
exports.isPascalCase = exports.isCamelCase = void 0;
function isCamelCase(s) {
    return !!s.match(/^[a-z][A-Za-z0-9]*$/);
}
exports.isCamelCase = isCamelCase;
function isPascalCase(s) {
    return !!s.match(/^[A-Z][A-Za-z0-9]*$/);
}
exports.isPascalCase = isPascalCase;
