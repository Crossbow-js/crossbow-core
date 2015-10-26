'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var input1 = 'hello {name}';

describe('Compiling references', function () {
    it('can remove unkown compile reference', function () {
        var out = (0, _libIndexJs2['default'])({ content: input1 });
        _chai.assert.equal(out, 'hello ');
    });
    it('can add reference from ctx', function () {
        var ctx = { name: 'shane' };
        var out = (0, _libIndexJs2['default'])({ content: input1, ctx: ctx });
        _chai.assert.equal(out, 'hello shane');
    });
    it('can add reference from ctx path', function () {
        var ctx = { person: { name: 'shane', age: 20 } };
        var out = (0, _libIndexJs2['default'])({ content: 'hello {person.name} {person.age}', ctx: ctx });
        _chai.assert.equal(out, 'hello shane 20');
    });
    it('can add reference from ctx with array notation', function () {
        var ctx = { people: ['shane', 'kittie'] };
        var out = (0, _libIndexJs2['default'])({ content: 'hello {people[0]} & {people[1]}', ctx: ctx });
        _chai.assert.equal(out, 'hello shane & kittie');
    });
});