import cblang from '../lib/index.js';
import {parse} from '../src/parser.js';
import {assert} from 'chai';

const input  = 'Hey there';
const input1 = `{@hl lang="js"}${input}{/hl}`;

describe.skip('Helpers', () => {
    it('Can access data', () => {
        //it('Can ALWAYS access raw input', () => {
        let ast = parse(input1);
        assert.equal(ast[0].type, '@');
        assert.equal(ast[0].identifier.type,  'key');
        assert.equal(ast[0].identifier.value, 'hl');
        //writeFileSync('./ast.json', JSON.stringify(ast, null, 4));
        assert.equal(ast[0].raw, input);
        const output = cblang({content: `{@hl}-{shane}-{/hl}`, ctx: {shane: 'awesome'}});
    });
});
