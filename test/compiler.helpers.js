'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Adding helpers to the compiler', function () {
    it('can add a helper that returns raw', function () {

        var input1 = '{@shane}\nHello world\n{/shane}';

        var compiler = _cblang$builder.builder();

        compiler.helpers.shane = function (_ref) {
            var node = _ref.node;
            var ctx = _ref.ctx;
            var compiler = _ref.compiler;

            return compiler.process({ ast: node.bodies });
        };

        var out = compiler.parse({ content: input1 });

        _assert.assert.equal(out, '\nHello world');
    });
});