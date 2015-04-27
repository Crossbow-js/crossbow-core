var parser = require("./src/parser");
var out    = parser.parse('{shane|lodash:pad~100,"hi"}');
require("fs").writeFileSync(__dirname + '/ast.json', JSON.stringify(out, null, 2));

var cblang = require("./lib/index");

console.log(cblang.default('{name|lodash:pad~20,"hi"}', {name: 'shane'}));
