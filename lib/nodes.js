'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _filters2 = require('./filters');

var _filters3 = _interopRequireDefault(_filters2);

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
    '#': function _(item, ctx) {

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
    reference: function reference(item, ctx) {
        var modifiers = item.modifiers || [];
        var value;

        if (item.identifier.type === 'key') {
            if (item.identifier.paths) {
                value = require('object-path').get(ctx, item.identifier.value);
            } else {
                value = ctx[item.identifier.value] || '';
            }
        }

        if (modifiers.length) {
            modifiers.forEach(function (item) {
                if (item.type === 'filter') {
                    if (_filters3['default'][item.value]) {
                        value = _filters3['default'][item.value](value, ctx);
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