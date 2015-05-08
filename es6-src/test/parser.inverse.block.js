import cblang, {process} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';

const input1 = `{@if:name}{name}{:else}anon{/if}`;

describe('Inverse blocks', () => {
    it('can parse blocks with inverse alternative', () => {
        let ast = parse(input1);
        assert.equal(ast[0].type,  '@');
        assert.equal(ast[0].bodies.length,  '1');
        assert.equal(ast[0].bodies[0].type,  'reference');
        assert.equal(ast[0].inverse[0].identifier.type,  'key');
        assert.equal(ast[0].inverse[0].identifier.value, 'else');
        assert.equal(ast[0].inverse[0].bodies.length, 1);
        assert.equal(ast[0].inverse[0].bodies[0].type, 'buffer');
        assert.equal(ast[0].inverse[0].bodies[0].value, 'anon');
    });
});
