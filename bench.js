var parser = require("./src/parser");
//var microtime = require("microtime");
var dust = require("dustjs-linkedin");
var Handlebars = require("handlebars");
var cb = require("./lib/index")["default"];
var md = require("fs").readFileSync('./bench/index.md', 'utf-8');

///** Handlebars **/
console.time('H time:      ');
//start = microtime.now();
var fn = Handlebars.compile(md);
fn({});
//console.log('H micro time :', microtime.now() - start);
console.timeEnd('H time:      ');

//var start = microtime.now();

//console.time('parse time:     ');
//var out = parser.parse(md);
//console.timeEnd('parse time:     ');
console.time('cb time:     ');
//console.log(cb);
var out = cb({content: md});
//console.log(out);
//console.log('cb micro time:', microtime.now() - start);
console.timeEnd('cb time:     ');

//require("fs").writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 2));


/** Dust **/
console.time('d time:      ');
////start = microtime.now();
dust.renderSource(md, {}, function (err, out) {
    //console.log('d micro time :', microtime.now() - start);
    console.timeEnd('d time:      ');
});

