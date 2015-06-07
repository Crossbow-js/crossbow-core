import helpers from './helpers';
import filters from './filters';
import nodes   from './nodes';
import {formattingPass} from './ast-transforms';
import parser  from '../src/parser';
import {writeFileSync}  from 'fs';
import Immutable  from 'immutable';

export default class Compiler {

    constructor (opts) {
        this.opts = opts;
        this.helpers = helpers;
        this.filters = filters;
        this.nodes   = nodes;
    }

    /**
     *
     * @param content
     * @param opts
     * @param ctx
     * @returns {*}
     */
    parse ({content, opts = {}, ctx = {}}) {

        let compiler       = this;
        let ast            = parser.parse(content);
        writeFileSync('ast.json', JSON.stringify(ast, null, 4));
        compiler._original = content;
        compiler._ctx      = Immutable.fromJS(ctx);
        compiler._ctxPath  = [];
        return compiler.process({ast, ctx: [], compiler});
    }

    /**
     * Final step, transform AST > String
     * by visiting each node
     * @param ast
     * @param ctx
     * @returns {*}
     */
    process ({ast, ctx}) {

        let compiler = this;

        ast = formattingPass({ast, compiler, ctx});

        return ast.reduce(function (all, node) {
            if (node.skip) {
                return all;
            }
            if (compiler.nodes[node.type]) {
                all += compiler.nodes[node.type]({node, ctx, compiler});
            }

            return all;
        }, '');
    }

    /**
     * Given an array of paths, lookup an item
     * from the immutable configuration given.
     *
     * Eg: $this.names[0].first comes through as
     *      ['$this', 'names', 0, 'first']
     *
     *      $this gets wiped as it always refers to the current item
     *      and the rest of the array is used to find the value.
     * @param paths
     * @returns {*}
     */
    getValue (paths) {

        let compiler = this;

        if (!Array.isArray(paths)) {
            paths = [paths];
        }

        /**
         * Just nuke any mentions of $this
         */
        paths = paths.filter(function (path) {
            return path !== '$this' && path !== '$value' && path !== '.';
        });

        /**
         * If $. given, reset to root
         */
        let root = paths.indexOf('$');
        if (root > -1) {
            paths = paths.slice(root + 1);
        }

        /**
         * Check if ../ has been used to reverse out of the
         * current context
         */
        let prev = paths.indexOf('../');
        let curr;

        if (prev > -1) {

            /**
             * The starting point is the first occurence of ../
             * EG: ['site', 'nav', '../'] would be index 2, so we deduct
             * that 1 and end up with the index pointing at the 'nav' item
             */
            let startingpoint = prev - 1;

            /**
             * Afters is any paths following the ../
             * EG: ['site', 'nav', '../', 'title']
             *  =  ['title']
             */
            let afters = paths.slice(prev + 1);

            /**
             * Now loop backwards through the paths
             * and check if any of them, combined with the 'afters' above
             * match the pattern.
             * EG: ['site', 'nav', 0, '../', 'title']
             *    .. would result in the following lookups, until a valid value was found
             * ['site', 'nav', '0', 'title']
             * ['site', 'nav', 'title']
             * ['site', 'title'] // match!
             */
            while (startingpoint > -1) {

                let lookup = paths.slice(0, startingpoint).concat(afters);
                let value  = compiler._ctx.getIn(lookup);

                if (typeof value !== 'undefined') {
                    curr = value;
                    break;
                } else {
                    startingpoint -= 1;
                }
            }

        } else {

            /**
             * Here, there was no match in the paths array
             * for '../', meaning a regular lookup should occur
             */
            curr = compiler._ctx.getIn(paths);
        }

        /**
         * Get the last (currently looking for) item
         */
        let lastPathItem = paths[paths.length-1];
        let secondLastPathItem = paths[paths.length-2];

        /**
         * If curr is not undefined, either convert item to
         * JS  (if needed), or just return the item
         */
        if (typeof curr !== 'undefined') {
            if (Immutable.Map.isMap(curr) || Immutable.List.isList(curr)) {
                return curr.toJS();
            }
            return curr;
        } else {
            /**
             * If $this was given, simply return the paths all the way upto,
             * but not including it
             */
            if (lastPathItem === "$this") {
                return compiler._ctx.getIn(paths.slice(0, paths.length-1));
            }
            /**
             * if $idx was given, check if the previous path was a number
             * and given that.
             */
            let idx = lastPathItem.match(/^\$idx(\d)?/);
            if (idx && typeof secondLastPathItem === 'number') {
                if (idx[1]) {
                    return secondLastPathItem + parseInt(idx[1], 10);
                } else {
                    return secondLastPathItem;
                }
            }

            if (lastPathItem === '$key') {
                return secondLastPathItem;
            }
        }
    }

    /**
     * Helper to normalise value lookup paths
     * coming from the AST
     * @param node
     * @returns {*}
     */
    getLookupPath ({node}) {
        let contextNodePaths = node.paths;
        let lookup;

        if (node.type === 'key') {
            if (contextNodePaths && contextNodePaths.length) {
                lookup = contextNodePaths;
            } else {
                lookup = node.value;
            }
        }
        return lookup;
    }

    /**
     * Take an array of paths and try to resolve a value
     * @param ctx
     * @param node
     * @returns {{value: *, ctx: Array}}
     */
    resolveValue ({ctx, node}) {

        if (!ctx) {
            return {
                value: undefined,
                ctx: ctx
            }
        }

        let compiler = this;
        let lookup;
        let paths = node.identifier.paths;
        let value = node.identifier.value;

        if (node.identifier.type === 'key') {
            if (paths && paths.length) {
                lookup = paths;
            } else {
                lookup = value;
            }
        }

        ctx = ctx.concat(lookup);

        return {
            value: compiler.getValue(ctx),
            ctx
        }
    }

    /**
     * Error handling
     * @param err
     */
    error (err) {
        console.error(err);
    }
}
