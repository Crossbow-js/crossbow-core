'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('@loop helper for object iteration', function () {
    it('can render a loop over an object', function () {

        var input1 = '{@loop:pkg}{$key} : {$value}{/loop}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                pkg: {
                    version: '1.2'
                }
            }
        });

        _chai.assert.equal(out, 'version : 1.2');
    });
});