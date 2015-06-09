'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang = require('../lib/index.js');

var _cblang2 = _interopRequireDefault(_cblang);

var _parse = require('../src/parser.js');

var _assert = require('chai');

var input = 'Hey there';
var input1 = '{@hl lang="js"}' + input + '{/hl}';

describe('@Helpers - inline', function () {
    it('Can access data', function () {

        var ast = _parse.parse('{@hl src="somefilepath.js" /}');

        _assert.assert.equal(ast[0].type, '@');
        _assert.assert.equal(ast[0].identifier.type, 'key');
        _assert.assert.equal(ast[0].identifier.value, 'hl');
        _assert.assert.equal(ast[0].params[0].key, 'src');
        _assert.assert.equal(ast[0].params[0].value.type, 'string');
        _assert.assert.equal(ast[0].params[0].value.value, 'somefilepath.js');
    });
});