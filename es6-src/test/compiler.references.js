import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';

const input1 = `hello {name}`;

describe('Compiling references', () => {
    it('can remove unkown compile reference', () => {
        let out = cblang({content: input1});
        assert.equal(out, 'hello ');
    });
    it('can add reference from ctx', () => {
        const ctx = {name: 'shane'};
        let out = cblang({content: input1, ctx});
        assert.equal(out, 'hello shane');
    });
    it.skip('can add reference from ctx path', () => {
        const ctx = {person: {name: 'shane'}};
        let out = cblang({content: 'hello {person.name}', ctx});
        assert.equal(out, 'hello shane');
    });
    it.skip('can remove unknown from ctx path', () => {
        const ctx = {person: {name: 'shane'}};
        let compiler = builder();
        let spy = sinon.spy(compiler, 'error');
        let out = compiler.parse({content: 'hello {person.surname}', ctx});
        assert.equal(out, 'hello ');
        sinon.assert.called(spy);
    });
});
