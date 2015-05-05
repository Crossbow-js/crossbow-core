import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';

describe('Compiling iterator blocks', () => {
    it('can loop over an array and access an item', () => {
        const input = `{#names}{first}-{/names}`;
        const ctx = {
            names: [
                {
                    first: 'shane',
                    last: 'osbourne'
                },
                {
                    first: 'kittie',
                    last: 'osbourne'
                }
            ]
        };
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, 'shane-kittie-');
    });
    it('can loop over an array and access an item', () => {
        const input = `{#names}{first}-{/names}{#names}{last}-{/names}`;
        const ctx = {
            names: [
                {
                    first: 'shane',
                    last: 'osbourne'
                },
                {
                    first: 'kittie',
                    last: 'osbourne'
                }
            ]
        };
        let compiler = builder();
        let out = compiler.parse({content: input, ctx});
        assert.equal(out, 'shane-kittie-osbourne-osbourne-');
    });
});
