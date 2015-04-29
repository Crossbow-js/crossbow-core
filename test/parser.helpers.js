'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang = require('../lib/index.js');

var _cblang2 = _interopRequireDefault(_cblang);

var _parse = require('../src/parser.js');

var _assert = require('chai');

var input = 'Hey there';
var input1 = '{@hl lang="js"}' + input + '{/hl}';

describe.skip('Helpers', function () {
    it('Can access data', function () {
        //it('Can ALWAYS access raw input', () => {
        var ast = _parse.parse(input1);
        _assert.assert.equal(ast[0].type, '@');
        _assert.assert.equal(ast[0].identifier.type, 'key');
        _assert.assert.equal(ast[0].identifier.value, 'hl');
        //writeFileSync('./ast.json', JSON.stringify(ast, null, 4));
        _assert.assert.equal(ast[0].raw, input);
        var output = _cblang2['default']({ content: '{@hl}-{shane}-{/hl}', ctx: { shane: 'awesome' } });
    });
});