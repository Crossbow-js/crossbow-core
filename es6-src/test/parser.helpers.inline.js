import cblang from '../lib/index.js';
import {parse} from '../src/parser.js';
import {assert} from 'chai';

const input  = 'Hey there';
const input1 = `{@hl lang="js"}${input}{/hl}`;

describe('@Helpers - inline', () => {
    it('Can access data', () => {

        var ast = parse(`{@hl src="somefilepath.js" /}`);

        assert.equal(ast[0].type, '@');
        assert.equal(ast[0].identifier.type,  'key');
        assert.equal(ast[0].identifier.value, 'hl');
        assert.equal(ast[0].params[0].key, 'src');
        assert.equal(ast[0].params[0].value.type, 'string');
        assert.equal(ast[0].params[0].value.value, 'somefilepath.js');

    });
});
