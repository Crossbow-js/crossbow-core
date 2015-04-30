import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';

describe('Adding filters to the compiler', () => {
    it('can add a filter', () => {

        const input1 = `{name|md}`;

        let compiler = builder();

        compiler.filters.md = function ({value, args, node, ctx, compiler}) {
            return value + ' - md';
        };

        let out = compiler.parse({content: input1, ctx: {name: 'kittie'}});

        assert.equal(out, 'kittie - md');
    });
    it('can add a filter that uses args', () => {

        const input1 = `{name|md~"osbourne"}`;

        let compiler = builder();

        compiler.filters.md = function ({value, args, node, ctx, compiler}) {
            return value + ' - ' + args[0].value;
        };

        let out = compiler.parse({content: input1, ctx: {name: 'kittie'}});

        assert.equal(out, 'kittie - osbourne');
    });
});
