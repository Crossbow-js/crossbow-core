var parser = require("./src/parser");
var microtime = require("microtime");
var md = require("fs").readFileSync('./examples/loop.html', 'utf-8');

var start = microtime.now();
console.time('cb time:     ');
var out = parser.parse(md);
console.log('cb micro time:', microtime.now() - start);
console.timeEnd('cb time:     ');

require("fs").writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 2));

var cb = require('./');
var builder = cb.builder();
var ctx = {
    names: [
        {
            first: 'shane',
            last: 'osbourne'
        },
        {
            first: 'kittie',
            last: 'osbourne'
        }
    ]
};

console.log(builder.parse({content: md, ctx: ctx}));
