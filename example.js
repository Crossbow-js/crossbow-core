var parser = require("./src/parser");
var out    = parser.parse("{shane|upper|lodash:trunc|shane}");
require("fs").writeFileSync('./ast.json', JSON.stringify(out, null, 2));
