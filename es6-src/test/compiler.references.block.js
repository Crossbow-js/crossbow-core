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
        assert.equal(out, 'shane - osbourne')
    });
    it('can render multiple nested reference blocks', () => {
        const input = `{#person}{#names}{first} - {last}{/names}{/person} - {#address}{town}{/address}`;
        const ctx = {
            person: {
                names: {
                    first: 'shane',
                    last: 'osbourne'
                }
            },
            address: {
                town: 'Mansfield'
            }
        };
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, 'shane - osbourne - Mansfield');
    });
    it('can render multiple nested references in blocks', () => {
        const input = `{#person}{names.first} - {names.last}{/person}`;
        const ctx = {
            person: {
                names: {
                    first: 'shane',
                    last: 'osbourne'
                }
            }
        };
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, 'shane - osbourne');
    });
    it('can render block from a path lookup', () => {
        const input = `{#person.names}{first} - {last}{/person.names}`;
        const ctx = {
            person: {
                names: {
                    first: 'shane',
                    last: 'osbourne'
                }
            }
        };
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, 'shane - osbourne');
    });
    it('can render block from a path lookup with array notation', () => {
        const input = `{#people[0]}{first} - {last}{/people[0]}`;
        const ctx = {
            people: [
                {
                    first: 'shane',
                    last:  'osbourne'
                }
            ]
        };
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, 'shane - osbourne');
    });
    it('can render block from a multi path lookup with array notation', () => {
        const input = `{#list.people[0]}{first} - {last}{/list.people[0]}`;
        const ctx = {
            list: {
                people: [
                    {
                        first: 'shane',
                        last:  'osbourne'
                    }
                ]
            }
        };
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, 'shane - osbourne');
    });
    it('can render block from a multi path lookup with array notation nested', () => {
        const input = `{#list.people[0]}{#names}{first} - {last}{/names}{/list.people[0]}`;
        const ctx = {
            list: {
                people: [
                    {
                        names: {
                            first: 'shane',
                            last:  'osbourne'
                        }
                    }
                ]
            }
        };
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, 'shane - osbourne');
    });
});
