'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('@loop helper for object iteration', function () {
    it('can render a loop over an object', function () {

        var input1 = '{@loop:pkg}{$key} : {$value}{/loop}';

        var compiler = _cblang$builder.builder();

        var out = compiler.parse({
            content: input1,
            ctx: {
                pkg: {
                    version: '1.2'
                }
            }
        });

        _assert.assert.equal(out, 'version : 1.2');
    });
});