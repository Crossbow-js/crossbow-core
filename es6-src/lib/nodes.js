import {process} from './';

function getId (item, ctx) {
    if (ctx.data[item.id]) {
        return ctx.data[item.id];
    }
}

export default {
    buffer: function (item, ctx) {
        return item.value;
    },
    tag: function (item, ctx) {
        var replacement = getId(item, ctx);
        return replacement;
    },
    format: function (item) {
        return item.raw;
    },
    "@" ({node, ctx, compiler}) {
        if (node.raw) {
            if (compiler.helpers[node.identifier.value]) {
                return compiler.helpers[node.identifier.value]({node, ctx, compiler});
            }
        }
        return '';
    },
    "#": function ({node, ctx, compiler}) {

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

                    _ctx.$this    = _ctx;
                    _ctx.$index   = i;
                    _ctx.$length  = _ctx.length;

                    all += process(item.bodies, {data: _ctx});

                    return all;
                }, '');
            }


            if (typeof curr === 'object') {
                if (Object.keys(curr).length) {
                    var out = Object.keys(curr).reduce(function (all, key, i) {
                        var currContext = {
                            $key:    String(key),
                            $value:  String(curr[key]),
                            $this:   String(curr[key]),
                            $index:  String(i)
                        };
                        all += process(item.bodies, {
                                data: currContext
                            }
                        );
                        return all;
                    }, '');
                    return out;
                }
            }
        }
    },
    reference: function ({node, ctx, compiler}) {
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
                            value = method(...[value].concat(item.args.map(x => x.value)));
                        } else {
                            console.error(`\`${item.method}\` method could not be found in module \`${item.namespace}\``);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            })
        }

        return value;
    }
}
