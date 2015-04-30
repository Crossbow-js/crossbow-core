'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Compiling references blocks', function () {
    it.only('can render basic block', function () {
        var input = '{#names}\n{this}\n{/names}';
        var ctx = { person: { name: 'shane' } };
        var compiler = _cblang$builder.builder();
        var out = compiler.parse({ content: input, ctx: ctx });
        console.log(out);
        //assert.equal(out, 'hello ');
    });
});