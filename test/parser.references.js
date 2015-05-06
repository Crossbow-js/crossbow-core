'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$process = require('../lib/index.js');

var _cblang$process2 = _interopRequireDefault(_cblang$process);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var input1 = 'hello {name}';

describe('References', function () {
    it('can parse reference as key', function () {
        var ast = _parse.parse(input1);
        _assert.assert.equal(ast[0].type, 'buffer');
        _assert.assert.equal(ast[0].value, 'hello ');
        _assert.assert.equal(ast[1].type, 'reference');
        _assert.assert.equal(ast[1].identifier.type, 'key');
        _assert.assert.equal(ast[1].identifier.value, 'name');
        _assert.assert.isUndefined(ast[1].identifier.paths);
    });
    it('can parse reference as path', function () {
        var ast = _parse.parse('hello {person.name}');
        _assert.assert.equal(ast[0].type, 'buffer');
        _assert.assert.equal(ast[0].value, 'hello ');
        _assert.assert.equal(ast[1].type, 'reference');
        _assert.assert.equal(ast[1].identifier.type, 'key');
        _assert.assert.equal(ast[1].identifier.value, 'person.name');
        _assert.assert.equal(ast[1].identifier.paths[0], 'person');
        _assert.assert.equal(ast[1].identifier.paths[1], 'name');
    });
    it('can parse reference as path with array notation', function () {
        var ast = _parse.parse('hello {person.name[0]}');
        _assert.assert.equal(ast[0].type, 'buffer');
        _assert.assert.equal(ast[0].value, 'hello ');
        _assert.assert.equal(ast[1].type, 'reference');
        _assert.assert.equal(ast[1].identifier.type, 'key');
        _assert.assert.equal(ast[1].identifier.value, 'person.name.0');
        _assert.assert.equal(ast[1].identifier.paths[0], 'person');
        _assert.assert.equal(ast[1].identifier.paths[1], 'name');
        _assert.assert.deepEqual(ast[1].identifier.paths[2], 0);
    });
});