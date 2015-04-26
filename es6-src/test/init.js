import cblang from '../lib/index.js';
import {myOtherFunction} from '../lib/index.js';
import {assert} from 'chai';

describe('Parsing strings', () => {
    it('can be used without context', () => {
        const input = `shane`;
        const output = cblang(input);
        assert.equal(output, 'shane');
    });
});
