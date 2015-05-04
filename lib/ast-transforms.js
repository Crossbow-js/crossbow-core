'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _parser = require('../src/parser');

var _parser2 = _interopRequireDefault(_parser);

// Check if a string consists of *only* whitespace chars
var containsWhitespaceOnly = /^[\n\t\v\f \u00A0\uFEFF]+$/;

function formattingPass(_ref) {
    var ast = _ref.ast;
    var ctx = _ref.ctx;
    var compiler = _ref.compiler;

    //return ast;
    return ast.map(function (item, i, all) {

        /**
         * Reference blocks.
         * These are typically 'loops' so we want to
         * strip whitespace from around the tags and allow
         */
        if (item.type === '#') {
            var start = item.loc.start.column;
            var prev = all[i - 1];

            if (prev && prev.type === 'format') {
                prev.raw = prev.raw.slice(0, prev.raw.length - start);
            }

            if (item.end) {
                var _start = item.end.loc.start.column;
                var lastBody = item.bodies[item.bodies.length - 1];
                if (lastBody && lastBody.type === 'format') {
                    lastBody.raw = lastBody.raw.slice(0, lastBody.raw.length - _start);
                }
            }
        }

        /**
         * Raw helper - remove formatting running upto closing tag
         */
        if (item.type === '@' && item.raw) {

            var endtagStart = item.end.loc.start.column;
            var rawEnd = item.raw.slice(item.raw.length - endtagStart);

            /**
             * If the last x chars of the raw block are 'formatting' code,
             * strip them.
             */
            if (rawEnd.match(containsWhitespaceOnly)) {
                item.raw = item.raw.slice(0, item.raw.length - endtagStart);
            }
        }

        if (item.raw && item.type !== '@') {
            item.bodies = _parser2['default'].parse(item.raw);
        }

        return item;
    });
}

exports.formattingPass = formattingPass;