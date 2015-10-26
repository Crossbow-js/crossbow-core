'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndexJs = require('../lib/index.js');

var _libIndexJs2 = _interopRequireDefault(_libIndexJs);

var _srcParserJs = require('../src/parser.js');

var _fs = require('fs');

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('@loop helper with $this', function () {
    it('can render a loop over an array', function () {

        var input1 = '{@loop:names}{$this}{/loop}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                names: ['shane', 'kittie']
            }
        });

        _chai.assert.equal(out, 'shanekittie');
    });
    it('can access current loop index', function () {

        var input1 = '{@loop:names}{$idx}{/loop}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                names: ['shane', 'kittie']
            }
        });

        _chai.assert.equal(out, '01');
    });
    it('can access current loop index + 1', function () {

        var input1 = '{@loop:names}{$idx1}{/loop}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                names: ['shane', 'kittie']
            }
        });

        _chai.assert.equal(out, '12');
    });
    it('can render a loop over an array from initial path lookup', function () {

        var input1 = '{@loop:info.names}{$this}{/loop}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                info: {
                    names: ['shane', 'kittie']
                }
            }
        });

        _chai.assert.equal(out, 'shanekittie');
    });
    it('can render a loop over an array with path access', function () {

        var input1 = '{@loop:names}{$this.first}{/loop}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                names: [{
                    first: 'shane',
                    last: 'osbourne'
                }, {
                    first: 'kittie',
                    last: 'bastard'
                }]
            }
        });

        _chai.assert.equal(out, 'shanekittie');
    });
    it('can render a loop over an array with ROOT path access', function () {

        var input1 = '{@loop:$.site.nav}{$this.url}{/loop}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                site: {
                    nav: [{
                        url: '/css'
                    }, {
                        url: '/js'
                    }]
                }
            }
        });

        _chai.assert.equal(out, '/css/js');
    });
    it('can access current value via a .', function () {

        var input1 = '{@loop:$.site.nav}{.}{/loop}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                site: {
                    nav: ['/css', '/js']
                }
            }
        });

        _chai.assert.equal(out, '/css/js');
    });
    it('can access previous value via ../', function () {

        var input1 = '{#site}{@loop:nav}{../title} - {.}{/loop}{/site}';

        var compiler = (0, _libIndexJs.builder)();

        var out = compiler.parse({
            content: input1,
            ctx: {
                site: {
                    title: 'Crossbow',
                    nav: ['/css', '/js']
                }
            }
        });

        _chai.assert.equal(out, 'Crossbow - /cssCrossbow - /js');
    });
});