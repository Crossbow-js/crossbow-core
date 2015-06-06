import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';

describe('@loop helper for object iteration', () => {
    it('can render a loop over an object', () => {

        const input1 = `{@loop:pkg}{$key} : {$value}{/loop}`;

        let compiler = builder();

        let out = compiler.parse({
            content: input1,
            ctx: {
                pkg: {
                    version: '1.2'
                }
            }
        });

        assert.equal(out, 'version : 1.2');
    });
});
