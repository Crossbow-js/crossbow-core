'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
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
    }
};
module.exports = exports['default'];