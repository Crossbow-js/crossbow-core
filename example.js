var parser = require("./src/parser");
var microtime = require("microtime");
var md = require("fs").readFileSync('./examples/loop.html', 'utf-8');

var start = microtime.now();
console.time('cb time:     ');
var out = parser.parse(md);
console.log('cb micro time:', microtime.now() - start);
console.timeEnd('cb time:     ');

require("fs").writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 4));

var cb = require('./');
var builder = cb.builder();
var ctx = {
    names: [
        {
            first: 'shane',
            last: 'osbourne',
            pets: [
                {
                    name: 'alfred',
                    url: 'awe, yeah'
                }
            ]
        },
        {
            first: 'kittie',
            last: 'osbourne',
            pets: [
                {
                    name: 'another Animal thing',
                    url: 'awe, yeah'
                }
            ]
        }
    ]
};

console.log(builder.parse({content: md, ctx: ctx}));
