var parser = require("./src/parser");
var index = require("./");
var dust = require("dustjs-linkedin");
var microtime = require("microtime");
var fs = require("fs");
var md = fs.readFileSync('./examples/loop.html', 'utf-8');

//var start = microtime.now();
//console.time('cb time:     ');
//var out = parser.parse(md);
//console.log('cb micro time:', microtime.now() - start);
//console.timeEnd('cb time:     ');

//fs.writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 4));

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

try {
    var output = builder.parse({content: md, ctx: ctx});
    console.log(output);
} catch (e) {
    console.error('There\'s a syntax error on line', e.location.start.line);
    console.error('Error:', e.location);
    console.error(e.message);

    //var lines = content.split('\n');
    //var linebefore = e.location.start.line - 1;
    //var lineafter  = e.location.start.line + 1;
    //var sliced = lines.slice(e.location.start.line - 3, e.location.start.line - 1);
    //console.log(e);
    //console.log(lines);
    //sliced.push(lines[e.location.start.line - 1]);
    //console.log(lines[e.location.start.line - 1].length);
    //var dashes = '-------------------------------------'.split('');
    //dashes.splice(e.location.start.column - 2, 1, '^');
    //sliced.push(dashes.join(''));
    //sliced = sliced.concat(lines.slice(e.location.start.line, e.location.start.line + 2 ));
    //
    //console.error('There\'s a problem with your syntax');
    //console.log(sliced.join('\n'));

    //console.log(content.slice(e.location.start.offset - 20, e.location.start.offset + 20));
}

fs.writeFileSync('./examples/loop.output.html', output);
