'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$process = require('../lib/index.js');

var _cblang$process2 = _interopRequireDefault(_cblang$process);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var input = 'Hey there';
var input1 = '{@hl lang="js"}' + input + '{/hl}';

describe('Blocks', function () {
    it('Can ALWAYS access raw input', function () {
        var ast = _parse.parse(input1);
        _assert.assert.equal(ast[0].type, '@');
        _assert.assert.equal(ast[0].identifier.type, 'key');
        _assert.assert.equal(ast[0].identifier.value, 'hl');
        //writeFileSync('./ast.json', JSON.stringify(ast, null, 4));
        _assert.assert.equal(ast[0].raw, input);
    });
});