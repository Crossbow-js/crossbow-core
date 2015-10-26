'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var input1 = 'hello {name}';

describe('References', function () {
    it('can parse reference as key', function () {
        var ast = (0, _srcParserJs.parse)(input1);
        _chai.assert.equal(ast[0].type, 'buffer');
        _chai.assert.equal(ast[0].value, 'hello ');
        _chai.assert.equal(ast[1].type, 'reference');
        _chai.assert.equal(ast[1].identifier.type, 'key');
        _chai.assert.equal(ast[1].identifier.value, 'name');
        _chai.assert.isUndefined(ast[1].identifier.paths);
    });
    it('can parse reference as path', function () {
        var ast = (0, _srcParserJs.parse)('hello {person.name}');
        _chai.assert.equal(ast[0].type, 'buffer');
        _chai.assert.equal(ast[0].value, 'hello ');
        _chai.assert.equal(ast[1].type, 'reference');
        _chai.assert.equal(ast[1].identifier.type, 'key');
        _chai.assert.equal(ast[1].identifier.value, 'person.name');
        _chai.assert.equal(ast[1].identifier.paths[0], 'person');
        _chai.assert.equal(ast[1].identifier.paths[1], 'name');
    });
    it('can parse reference as path with array notation', function () {
        var ast = (0, _srcParserJs.parse)('hello {person.name[0]}');
        _chai.assert.equal(ast[0].type, 'buffer');
        _chai.assert.equal(ast[0].value, 'hello ');
        _chai.assert.equal(ast[1].type, 'reference');
        _chai.assert.equal(ast[1].identifier.type, 'key');
        _chai.assert.equal(ast[1].identifier.value, 'person.name.0');
        _chai.assert.equal(ast[1].identifier.paths[0], 'person');
        _chai.assert.equal(ast[1].identifier.paths[1], 'name');
        _chai.assert.deepEqual(ast[1].identifier.paths[2], 0);
    });
});