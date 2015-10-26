'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.SourceLocation = SourceLocation;
exports.id = id;
exports.stripFlags = stripFlags;
exports.stripComment = stripComment;
exports.preparePath = preparePath;
exports.prepareMustache = prepareMustache;
exports.prepareRawBlock = prepareRawBlock;
exports.prepareBlock = prepareBlock;
exports.prepareProgram = prepareProgram;
exports.preparePartialBlock = preparePartialBlock;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

function validateClose(open, close) {
    close = close.path ? close.path.original : close;

    if (open.path.original !== close) {
        var errorNode = { loc: open.path.loc };

        throw new _exception2['default'](open.path.original + " doesn't match " + close, errorNode);
    }
}

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

function id(token) {
    if (/^\[.*\]$/.test(token)) {
        return token.substr(1, token.length - 2);
    } else {
        return token;
    }
}

function stripFlags(open, close) {
    return {
        open: open.charAt(2) === '~',
        close: close.charAt(close.length - 3) === '~'
    };
}

function stripComment(comment) {
    return comment.replace(/^\{\{~?\!-?-?/, '').replace(/-?-?~?\}\}$/, '');
}

function preparePath(data, parts, loc) {
    loc = this.locInfo(loc);

    var original = data ? '@' : '',
        dig = [],
        depth = 0,
        depthString = '';

    for (var i = 0, l = parts.length; i < l; i++) {
        var part = parts[i].part,

        // If we have [] syntax then we do not treat path references as operators,
        // i.e. foo.[this] resolves to approximately context.foo['this']
        isLiteral = parts[i].original !== part;
        original += (parts[i].separator || '') + part;

        if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
            if (dig.length > 0) {
                throw new _exception2['default']('Invalid path: ' + original, { loc: loc });
            } else if (part === '..') {
                depth++;
                depthString += '../';
            }
        } else {
            dig.push(part);
        }
    }

    return {
        type: 'PathExpression',
        data: data,
        depth: depth,
        parts: dig,
        original: original,
        loc: loc
    };
}

function prepareMustache(path, params, hash, open, strip, locInfo) {
    // Must use charAt to support IE pre-10
    var escapeFlag = open.charAt(3) || open.charAt(2),
        escaped = escapeFlag !== '{' && escapeFlag !== '&';

    var decorator = /\*/.test(open);
    return {
        type: decorator ? 'Decorator' : 'MustacheStatement',
        path: path,
        params: params,
        hash: hash,
        escaped: escaped,
        strip: strip,
        loc: this.locInfo(locInfo)
    };
}

function prepareRawBlock(openRawBlock, contents, close, locInfo) {
    validateClose(openRawBlock, close);

    locInfo = this.locInfo(locInfo);
    var program = {
        type: 'Program',
        body: contents,
        strip: {},
        loc: locInfo
    };

    return {
        type: 'BlockStatement',
        path: openRawBlock.path,
        params: openRawBlock.params,
        hash: openRawBlock.hash,
        program: program,
        openStrip: {},
        inverseStrip: {},
        closeStrip: {},
        loc: locInfo
    };
}

function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
    if (close && close.path) {
        validateClose(openBlock, close);
    }

    var decorator = /\*/.test(openBlock.open);

    program.blockParams = openBlock.blockParams;

    var inverse = undefined,
        inverseStrip = undefined;

    if (inverseAndProgram) {
        if (decorator) {
            throw new _exception2['default']('Unexpected inverse block on decorator', inverseAndProgram);
        }

        if (inverseAndProgram.chain) {
            inverseAndProgram.program.body[0].closeStrip = close.strip;
        }

        inverseStrip = inverseAndProgram.strip;
        inverse = inverseAndProgram.program;
    }

    if (inverted) {
        inverted = inverse;
        inverse = program;
        program = inverted;
    }

    return {
        type: decorator ? 'DecoratorBlock' : 'BlockStatement',
        path: openBlock.path,
        params: openBlock.params,
        hash: openBlock.hash,
        program: program,
        inverse: inverse,
        openStrip: openBlock.strip,
        inverseStrip: inverseStrip,
        closeStrip: close && close.strip,
        loc: this.locInfo(locInfo)
    };
}

function prepareProgram(statements, loc) {
    if (!loc && statements.length) {
        var firstLoc = statements[0].loc,
            lastLoc = statements[statements.length - 1].loc;

        /* istanbul ignore else */
        if (firstLoc && lastLoc) {
            loc = {
                source: firstLoc.source,
                start: {
                    line: firstLoc.start.line,
                    column: firstLoc.start.column
                },
                end: {
                    line: lastLoc.end.line,
                    column: lastLoc.end.column
                }
            };
        }
    }

    return {
        type: 'Program',
        body: statements,
        strip: {},
        loc: loc
    };
}

function preparePartialBlock(open, program, close, locInfo) {
    validateClose(open, close);

    return {
        type: 'PartialBlockStatement',
        name: open.path,
        params: open.params,
        hash: open.hash,
        program: program,
        openStrip: open.strip,
        closeStrip: close && close.strip,
        loc: this.locInfo(locInfo)
    };
}