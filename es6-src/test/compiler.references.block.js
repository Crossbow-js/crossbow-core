import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';


describe('Compiling references blocks', () => {
    it.only('can render basic block', () => {
        const input = `{#person}-{name}-{/person}`;
        const ctx = {person: {name: 'shane'}};
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        console.log([out]);
        //assert.equal(out, 'hello ');
    });
});
