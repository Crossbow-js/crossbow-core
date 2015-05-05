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

        if (compiler.helpers[node.identifier.value]) {
            return compiler.helpers[node.identifier.value]({ node: node, ctx: ctx, compiler: compiler });
        }
        return '';
    },
    '#': function referenceBlock(_ref5) {
        var node = _ref5.node;
        var ctx = _ref5.ctx;
        var compiler = _ref5.compiler;

        if (node.bodies) {
            var _ret = (function () {

                var curr = compiler.resolveValue({ node: node, ctx: ctx });

                if (typeof curr.value === 'undefined') {
                    return {
                        v: ''
                    }; // no context
                }

                if (typeof curr.value === 'number' || typeof curr.value === 'string') {
                    return {
                        v: curr.value
                    };
                }

                if (Array.isArray(curr.value)) {

                    return {
                        v: curr.value.reduce(function (all, item, i) {
                            all += compiler.process({ ast: node.bodies, ctx: curr.ctx.concat(i) });
                            return all;
                        }, '')
                    };
                }

                if (typeof curr.value === 'object') {
                    return {
                        v: compiler.process({ ast: node.bodies, ctx: curr.ctx })
                    };
                }
            })();

            if (typeof _ret === 'object') {
                return _ret.v;
            }
        }
    },
    reference: function referenceNode(_ref6) {
        var node = _ref6.node;
        var ctx = _ref6.ctx;
        var compiler = _ref6.compiler;

        var modifiers = node.modifiers || [];
        var curr = compiler.resolveValue({ ctx: ctx, node: node });
        var outValue = curr.value;

        if (typeof curr.value === 'undefined') {
            compiler.error('Failed to access ' + node.identifier.value + '. An empty string will be used instead');
            return '';
        }

        if (modifiers.length) {
            modifiers.forEach(function (item) {
                if (item.type === 'filter') {
                    if (compiler.filters[item.value]) {
                        outValue = compiler.filters[item.value]({ value: curr.value, args: item.args, ctx: ctx, node: node, compiler: compiler });
                    }
                }
                if (item.type === 'modifier') {
                    try {
                        var mod = require(item.namespace);
                        var method = mod[item.method];
                        if (typeof method === 'function') {
                            outValue = method.apply(undefined, _toConsumableArray([outValue].concat(item.args.map(function (x) {
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

        return outValue;
    }
};
module.exports = exports['default'];