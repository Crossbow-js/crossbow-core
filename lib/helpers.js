"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = {
    hl: function hl(_ref) {
        var node = _ref.node;
        var ctx = _ref.ctx;
        var compiler = _ref.compiler;

        return "<script src=\"" + node.params[0] + "\">" + node.raw + "</script>";
    }
};
module.exports = exports["default"];