'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _astTransforms = require('./ast-transforms');

exports['default'] = {
    hl: function hl(_ref) {
        var node = _ref.node;
        var ctx = _ref.ctx;
        var compiler = _ref.compiler;

        if (!node.raw) {
            compiler.error('@hl helper expects a raw block, an empty string will be used in stead');
            compiler.error('eg: {@hl}var name = "shane"{/@hl}');
            return '';
        }
        return '<pre class="highlight"><code>' + node.raw + '</code></pre>';
    },

    loop: function loop(_ref2) {
        var node = _ref2.node;
        var ctx = _ref2.ctx;
        var compiler = _ref2.compiler;

        var val = compiler.resolveValue({ node: node.context, ctx: ctx });

        var out = [];
        var sep = '';

        if (Array.isArray(val.value)) {
            val.value.forEach(function (value, i) {
                out.push(compiler.process({ ast: node.bodies, ctx: val.ctx.concat(i) }));
            });
        } else if (typeof val.value === 'object') {
            Object.keys(val.value).forEach(function (key) {
                out.push(compiler.process({ ast: node.bodies, ctx: val.ctx.concat(key) }));
            });
        }

        return out.join(sep);
    }
};
module.exports = exports['default'];