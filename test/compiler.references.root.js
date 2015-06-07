'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang$builder = require('../lib/index.js');

var _cblang$builder2 = _interopRequireDefault(_cblang$builder);

var _parse = require('../src/parser.js');

var _writeFileSync = require('fs');

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var input1 = '{#names}{first} loves {$.site.title}{/names}';

describe('Compiling references', function () {
    it('can begin lookup from root element', function () {
        var out = _cblang$builder2['default']({ content: input1, ctx: {
                site: {
                    title: 'Crossbow'
                },
                names: {
                    first: 'kittie'
                }
            } });
        _assert.assert.equal(out, 'kittie loves Crossbow');
    });
});