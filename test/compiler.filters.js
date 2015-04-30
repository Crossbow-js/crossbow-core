'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Adding filters to the compiler', function () {
    it('can add a filter', function () {

        var input1 = '{name|md}';

        var compiler = _cblang$builder.builder();

        compiler.filters.md = function (_ref) {
            var value = _ref.value;
            var args = _ref.args;
            var node = _ref.node;
            var ctx = _ref.ctx;
            var compiler = _ref.compiler;

            return value + ' - md';
        };

        var out = compiler.parse({ content: input1, ctx: { name: 'kittie' } });

        _assert.assert.equal(out, 'kittie - md');
    });
    it('can add a filter that uses args', function () {

        var input1 = '{name|md~"osbourne"}';

        var compiler = _cblang$builder.builder();

        compiler.filters.md = function (_ref2) {
            var value = _ref2.value;
            var args = _ref2.args;
            var node = _ref2.node;
            var ctx = _ref2.ctx;
            var compiler = _ref2.compiler;

            return value + ' - ' + args[0].value;
        };

        var out = compiler.parse({ content: input1, ctx: { name: 'kittie' } });

        _assert.assert.equal(out, 'kittie - osbourne');
    });
});