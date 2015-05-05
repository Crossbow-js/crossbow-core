import {process} from './';
import objpath   from 'object-path';

function getId (item, ctx) {
    if (ctx.data[item.id]) {
        return ctx.data[item.id];
    }
}

function lookup (value, ctx) {

}

export default {
    buffer: function bufferNode({node, ctx, compiler}) {
        return node.value;
    },
    tag: function tagNode ({node, ctx, compiler}) {
        var replacement = getId(node, ctx);
        return replacement;
    },
    format: function formatNode({node, ctx, compiler}) {
        return node.raw;
    },
    "@": function atNode({node, ctx, compiler}) {
            if (compiler.helpers[node.identifier.value]) {
                return compiler.helpers[node.identifier.value]({node, ctx, compiler});
            }
        return '';
    },
    "#": function referenceBlock({node, ctx, compiler}) {

        if (node.bodies) {

            let curr = compiler.resolveValue({node, ctx});

            if (typeof curr === 'undefined') {
                return ''; // no context
            }

            if (typeof curr === 'number' || typeof curr === 'string') {
                return curr;
            }

            //if (Array.isArray(curr)) {
            //
            //    return curr.reduce(function (all, currContext, i) {
            //
            //        currContext.$this    = currContext;
            //        currContext.$index   = i;
            //        currContext.$length  = currContext.length;
            //        all += compiler.process({ast: node.bodies, ctx: currContext});
            //
            //        return all;
            //    }, '');
            //}

            if (typeof curr === 'object') {

                //console.log(compiler._ctx);
                //console.log(compiler._ctxPath);
                //console.log(node);
                //if (Object.keys(curr).length) {
                //    var out = Object.keys(curr).reduce(function (all, key, i) {
                //        var currContext = {
                //            $key:    String(key),
                //            $value:  String(curr[key]),
                //            $this:   String(curr[key]),
                //            $index:  String(i)
                //        };
                //        all += compiler.process({ast: node.bodies, ctx: currContext, compiler});
                //        return all;
                //    }, '');
                //    return out;
                //}
                return compiler.process({ast: node.bodies, ctx: ctx.concat(node.identifier.value)});
            }
        }
    },
    reference: function referenceNode({node, ctx, compiler}) {

        var modifiers = node.modifiers || [];
        let value = compiler.resolveValue(ctx, node);

        if (typeof value === 'undefined') {
            compiler.error(`Failed to access ${node.identifier.value}. An empty string will be used instead`);
            value = '';
            return value;
        }

        if (modifiers.length) {
            modifiers.forEach(function (item) {
                if (item.type === 'filter') {
                    if (compiler.filters[item.value]) {
                        value = compiler.filters[item.value]({value, args: item.args, ctx, node, compiler});
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
