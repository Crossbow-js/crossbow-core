'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var input1 = 'hello {name}';

describe('Compiling references', function () {
    it('can remove unkown compile reference', function () {
        var out = _cblang$builder2['default']({ content: input1 });
        _assert.assert.equal(out, 'hello ');
    });
    it('can add reference from ctx', function () {
        var ctx = { name: 'shane' };
        var out = _cblang$builder2['default']({ content: input1, ctx: ctx });
        _assert.assert.equal(out, 'hello shane');
    });
    it('can add reference from ctx path', function () {
        var ctx = { person: { name: 'shane' } };
        var out = _cblang$builder2['default']({ content: 'hello {person.name}', ctx: ctx });
        _assert.assert.equal(out, 'hello shane');
    });
    it('can remove unknown from ctx path', function () {
        var ctx = { person: { name: 'shane' } };

        var compiler = _cblang$builder.builder();
        var spy = _sinon2['default'].spy(compiler, 'error');
        var out = compiler.parse({ content: 'hello {person.surname}', ctx: ctx });
        _assert.assert.equal(out, 'hello ');
        _sinon2['default'].assert.called(spy);
    });
});