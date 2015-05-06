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
        var ctx = { person: { name: 'shane', age: 20 } };
        var out = _cblang$builder2['default']({ content: 'hello {person.name} {person.age}', ctx: ctx });
        _assert.assert.equal(out, 'hello shane 20');
    });
    it('can add reference from ctx with array notation', function () {
        var ctx = { people: ['shane', 'kittie'] };
        var out = _cblang$builder2['default']({ content: 'hello {people[0]} & {people[1]}', ctx: ctx });
        _assert.assert.equal(out, 'hello shane & kittie');
    });
});