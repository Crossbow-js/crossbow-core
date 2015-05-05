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

            if (typeof curr.value === 'undefined') {
                return ''; // no context
            }

            if (typeof curr.value === 'number' || typeof curr.value === 'string') {
                return curr.value;
            }

            if (Array.isArray(curr.value)) {

                return curr.value.reduce(function (all, item, i) {
                    all += compiler.process({ast: node.bodies, ctx: curr.ctx.concat(i)});
                    return all;
                }, '');
            }

            if (typeof curr.value === 'object') {
                return compiler.process({ast: node.bodies, ctx: curr.ctx});
            }
        }
    },
    reference: function referenceNode({node, ctx, compiler}) {

        var modifiers = node.modifiers || [];
        let curr = compiler.resolveValue({ctx, node});
        let outValue = curr.value;

        if (typeof curr.value === 'undefined') {
            compiler.error(`Failed to access ${node.identifier.value}. An empty string will be used instead`);
            return '';
        }

        if (modifiers.length) {
            modifiers.forEach(function (item) {
                if (item.type === 'filter') {
                    if (compiler.filters[item.value]) {
                        outValue = compiler.filters[item.value]({value: curr.value, args: item.args, ctx, node, compiler});
                    }
                }
                if (item.type === 'modifier') {
                    try {
                        var mod = require(item.namespace);
                        var method = mod[item.method];
                        if (typeof method === 'function') {
                            outValue = method(...[outValue].concat(item.args.map(x => x.value)));
                        } else {
                            console.error(`\`${item.method}\` method could not be found in module \`${item.namespace}\``);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
        }

        return outValue;
    }
}
