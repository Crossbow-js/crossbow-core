var parser = require("./src/parser");
var index = require("./");
var dust = require("dustjs-linkedin");
var microtime = require("microtime");
var fs = require("fs");
var md = fs.readFileSync('./examples/loop.html', 'utf-8');

//var start = microtime.now();
//console.time('cb time:     ');
var out = parser.parse(md);
//console.log('cb micro time:', microtime.now() - start);
//console.timeEnd('cb time:     ');

fs.writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 4));

var cb = require('./');
var builder = cb.builder();

builder.filters.md = function (opts) {
    console.log(opts.args);
    console.log(opts.value);
    console.log(arguments);
};

var ctx = {
    site: {
        description: '##Crossbow',
        title: 'Crossbow',
        navigation: [
            {
                url: '/css',
                label: 'CSS'
            },
            {
                url: '/js',
                label: 'JS'
            }
        ]
    },
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
console.log(output);

fs.writeFileSync('./examples/loop.output.html', output);
