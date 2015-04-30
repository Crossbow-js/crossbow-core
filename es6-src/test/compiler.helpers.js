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
            return node.raw;
        };

        let out = compiler.parse({content: input1});

        assert.equal(out, '\nHello world\n');
    });
    it('can add a helper that can parse the raw data with a separate ctx', () => {

        const input1 = `{@shane data="aw yeah {person.firstname}"}
{person.firstname|ucfirst} - {person.surname|ucfirst}
{/shane}`;

        let compiler = builder();

        compiler.helpers.shane = function ({node, ctx, compiler}) {
            const context = {person: {firstname: 'kittie', surname: 'osbourne'}};
            return compiler.parse({content: node.raw, ctx: context});
        };

        let out = compiler.parse({content: input1, ctx: {person: 'animal'}});

        assert.equal(out, '\nKittie - Osbourne\n');
    });
});
