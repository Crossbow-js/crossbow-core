'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Compiling references blocks', function () {
    it('can render basic block 1 level deep', function () {
        var input = '{#person}-{name}-{/person}';
        var ctx = { person: { name: 'shane' } };
        var compiler = _cblang$builder.builder();
        var out = compiler.parse({ content: input, ctx: ctx });
        _assert.assert.equal(out, '-shane-');
    });
    it('can render basic block 5 levels deep', function () {
        var input = '{#a}{#b}{#c}{#d}{#e}-{name}-{/e}{/d}{/c}{/b}{/a}';
        var ctx = { a: { b: { c: { d: { e: { name: 'kittie' } } } } } };
        var compiler = _cblang$builder.builder();
        var out = compiler.parse({ content: input, ctx: ctx });
        _assert.assert.equal(out, '-kittie-');
    });
    it('can render basic block 1 level when not exists', function () {
        var input = '{#person}-{namea}-{/person}';
        var ctx = { person: { name: 'shane' } };
        var compiler = _cblang$builder.builder();
        var out = compiler.parse({ content: input, ctx: ctx });
        _assert.assert.equal(out, '--');
    });
    it('can render nested reference blocks', function () {
        var input = '{#person}{#names}{first} - {last}{/names}{/person}';
        var ctx = { person: { names: { first: 'shane', last: 'osbourne' } } };
        var compiler = _cblang$builder.builder();
        var out = compiler.parse({ content: input, ctx: ctx });
        console.log([out]);
    });
    it.only('can render multiple nested reference blocks', function () {
        var input = '{#person}{#names}{first} - {last}{/names}{/person}{#address}{town}{/address}';
        var ctx = {
            person: {
                names: {
                    first: 'shane',
                    last: 'osbourne'
                }
            },
            address: {
                town: 'Mansfield'
            }
        };
        var compiler = _cblang$builder.builder();
        var out = compiler.parse({ content: input, ctx: ctx });
        console.log([out]);
    });
});