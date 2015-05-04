import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';

describe('Compiling references blocks', () => {
    it('can render basic block 1 level deep', () => {
        const input = `{#person}-{name}-{/person}`;
        const ctx = {person: {name: 'shane'}};
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, '-shane-');
    });
    it('can render basic block 5 levels deep', () => {
        const input = `{#a}{#b}{#c}{#d}{#e}-{name}-{/e}{/d}{/c}{/b}{/a}`;
        const ctx = {a: {b: {c: {d: {e: {name: 'kittie'}}}}}};
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, '-kittie-');
    });
    it('can render basic block 1 level when not exists', () => {
        const input = `{#person}-{namea}-{/person}`;
        const ctx = {person: {name: 'shane'}};
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, '--');
    });
    it('can render nested reference blocks', () => {
        const input = `{#person}{#names}{first} - {last}{/names}{/person}`;
        const ctx = {person: {names: {first: 'shane', last: 'osbourne'}}};
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        console.log([out]);
    });
});
