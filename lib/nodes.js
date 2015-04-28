'use strict';

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _process = require('./');

function getId(item, ctx) {
    if (ctx.data[item.id]) {
        return ctx.data[item.id];
    }
}

exports['default'] = {
    buffer: function buffer(item, ctx) {
        return item.value;
    },
    tag: function tag(item, ctx) {
        var replacement = getId(item, ctx);
        return replacement;
    },
    format: function format(item) {
        return item.raw;
    },
    '@': function _(_ref) {
        var node = _ref.node;
        var ctx = _ref.ctx;
        var compiler = _ref.compiler;

        if (node.raw) {
            if (compiler.helpers[node.identifier.value]) {
                return compiler.helpers[node.identifier.value]({ node: node, ctx: ctx, compiler: compiler });
            }
        }
        return '';
    },
    '#': function _(_ref2) {
        var node = _ref2.node;
        var ctx = _ref2.ctx;
        var compiler = _ref2.compiler;

        if (item.bodies) {

            var curr = ctx[item.identifier.value];

            if (typeof curr === 'undefined') {
                return ''; // no context
            }

            if (typeof curr === 'number' || typeof curr === 'string') {
                return curr;
            }

            if (Array.isArray(curr)) {
                return curr.reduce(function (all, _ctx, i) {

                    _ctx.$this = _ctx;
                    _ctx.$index = i;
                    _ctx.$length = _ctx.length;

                    all += _process.process(item.bodies, { data: _ctx });

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
                        all += _process.process(item.bodies, {
                            data: currContext
                        });
                        return all;
                    }, '');
                    return out;
                }
            }
        }
    },
    reference: function reference(_ref3) {
        var node = _ref3.node;
        var ctx = _ref3.ctx;
        var compiler = _ref3.compiler;

        var modifiers = node.modifiers || [];
        var value;

        if (node.identifier.type === 'key') {
            if (node.identifier.paths) {
                value = require('object-path').get(ctx, node.identifier.value);
            } else {
                value = ctx[node.identifier.value] || '';
            }
        }

        if (modifiers.length) {
            modifiers.forEach(function (item) {
                if (item.type === 'filter') {
                    if (compiler.filters[item.value]) {
                        value = compiler.filters[item.value](value, ctx);
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