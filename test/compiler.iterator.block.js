'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Compiling iterator blocks', function () {
    it('can loop over an array and access an item', function () {
        var input = '{#names}{first}-{/names}';
        var ctx = {
            names: [{
                first: 'shane',
                last: 'osbourne'
            }, {
                first: 'kittie',
                last: 'osbourne'
            }]
        };
        var compiler = (0, _libIndexJs.builder)();
        var out = compiler.parse({ content: input, ctx: ctx });
        _chai.assert.equal(out, 'shane-kittie-');
    });
    it('can loop over an array and access an item', function () {
        var input = '{#names}{first}-{/names}{#names}{last}-{/names}';
        var ctx = {
            names: [{
                first: 'shane',
                last: 'osbourne'
            }, {
                first: 'kittie',
                last: 'osbourne'
            }]
        };
        var compiler = (0, _libIndexJs.builder)();
        var out = compiler.parse({ content: input, ctx: ctx });
        _chai.assert.equal(out, 'shane-kittie-osbourne-osbourne-');
    });
});