'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

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
        var compiler = _cblang$builder.builder();
        var out = compiler.parse({ content: input, ctx: ctx });
        _assert.assert.equal(out, 'shane-kittie-');
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
        var compiler = _cblang$builder.builder();
        var out = compiler.parse({ content: input, ctx: ctx });
        _assert.assert.equal(out, 'shane-kittie-osbourne-osbourne-');
    });
});