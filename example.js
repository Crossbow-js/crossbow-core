var parser = require("./src/parser");
var microtime = require("microtime");
var fs = require("fs");
var md = fs.readFileSync('./examples/loop.html', 'utf-8');

var start = microtime.now();
console.time('cb time:     ');
var out = parser.parse(md);
console.log('cb micro time:', microtime.now() - start);
console.timeEnd('cb time:     ');

fs.writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 4));

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

var output = builder.parse({content: md, ctx: ctx});

fs.writeFileSync('./examples/loop.output.html', output);
