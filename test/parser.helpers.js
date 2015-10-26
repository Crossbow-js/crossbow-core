'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _chai = require('chai');

var input = 'Hey there';
var input1 = '{@hl lang="js"}' + input + '{/hl}';

describe.skip('Helpers', function () {
    it('Can access data', function () {
        //it('Can ALWAYS access raw input', () => {
        var ast = (0, _srcParserJs.parse)(input1);
        _chai.assert.equal(ast[0].type, '@');
        _chai.assert.equal(ast[0].identifier.type, 'key');
        _chai.assert.equal(ast[0].identifier.value, 'hl');
        //writeFileSync('./ast.json', JSON.stringify(ast, null, 4));
        _chai.assert.equal(ast[0].raw, input);
        var output = (0, _libIndexJs2['default'])({ content: '{@hl}-{shane}-{/hl}', ctx: { shane: 'awesome' } });
    });
});