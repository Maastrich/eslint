"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.isIntrisic = void 0;
var get_intrinsic_1 = __importDefault(require("get-intrinsic"));
var mypluginIntrinsics = new Set([
    "%Buffer%from%",
    "%Buffer%of%",
    "%Buffer%alloc%",
    "%Buffer%allocUnsafe%",
    "%Buffer%allocUnsafeSlow%",
    "%Buffer%isBuffer%",
    "%Buffer%compare%",
    "%Buffer%isEncoding%",
    "%Buffer%concat%",
    "%Buffer%byteLength%",
    "%PropTypes%array%",
    "%PropTypes%bool%",
    "%PropTypes%func%",
    "%PropTypes%number%",
    "%PropTypes%object%",
    "%PropTypes%string%",
    "%PropTypes%symbol%",
    "%PropTypes%any%",
    "%PropTypes%arrayOf%",
    "%PropTypes%element%",
    "%PropTypes%elementType%",
    "%PropTypes%instanceOf%",
    "%PropTypes%node%",
    "%PropTypes%objectOf%",
    "%PropTypes%oneOf%",
    "%PropTypes%oneOfType%",
    "%PropTypes%shape%",
    "%PropTypes%exact%",
    "%PropTypes%checkPropTypes%",
    "%PropTypes%resetWarningCache%",
    "%URL%createObjectURL%",
    "%URL%revokeObjectURL%",
]);
function isIntrisic(_a) {
    var objectName = _a.objectName, propertyName = _a.propertyName;
    var key = "%" + objectName + "%" + propertyName + "%";
    if (mypluginIntrinsics.has(key)) {
        return true;
    }
    try {
        get_intrinsic_1["default"](key);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isIntrisic = isIntrisic;
;
