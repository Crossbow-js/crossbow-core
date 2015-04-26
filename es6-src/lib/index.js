import nodes from './nodes';
import parser from '../src/parser';

function process(ast, ctx) {
    return ast.reduce(function (all, item) {
        if (item.skip) {
            return all;
        }
        if (nodes[item.type]) {
            all += nodes[item.type](item, ctx.data);
        }
        return all;
    }, '');
}

function firstPass (ast) {
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
                item.bodies = firstPass(item.bodies);
            }
        }
        return item;
    });
}

export default function (input, ctx = {}) {
    var ast = parser.parse(input);
    ast = firstPass(ast);

    return process(ast, {data: ctx});
}
