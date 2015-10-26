'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Adding helpers to the compiler', function () {
    it('can add a helper that returns raw', function () {

        var input1 = '{@shane}\nHello world\n{/shane}';

        var compiler = (0, _libIndexJs.builder)();

        compiler.helpers.shane = function (_ref) {
            var node = _ref.node;
            var ctx = _ref.ctx;
            var compiler = _ref.compiler;

            return compiler.process({ ast: node.bodies });
        };

        var out = compiler.parse({ content: input1 });

        _chai.assert.equal(out, '\nHello world');
    });
});