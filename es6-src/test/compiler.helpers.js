import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';

describe('Adding helpers to the compiler', () => {
    it('can add a helper that returns raw', () => {

        const input1 = `{@shane}
Hello world
{/shane}`;

        let compiler = builder();

        compiler.helpers.shane = function ({node, ctx, compiler}) {
            return compiler.process({ast: node.bodies});
        };

        let out = compiler.parse({content: input1});

        assert.equal(out, '\nHello world');
    });
});
