import helpers from './helpers';
import filters from './filters';
import nodes   from './nodes';
import parser  from '../src/parser';

export default class Compiler {
    constructor (opts) {
        this.opts = opts;
        this.helpers = helpers;
        this.filters = filters;
        this.nodes   = nodes;
    }

    /**
     * Perform any initial tranformations on
     * ast before even thinking about context
     * @param ast
     * @returns {Array|*}
     */
    firstPass (ast) {

        let compiler = this;

        return ast.map(function (item, i, all) {

            if (item.type === '#') {
                if (all[i-1].type === 'format') {
                    all[i-1].skip = true;
                }
                if (item.bodies) {
                    var next = item.bodies[item.bodies.length-1];
                    if (next && next.type === 'format') {
                        next.skip = true;
                    }
                    item.bodies = compiler.firstPass(item.bodies);
                }
            }

            if (item.raw && item.type !== '@') {
                item.bodies = parser.parse(item.raw);
            }
            return item;
        });
    }

    /**
     *
     * @param content
     * @param opts
     * @param ctx
     * @returns {*}
     */
    parse ({content, opts = {}, ctx = {}}) {
        let compiler = this;
        let ast = parser.parse(content);
        ast = compiler.firstPass(ast);
        return compiler.process({ast, ctx, compiler});
    }

    /**
     * Final step, transform AST > String
     * by visiting each node
     * @param ast
     * @param ctx
     * @param compiler
     * @returns {*}
     */
    process ({ast, ctx, compiler}) {

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
     * Error handling
     * @param err
     */
    error (err) {
        console.error(err);
    }
}
