"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = {
    upper: function upper(_ref) {
        var value = _ref.value;
        var ctx = _ref.ctx;

        return value.toUpperCase();
    },
    ucfirst: function ucfirst(_ref2) {
        var value = _ref2.value;
        var ctx = _ref2.ctx;

        return value.charAt(0).toUpperCase() + value.slice(1);
    }
};
module.exports = exports["default"];