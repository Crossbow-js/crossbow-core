import cblang from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';

const input1 = `{@hl}
Yo there
{/hl}`;

describe('Blocks', () => {
    it.only('Can ALWAYS access raw input', () => {
        let output = parse(input1);

        assert.equal(output[0].type, '@');
        assert.equal(output[0].identifier.type,  'key');
        assert.equal(output[0].identifier.value, 'hl');

        writeFileSync('./ast.json', JSON.stringify(output, null, 4));

        assert.equal(output[0].body.raw, input1);
    });
});
