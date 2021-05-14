"use strict";
exports.__esModule = true;
exports.isInvalidHandlerName = exports.isHookName = void 0;
function isHookName(name) {
    return /^use[A-Z0-9].*$/.test(name);
}
exports.isHookName = isHookName;
function isInvalidHandlerName(name) {
    return name.match(/^on[A-Z]/);
}
exports.isInvalidHandlerName = isInvalidHandlerName;
