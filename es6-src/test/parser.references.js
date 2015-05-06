import cblang, {process} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';

const input1 = `hello {name}`;

describe('References', () => {
    it('can parse reference as key', () => {
        let ast = parse(input1);
        assert.equal(ast[0].type,  'buffer');
        assert.equal(ast[0].value, 'hello ');
        assert.equal(ast[1].type,  'reference');
        assert.equal(ast[1].identifier.type,  'key');
        assert.equal(ast[1].identifier.value, 'name');
        assert.isUndefined(ast[1].identifier.paths);
    });
    it('can parse reference as path', () => {
        const ast = parse(`hello {person.name}`);
        assert.equal(ast[0].type, 'buffer');
        assert.equal(ast[0].value, 'hello ');
        assert.equal(ast[1].type, 'reference');
        assert.equal(ast[1].identifier.type,  'key');
        assert.equal(ast[1].identifier.value, 'person.name');
        assert.equal(ast[1].identifier.paths[0], 'person');
        assert.equal(ast[1].identifier.paths[1], 'name');
    });
    it('can parse reference as path with array notation', () => {
        const ast = parse(`hello {person.name[0]}`);
        assert.equal(ast[0].type, 'buffer');
        assert.equal(ast[0].value, 'hello ');
        assert.equal(ast[1].type, 'reference');
        assert.equal(ast[1].identifier.type,  'key');
        assert.equal(ast[1].identifier.value, 'person.name.0');
        assert.equal(ast[1].identifier.paths[0], 'person');
        assert.equal(ast[1].identifier.paths[1], 'name');
        assert.deepEqual(ast[1].identifier.paths[2], 0);
    });
});
