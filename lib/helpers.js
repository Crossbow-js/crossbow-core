'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _Immutable = require('immutable');

var _Immutable2 = _interopRequireDefault(_Immutable);

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

        var lookup = compiler.getLookupPath({ node: node.context });
        var freshctx = ctx.concat(lookup);
        var value = compiler.getValue(freshctx);

        var out = [];
        var sep = '';

        if (Array.isArray(value)) {
            value.forEach(function (value, i) {
                out.push(compiler.process({ ast: node.bodies, ctx: freshctx.concat(i) }));
            });
        } else if (_import2['default'].isObject(value)) {
            Object.keys(value).forEach(function (key) {
                out.push(compiler.process({ ast: node.bodies, ctx: freshctx.concat(key) }));
            });
        }

        return out.join(sep);
    }
};
module.exports = exports['default'];