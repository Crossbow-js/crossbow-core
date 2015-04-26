'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _cblang = require('../lib/index.js');

var _cblang2 = _interopRequireDefault(_cblang);

var _assert = require('chai');

describe('Parsing strings', function () {
    it('can be used without context', function () {
        var input = 'shane';
        var output = _cblang2['default'](input);
        _assert.assert.equal(output, 'shane');
    });
});