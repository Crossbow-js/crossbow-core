import cblang, {builder} from '../lib/index.js';
import {parse} from '../src/parser.js';
import {writeFileSync} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';

describe('@loop helper', () => {
    it('can render a loop over an array', () => {

        const input1 = `{@loop:names}{$this}{/loop}`;

        let compiler = builder();

        let out = compiler.parse({
            content: input1,
            ctx: {
                names: [
                    'shane',
                    'kittie'
                ]
            }
        });

        assert.equal(out, 'shanekittie');
    });
    it('can render a loop over an array from initial path lookup', () => {

        const input1 = `{@loop:info.names}{$this}{/loop}`;

        let compiler = builder();

        let out = compiler.parse({
            content: input1,
            ctx: {
                info: {
                    names: [
                        'shane',
                        'kittie'
                    ]
                }
            }
        });

        assert.equal(out, 'shanekittie');
    });
    it('can render a loop over an array with path access', () => {

        const input1 = `{@loop:names}{$this.first}{/loop}`;

        let compiler = builder();

        let out = compiler.parse({
            content: input1,
            ctx: {
                names: [
                    {
                        first: 'shane',
                        last: 'osbourne'
                    },
                    {
                        first: 'kittie',
                        last: 'bastard'
                    }
                ]
            }
        });

        assert.equal(out, 'shanekittie');
    });

});