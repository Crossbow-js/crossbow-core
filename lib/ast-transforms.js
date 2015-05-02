'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _parser = require('../src/parser');

var _parser2 = _interopRequireDefault(_parser);

function formattingPass(_ref) {
    var ast = _ref.ast;
    var ctx = _ref.ctx;
    var compiler = _ref.compiler;

    return ast.map(function (item, i, all) {

        if (item.type === '#') {
            var start = item.loc.start.column;
            var prev = all[i - 1];
            prev.raw = prev.raw.slice(0, prev.raw.length - start);

            if (item.end) {
                start = item.end.loc.start.column;
                var lastBody = item.bodies[item.bodies.length - 1];
                if (lastBody && lastBody.type === 'format') {
                    lastBody.raw = lastBody.raw.slice(0, lastBody.raw.length - start);
                }
            }
        }

        if (item.raw && item.type !== '@') {
            item.bodies = _parser2['default'].parse(item.raw);
        }
        return item;
    });
}

exports.formattingPass = formattingPass;