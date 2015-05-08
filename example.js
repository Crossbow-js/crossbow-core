var parser = require("./src/parser");
var dust = require("dustjs-linkedin");
var microtime = require("microtime");
var fs = require("fs");
var md = fs.readFileSync('./examples/loop.html', 'utf-8');

var start = microtime.now();
console.time('cb time:     ');
var out = parser.parse('{@if:something}true{:else}false{:else}Aww yeah{/if}');
console.log('cb micro time:', microtime.now() - start);
console.timeEnd('cb time:     ');

//dust.renderSource('{^names}true{:else}false{/names}', {names: 'shane'}, function (err, out) {
//    console.log(out);
//});

fs.writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 4));

//var cb = require('./');
//var builder = cb.builder();
//var ctx = {
//    names: [
//        {
//            first: 'shane',
//            last: 'osbourne',
//            pets: [
//                {
//                    name: 'alfred',
//                    url: 'awe, yeah'
//                }
//            ]
//        },
//        {
//            first: 'kittie',
//            last: 'osbourne',
//            pets: [
//                {
//                    name: 'another Animal thing',
//                    url: 'awe, yeah'
//                }
//            ]
//        }
//    ]
//};
//
//var output = builder.parse({content: md, ctx: ctx});
//
//fs.writeFileSync('./examples/loop.output.html', output);
