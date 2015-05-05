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

    getValue (paths, advancePointer) {

        let compiler = this;

        if (!Array.isArray(paths)) {
            paths = [paths];
        }

        //let newpath = compiler._ctxPath.concat(paths);

        //if (advancePointer) {
        //    compiler._ctxPath = newpath;
        //}

        let curr = compiler._ctx.getIn(paths);

        if (typeof curr !== 'undefined') {
            if (Immutable.Map.isMap(curr) || Immutable.List.isList(curr)) {
                return curr.toJS();
            }
            return curr;
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
