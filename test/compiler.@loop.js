'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('@loop helper', function () {
    it('can render a loop over an array', function () {

        var input1 = '{@loop:names}{$this}{/loop}';

        var compiler = _cblang$builder.builder();

        var out = compiler.parse({
            content: input1,
            ctx: {
                names: ['shane', 'kittie']
            }
        });

        _assert.assert.equal(out, 'shanekittie');
    });
    it('can render a loop over an array from initial path lookup', function () {

        var input1 = '{@loop:info.names}{$this}{/loop}';

        var compiler = _cblang$builder.builder();

        var out = compiler.parse({
            content: input1,
            ctx: {
                info: {
                    names: ['shane', 'kittie']
                }
            }
        });

        _assert.assert.equal(out, 'shanekittie');
    });
    it('can render a loop over an array with path access', function () {

        var input1 = '{@loop:names}{$this.first}{/loop}';

        var compiler = _cblang$builder.builder();

        var out = compiler.parse({
            content: input1,
            ctx: {
                names: [{
                    first: 'shane',
                    last: 'osbourne'
                }, {
                    first: 'kittie',
                    last: 'bastard'
                }]
            }
        });

        _assert.assert.equal(out, 'shanekittie');
    });
});