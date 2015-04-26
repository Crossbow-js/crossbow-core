var parser = require("./src/parser");
var out    = parser.parse("{shane|lodash:snakecase}");
require("fs").writeFileSync('./ast.json', JSON.stringify(out, null, 2));
