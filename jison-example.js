var parser = require("./src/jison-parse");
var fs = require("fs");
var md = fs.readFileSync('./examples/loop.html', 'utf-8');

var AST = require('./lib/compiler/ast');
var WhitespaceControl = require('./lib/compiler/ws');
var helpers = require('./lib/compiler/helpers');
var utils = require('../lib/compiler/utils');

var yy = {};
utils.extend(yy, Helpers, AST);

function parse(input, options) {
    // Just return if an already-compiled AST was passed in.
    if (input.type === 'Program') { return input; }

    parser.yy = yy;

    // Altering the shared object here, but this is ok as parser is a sync operation
    yy.locInfo = function(locInfo) {
        return new yy.SourceLocation(options && options.srcName, locInfo);
    };

    var strip = new WhitespaceControl();
    return strip.accept(parser.parse(input));
}