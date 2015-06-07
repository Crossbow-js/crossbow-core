import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';

const input1 = `{#names}{first} loves {$.site.title}{/names}`;

describe('Compiling references', () => {
    it('can begin lookup from root element', () => {
        let out = cblang({content: input1, ctx: {
            site: {
                title: "Crossbow"
            },
            names: {
                first: 'kittie'
            }
        }});
        assert.equal(out, 'kittie loves Crossbow');
    });
});
