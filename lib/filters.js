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
    },
    "+": function _(_ref3) {
        var value = _ref3.value;
        var ctx = _ref3.ctx;

        console.log(value);
    },
    another: function another(_ref4) {
        var value = _ref4.value;
        var ctx = _ref4.ctx;

        console.log(ctx);
    },
    plus: function plus(_ref5) {
        var node = _ref5.node;
        var ctx = _ref5.ctx;

        console.log(node.modifiers[0].args);
    }

};
module.exports = exports["default"];