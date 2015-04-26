import cblang from '../lib/index.js';
import {parse} from '../src/parser.js';
import {assert} from 'chai';

describe('Filters', () => {
    it('can be used without context', () => {
        const input = `shane`;
        const output = parse(input);
        assert.equal(output.length, 1);
        assert.equal(output[0].type, 'buffer');
        assert.equal(output[0].value, 'shane');
    });
    it('1 filter', () => {
        const input = `{shane|upper}`;
        const output = parse(input);
        assert.equal(output.length, 1);
        assert.equal(output[0].type, 'reference');
        assert.equal(output[0].identifier.type, 'key');
        assert.equal(output[0].identifier.value, 'shane');
        assert.equal(output[0].modifiers.length, 1);
        assert.equal(output[0].modifiers[0].type, 'filter');
        assert.equal(output[0].modifiers[0].value, 'upper');
    });
    it('1 modifier', () => {
        const input = `{shane|lodash:upper}`;
        const output = parse(input);
        assert.equal(output.length, 1);
        assert.equal(output[0].type, 'reference');
        assert.equal(output[0].identifier.type, 'key');
        assert.equal(output[0].identifier.value, 'shane');
        assert.equal(output[0].modifiers.length, 1);
        assert.equal(output[0].modifiers[0].namespace, 'lodash');
        assert.equal(output[0].modifiers[0].method, 'upper');
    });
    it('2 modifiers', () => {
        const input = `{shane|lodash:upper|moment:kill}`;
        const output = parse(input);
        assert.equal(output.length, 1);
        assert.equal(output[0].type, 'reference');
        assert.equal(output[0].identifier.type, 'key');
        assert.equal(output[0].identifier.value, 'shane');
        assert.equal(output[0].modifiers.length, 2);
        assert.equal(output[0].modifiers[0].namespace, 'lodash');
        assert.equal(output[0].modifiers[1].namespace, 'moment');
    });
    it('2 modifiers + filter', () => {
        const input = `{shane|lodash:upper|moment:kill|truncate}`;
        const output = parse(input);
        assert.equal(output.length, 1);
        assert.equal(output[0].type, 'reference');
        assert.equal(output[0].identifier.type, 'key');
        assert.equal(output[0].identifier.value, 'shane');
        assert.equal(output[0].modifiers.length, 3);
        assert.equal(output[0].modifiers[0].namespace, 'lodash');
        assert.equal(output[0].modifiers[1].namespace, 'moment');
        assert.equal(output[0].modifiers[2].type,      'filter');
        assert.equal(output[0].modifiers[2].value,     'truncate');
    });
    it('filter first + 2 modifiers', () => {
        const input = `{shane|upper|lodash:upper|moment:kill}`;
        const output = parse(input);
        assert.equal(output.length, 1);
        assert.equal(output[0].type, 'reference');
        assert.equal(output[0].identifier.type, 'key');
        assert.equal(output[0].identifier.value, 'shane');
        assert.equal(output[0].modifiers.length, 3);
        assert.equal(output[0].modifiers[0].type,      'filter');
        assert.equal(output[0].modifiers[0].value,     'upper');
        assert.equal(output[0].modifiers[1].type,      'modifier');
        assert.equal(output[0].modifiers[1].namespace, 'lodash');
        assert.equal(output[0].modifiers[1].method,    'upper');
        assert.equal(output[0].modifiers[2].type,      'modifier');
        assert.equal(output[0].modifiers[2].namespace, 'moment');
        assert.equal(output[0].modifiers[2].method,    'kill');
    });
    it('2 filters', () => {
        const input = `{shane|upper|other}`;
        const output = parse(input);
        assert.equal(output.length, 1);
        assert.equal(output[0].type, 'reference');
        assert.equal(output[0].identifier.type, 'key');
        assert.equal(output[0].identifier.value, 'shane');
        assert.equal(output[0].modifiers.length, 2);
        assert.equal(output[0].modifiers[0].value, 'upper');
        assert.equal(output[0].modifiers[1].value, 'other');
    });
    it('using external module + filter', () => {
        const input = `{shane|ucfirst|lodash:pad~11,-}`;
        const output = cblang(input, {shane: 'shane'});
        assert.equal(output, '---Shane---');
    });
});
