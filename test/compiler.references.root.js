'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var input1 = '{#names}{first} loves {$.site.title}{/names}';

describe('Compiling references', function () {
    it('can begin lookup from root element', function () {
        var out = (0, _libIndexJs2['default'])({ content: input1, ctx: {
                site: {
                    title: "Crossbow"
                },
                names: {
                    first: 'kittie'
                }
            } });
        _chai.assert.equal(out, 'kittie loves Crossbow');
    });
});