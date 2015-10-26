'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _chai = require('chai');

var input = 'Hey there';
var input1 = '{@hl lang="js"}' + input + '{/hl}';

describe('@Helpers - inline', function () {
    it('Can access data', function () {

        var ast = (0, _srcParserJs.parse)('{@hl src="somefilepath.js" /}');

        _chai.assert.equal(ast[0].type, '@');
        _chai.assert.equal(ast[0].identifier.type, 'key');
        _chai.assert.equal(ast[0].identifier.value, 'hl');
        _chai.assert.equal(ast[0].params[0].key, 'src');
        _chai.assert.equal(ast[0].params[0].value.type, 'string');
        _chai.assert.equal(ast[0].params[0].value.value, 'somefilepath.js');
    });
});