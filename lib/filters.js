'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    upper: function upper(string, ctx) {
        return string.toUpperCase();
    },
    ucfirst: function ucfirst(value, ctx) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
};
module.exports = exports['default'];