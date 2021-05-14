"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.report = exports.ContextError = void 0;
var ContextError = /** @class */ (function (_super) {
    __extends(ContextError, _super);
    function ContextError(message, node, data, quickFix) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.node = node;
        _this.data = data;
        _this.quickFix = quickFix;
        _this.type = "ContextError";
        return _this;
    }
    ContextError.prototype.getReport = function () {
        var _this = this;
        var _a = this, message = _a.message, data = _a.data, node = _a.node;
        return ({
            message: message,
            node: node,
            data: data,
            fix: this.quickFix ? (function (fixer) {
                return fixer.replaceText(_this.node, _this.quickFix);
            }) : undefined
        });
    };
    return ContextError;
}(Error));
exports.ContextError = ContextError;
function report(context, contextError) {
    context.report(contextError.getReport());
}
exports.report = report;
