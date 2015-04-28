import nodes from './nodes';
import parser from '../src/parser';
import Compiler from './compiler';

export default function ({content, opts={}, ctx={}}) {
    let builder = new Compiler(opts);
    return builder.parse({content, ctx});
}

export function builder (opts) {
    return new Compiler(opts);
}
