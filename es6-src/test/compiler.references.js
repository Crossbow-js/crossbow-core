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
    it('can add reference from ctx path', () => {
        const ctx = {person: {name: 'shane', age: 20}};
        let out = cblang({content: 'hello {person.name} {person.age}', ctx});
        assert.equal(out, 'hello shane 20');
    });
    it('can add reference from ctx with array notation', () => {
        const ctx = {people: ['shane', 'kittie']};
        let out = cblang({content: 'hello {people[0]} & {people[1]}', ctx});
        assert.equal(out, 'hello shane & kittie');
    });
});
