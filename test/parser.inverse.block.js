'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var input1 = '{@if:name}{name}{:else}anon{/if}';

describe('Inverse blocks', function () {
    it('can parse blocks with inverse alternative', function () {
        var ast = (0, _srcParserJs.parse)(input1);
        _chai.assert.equal(ast[0].type, '@');
        _chai.assert.equal(ast[0].bodies.length, '1');
        _chai.assert.equal(ast[0].bodies[0].type, 'reference');
        _chai.assert.equal(ast[0].inverse[0].identifier.type, 'key');
        _chai.assert.equal(ast[0].inverse[0].identifier.value, 'else');
        _chai.assert.equal(ast[0].inverse[0].bodies.length, 1);
        _chai.assert.equal(ast[0].inverse[0].bodies[0].type, 'buffer');
        _chai.assert.equal(ast[0].inverse[0].bodies[0].value, 'anon');
    });
});