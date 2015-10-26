'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _chai = require('chai');

describe('Filters', function () {
    it('can be used without context', function () {
        var input = 'shane';
        var output = (0, _srcParserJs.parse)(input);
        _chai.assert.equal(output.length, 1);
        _chai.assert.equal(output[0].type, 'buffer');
        _chai.assert.equal(output[0].value, 'shane');
    });
    it('1 filter', function () {
        var input = '{shane|upper}';
        var output = (0, _srcParserJs.parse)(input);
        _chai.assert.equal(output.length, 1);
        _chai.assert.equal(output[0].type, 'reference');
        _chai.assert.equal(output[0].identifier.type, 'key');
        _chai.assert.equal(output[0].identifier.value, 'shane');
        _chai.assert.equal(output[0].modifiers.length, 1);
        _chai.assert.equal(output[0].modifiers[0].type, 'filter');
        _chai.assert.equal(output[0].modifiers[0].value, 'upper');
    });
    it('1 modifier', function () {
        var input = '{shane|lodash:upper}';
        var output = (0, _srcParserJs.parse)(input);
        _chai.assert.equal(output.length, 1);
        _chai.assert.equal(output[0].type, 'reference');
        _chai.assert.equal(output[0].identifier.type, 'key');
        _chai.assert.equal(output[0].identifier.value, 'shane');
        _chai.assert.equal(output[0].modifiers.length, 1);
        _chai.assert.equal(output[0].modifiers[0].namespace, 'lodash');
        _chai.assert.equal(output[0].modifiers[0].method, 'upper');
    });
    it('2 modifiers', function () {
        var input = '{shane|lodash:upper|moment:kill}';
        var output = (0, _srcParserJs.parse)(input);
        _chai.assert.equal(output.length, 1);
        _chai.assert.equal(output[0].type, 'reference');
        _chai.assert.equal(output[0].identifier.type, 'key');
        _chai.assert.equal(output[0].identifier.value, 'shane');
        _chai.assert.equal(output[0].modifiers.length, 2);
        _chai.assert.equal(output[0].modifiers[0].namespace, 'lodash');
        _chai.assert.equal(output[0].modifiers[1].namespace, 'moment');
    });
    it('2 modifiers + filter', function () {
        var input = '{shane|lodash:upper|moment:kill|truncate}';
        var output = (0, _srcParserJs.parse)(input);
        _chai.assert.equal(output.length, 1);
        _chai.assert.equal(output[0].type, 'reference');
        _chai.assert.equal(output[0].identifier.type, 'key');
        _chai.assert.equal(output[0].identifier.value, 'shane');
        _chai.assert.equal(output[0].modifiers.length, 3);
        _chai.assert.equal(output[0].modifiers[0].namespace, 'lodash');
        _chai.assert.equal(output[0].modifiers[1].namespace, 'moment');
        _chai.assert.equal(output[0].modifiers[2].type, 'filter');
        _chai.assert.equal(output[0].modifiers[2].value, 'truncate');
    });
    it('filter first + 2 modifiers', function () {
        var input = '{shane|upper|lodash:upper|moment:kill}';
        var output = (0, _srcParserJs.parse)(input);
        _chai.assert.equal(output.length, 1);
        _chai.assert.equal(output[0].type, 'reference');
        _chai.assert.equal(output[0].identifier.type, 'key');
        _chai.assert.equal(output[0].identifier.value, 'shane');
        _chai.assert.equal(output[0].modifiers.length, 3);
        _chai.assert.equal(output[0].modifiers[0].type, 'filter');
        _chai.assert.equal(output[0].modifiers[0].value, 'upper');
        _chai.assert.equal(output[0].modifiers[1].type, 'modifier');
        _chai.assert.equal(output[0].modifiers[1].namespace, 'lodash');
        _chai.assert.equal(output[0].modifiers[1].method, 'upper');
        _chai.assert.equal(output[0].modifiers[2].type, 'modifier');
        _chai.assert.equal(output[0].modifiers[2].namespace, 'moment');
        _chai.assert.equal(output[0].modifiers[2].method, 'kill');
    });
    it('2 filters', function () {
        var input = '{shane|upper|other}';
        var output = (0, _srcParserJs.parse)(input);
        _chai.assert.equal(output.length, 1);
        _chai.assert.equal(output[0].type, 'reference');
        _chai.assert.equal(output[0].identifier.type, 'key');
        _chai.assert.equal(output[0].identifier.value, 'shane');
        _chai.assert.equal(output[0].modifiers.length, 2);
        _chai.assert.equal(output[0].modifiers[0].value, 'upper');
        _chai.assert.equal(output[0].modifiers[1].value, 'other');
    });
});