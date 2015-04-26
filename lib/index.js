'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _nodes = require('./nodes');

var _nodes2 = _interopRequireDefault(_nodes);

var _parser = require('../src/parser');

var _parser2 = _interopRequireDefault(_parser);

function process(ast, ctx) {
    return ast.reduce(function (all, item) {
        if (item.skip) {
            return all;
        }
        if (_nodes2['default'][item.type]) {
            all += _nodes2['default'][item.type](item, ctx.data);
        }
        return all;
    }, '');
}

function firstPass(ast) {
    return ast.map(function (item, i, all) {
        if (item.type === '#') {
            if (all[i - 1].type === 'format') {
                all[i - 1].skip = true;
            }
            if (item.bodies) {
                var next = item.bodies[item.bodies.length - 1];
                if (next && next.type === 'format') {
                    next.skip = true;
                }
                item.bodies = firstPass(item.bodies);
            }
        }
        return item;
    });
}

exports['default'] = function (input) {
    var ctx = arguments[1] === undefined ? {} : arguments[1];

    var ast = _parser2['default'].parse(input);
    ast = firstPass(ast);

    return process(ast, { data: ctx });
};

module.exports = exports['default'];