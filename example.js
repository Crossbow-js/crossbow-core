var parser = require("./src/parser");
var microtime = require("microtime");
var md = require("fs").readFileSync('./bench/index.md', 'utf-8');

var start = microtime.now();
var out    = parser.parse(md);
console.log('micro time:', microtime.now() - start);

require("fs").writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 2));

var cblang = require("./lib/index");
