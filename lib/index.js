'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.builder = builder;

var _nodes = require('./nodes');

var _nodes2 = _interopRequireDefault(_nodes);

var _parser = require('../src/parser');

var _parser2 = _interopRequireDefault(_parser);

var _Compiler = require('./compiler');

var _Compiler2 = _interopRequireDefault(_Compiler);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

exports['default'] = function (_ref) {
    var content = _ref.content;
    var _ref$opts = _ref.opts;
    var opts = _ref$opts === undefined ? {} : _ref$opts;
    var _ref$ctx = _ref.ctx;
    var ctx = _ref$ctx === undefined ? {} : _ref$ctx;

    _assert2['default'](typeof content === 'string', 'Expected the `content` property');

    var builder = new _Compiler2['default'](opts);
    return builder.parse({ content: content, ctx: ctx });
};

function builder(opts) {
    return new _Compiler2['default'](opts);
}