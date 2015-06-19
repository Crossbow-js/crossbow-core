var parser = require("./src/jison-parse").parser;
var fs = require("fs");
var md = fs.readFileSync('./examples/loop.html', 'utf-8');

var AST = require('./lib/compiler/ast');
var Helpers = require('./lib/compiler/helpers');
var utils = require('./lib/compiler/utils');

var yy = AST;
utils.extend(yy, Helpers, AST);
//console.log(yy);

function parse(input, options) {
    // Just return if an already-compiled AST was passed in.
    if (input.type === 'Program') { return input; }

    parser.yy = yy;

    function SourceLocation(source, locInfo) {
        this.source = source;
        this.start = {
            line: locInfo.first_line,
            column: locInfo.first_column
        };
        this.end = {
            line: locInfo.last_line,
            column: locInfo.last_column
        };
    }

    parser.yy.locInfo = function (locInfo) {
        return new SourceLocation(options && options.srcName, locInfo);
    };

    //console.log(parser.yy.locInfo);
    return parser.parse(input);
}

var ast = parse('{{thing.shane|lodash.trunc}} {{another}}');
fs.writeFileSync('jison-ast.json', JSON.stringify(ast, null, 4));
//console.log(ast);