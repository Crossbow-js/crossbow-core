'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$process = require('../lib/index.js');

var _cblang$process2 = _interopRequireDefault(_cblang$process);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var input1 = '{@if:name}{name}{:else}anon{/if}';

describe('Inverse blocks', function () {
    it('can parse blocks with inverse alternative', function () {
        var ast = _parse.parse(input1);
        _assert.assert.equal(ast[0].type, '@');
        _assert.assert.equal(ast[0].bodies.length, '1');
        _assert.assert.equal(ast[0].bodies[0].type, 'reference');
        _assert.assert.equal(ast[0].inverse[0].identifier.type, 'key');
        _assert.assert.equal(ast[0].inverse[0].identifier.value, 'else');
        _assert.assert.equal(ast[0].inverse[0].bodies.length, 1);
        _assert.assert.equal(ast[0].inverse[0].bodies[0].type, 'buffer');
        _assert.assert.equal(ast[0].inverse[0].bodies[0].value, 'anon');
    });
});