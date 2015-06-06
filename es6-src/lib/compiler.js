import helpers from './helpers';
import filters from './filters';
import nodes   from './nodes';
import {formattingPass} from './ast-transforms';
import parser  from '../src/parser';
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
     * @param compiler
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
            return path !== '$this' && path !== '$value';
        });

        /**
         * Get the last (currently looking for) item
         */
        let lastPathItem = paths[paths.length-1];
        let secondLastPathItem = paths[paths.length-2];

        /**
         * Access the item via the paths
         * @type {any|*}
         */
        let curr = compiler._ctx.getIn(paths);

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
