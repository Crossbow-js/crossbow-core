var parser = require("./src/parser");
var out    = parser.parse("{shane|anohter|lodash:trunc|upper|concat|}");
require("fs").writeFileSync('./ast.json', JSON.stringify(out, null, 2));