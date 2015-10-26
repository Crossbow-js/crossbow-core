'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.builder = builder;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nodes = require('./nodes');

var _nodes2 = _interopRequireDefault(_nodes);

var _srcParser = require('../src/parser');

var _srcParser2 = _interopRequireDefault(_srcParser);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

exports['default'] = function (_ref) {
    var content = _ref.content;
    var _ref$opts = _ref.opts;
    var opts = _ref$opts === undefined ? {} : _ref$opts;
    var _ref$ctx = _ref.ctx;
    var ctx = _ref$ctx === undefined ? {} : _ref$ctx;

    (0, _assert2['default'])(typeof content === 'string', 'Expected the `content` property');

    var builder = new _compiler2['default'](opts);
    return builder.parse({ content: content, ctx: ctx });
};

function builder(opts) {
    return new _compiler2['default'](opts);
}