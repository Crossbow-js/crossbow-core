import nodes from './nodes';
import parser from '../src/parser';
import Compiler from './compiler';
import assert from 'assert';

export default function ({content, opts={}, ctx={}}) {
    assert(typeof content === 'string', 'Expected the `content` property');

    let builder = new Compiler(opts);
    return builder.parse({content, ctx});
}

export function builder (opts) {
    return new Compiler(opts);
}
