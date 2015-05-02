'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _process = require('./');

var _objpath = require('object-path');

var _objpath2 = _interopRequireDefault(_objpath);

function getId(item, ctx) {
    if (ctx.data[item.id]) {
        return ctx.data[item.id];
    }
}

function lookup(value, ctx) {}

exports['default'] = {
    buffer: function bufferNode(_ref) {
        var node = _ref.node;
        var ctx = _ref.ctx;
        var compiler = _ref.compiler;

        return node.value;
    },
    tag: function tagNode(_ref2) {
        var node = _ref2.node;
        var ctx = _ref2.ctx;
        var compiler = _ref2.compiler;

        var replacement = getId(node, ctx);
        return replacement;
    },
    format: function formatNode(_ref3) {
        var node = _ref3.node;
        var ctx = _ref3.ctx;
        var compiler = _ref3.compiler;

        return node.raw;
    },
    '@': function atNode(_ref4) {
        var node = _ref4.node;
        var ctx = _ref4.ctx;
        var compiler = _ref4.compiler;

        if (node.raw) {
            if (compiler.helpers[node.identifier.value]) {
                return compiler.helpers[node.identifier.value]({ node: node, ctx: ctx, compiler: compiler });
            }
        }
        return '';
    },
    '#': function lookupNode(_ref5) {
        var node = _ref5.node;
        var ctx = _ref5.ctx;
        var compiler = _ref5.compiler;

        if (node.bodies) {

            var curr = ctx[node.identifier.value];

            if (typeof curr === 'undefined') {
                return ''; // no context
            }

            if (typeof curr === 'number' || typeof curr === 'string') {
                return curr;
            }

            if (Array.isArray(curr)) {
                return curr.reduce(function (all, currContext, i) {

                    currContext.$this = currContext;
                    currContext.$index = i;
                    currContext.$length = currContext.length;
                    all += compiler.process({ ast: node.bodies, ctx: currContext, compiler: compiler });

                    return all;
                }, '');
            }

            if (typeof curr === 'object') {
                if (Object.keys(curr).length) {
                    var out = Object.keys(curr).reduce(function (all, key, i) {
                        var currContext = {
                            $key: String(key),
                            $value: String(curr[key]),
                            $this: String(curr[key]),
                            $index: String(i)
                        };
                        all += compiler.process({ ast: node.bodies, ctx: currContext, compiler: compiler });
                        return all;
                    }, '');
                    return out;
                }
            }
        }
    },
    reference: function referenceNode(_ref6) {
        var node = _ref6.node;
        var ctx = _ref6.ctx;
        var compiler = _ref6.compiler;

        var modifiers = node.modifiers || [];
        var value;

        if (node.identifier.type === 'key') {
            if (node.identifier.paths) {
                value = _objpath2['default'].get(ctx, node.identifier.value);
            } else {
                value = ctx[node.identifier.value];
            }
        }

        if (typeof value === 'undefined') {
            compiler.error('Failed to access ' + node.identifier.value + '. An empty string will be used instead');
            value = '';
            return value;
        }

        if (modifiers.length) {
            modifiers.forEach(function (item) {
                if (item.type === 'filter') {
                    if (compiler.filters[item.value]) {
                        value = compiler.filters[item.value]({ value: value, args: item.args, ctx: ctx, node: node, compiler: compiler });
                    }
                }
                if (item.type === 'modifier') {
                    try {
                        var mod = require(item.namespace);
                        var method = mod[item.method];
                        if (typeof method === 'function') {
                            value = method.apply(undefined, _toConsumableArray([value].concat(item.args.map(function (x) {
                                return x.value;
                            }))));
                        } else {
                            console.error('`' + item.method + '` method could not be found in module `' + item.namespace + '`');
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
        }

        return value;
    }
};
module.exports = exports['default'];