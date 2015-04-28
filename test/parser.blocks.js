'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang = require('../lib/index.js');

var _cblang2 = _interopRequireDefault(_cblang);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var input1 = '{@hl}\nYo there\n{/hl}';

describe('Blocks', function () {
    it.only('Can ALWAYS access raw input', function () {
        var output = _parse.parse(input1);

        _assert.assert.equal(output[0].type, '@');
        _assert.assert.equal(output[0].identifier.type, 'key');
        _assert.assert.equal(output[0].identifier.value, 'hl');

        _writeFileSync.writeFileSync('./ast.json', JSON.stringify(output, null, 4));

        _assert.assert.equal(output[0].body.raw, input1);
    });
});