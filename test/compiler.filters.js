'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Adding filters to the compiler', function () {
    it('can add a filter', function () {

        var input1 = '{name|md}';

        var compiler = (0, _libIndexJs.builder)();

        compiler.filters.md = function (_ref) {
            var value = _ref.value;
            var args = _ref.args;
            var node = _ref.node;
            var ctx = _ref.ctx;
            var compiler = _ref.compiler;

            return value + ' - md';
        };

        var out = compiler.parse({ content: input1, ctx: { name: 'kittie' } });

        _chai.assert.equal(out, 'kittie - md');
    });
    it('can add a filter that uses args', function () {

        var input1 = '{name|md~"osbourne"}';

        var compiler = (0, _libIndexJs.builder)();

        compiler.filters.md = function (_ref2) {
            var value = _ref2.value;
            var args = _ref2.args;
            var node = _ref2.node;
            var ctx = _ref2.ctx;
            var compiler = _ref2.compiler;

            return value + ' - ' + args[0].value;
        };

        var out = compiler.parse({ content: input1, ctx: { name: 'kittie' } });

        _chai.assert.equal(out, 'kittie - osbourne');
    });

    it('using external module + filter', function () {
        var content = '{shane|ucfirst|lodash:pad~15,"--"}';
        var ctx = { shane: 'shane' };
        var output = (0, _libIndexJs2['default'])({ content: content, ctx: ctx });
        _chai.assert.equal(output, '-----Shane-----');
    });

    it('Does not blow up/hang with whitespace inbetween params', function () {
        var content = '{shane|ucfirst|lodash:pad~ 15 , "--"  }';
        var ctx = { shane: 'shane' };
        var output = (0, _libIndexJs2['default'])({ content: content, ctx: ctx });
        _chai.assert.equal(output, '-----Shane-----');
    });
});