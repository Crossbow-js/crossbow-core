import Exception from './exception';

export function SourceLocation(source, locInfo) {
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

export function id(token) {
    if (/^\[.*\]$/.test(token)) {
        return token.substr(1, token.length - 2);
    } else {
        return token;
    }
}

export function stripFlags(open, close) {
    return {
        open: open.charAt(2) === '~',
        close: close.charAt(close.length - 3) === '~'
    };
}

export function stripComment(comment) {
    return comment.replace(/^\{\{~?\!-?-?/, '')
        .replace(/-?-?~?\}\}$/, '');
}

export function preparePath(helper, parts, filters, locInfo) {

    locInfo = this.locInfo(locInfo);

    let original = helper ? '@' : '',
        dig = [],
        depth = 0,
        depthString = '';

    for (let i = 0, l = parts.length; i < l; i++) {
        let part = parts[i].part,
        // If we have [] syntax then we do not treat path references as operators,
        // i.e. foo.[this] resolves to approximately context.foo['this']
            isLiteral = parts[i].original !== part;
        original += (parts[i].separator || '') + part;

        if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
            if (dig.length > 0) {
                throw new Exception('Invalid path: ' + original, {loc: locInfo});
            } else if (part === '..') {
                depth++;
                depthString += '../';
            }
        } else {
            dig.push(part);
        }
    }

    return {
        helper,
        filters,
        depth,
        parts,
        original,
        loc: locInfo
    }
}

export function prepareMustache(path, params, hash, open, strip, locInfo) {
    // Must use charAt to support IE pre-10
    let escapeFlag = open.charAt(3) || open.charAt(2),
        escaped = escapeFlag !== '{' && escapeFlag !== '&';

    return {
        type: "mustache",
        loc: this.locInfo(locInfo),
        path,
        params,
        hash,
        escaped,
        strip
    }
}

export function prepareRawBlock(openRawBlock, content, close, locInfo) {
    if (openRawBlock.path.original !== close) {
        let errorNode = {loc: openRawBlock.path.loc};

        throw new Exception(openRawBlock.path.original + " doesn't match " + close, errorNode);
    }

    locInfo = this.locInfo(locInfo);

    return {
        type: 'raw',
        path: openRawBlock.path,
        params: openRawBlock.params,
        hash: openRawBlock.hash,
        program: {
            body: [content],
            type: 'program',
            loc: locInfo
        },
        loc: locInfo
    };
}

export function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
    // When we are chaining inverse calls, we will not have a close path
    if (close && close.path && openBlock.path.original !== close.path.original) {
        let errorNode = {loc: openBlock.path.loc};

        throw new Exception(openBlock.path.original + ' doesn\'t match ' + close.path.original, errorNode);
    }

    program.blockParams = openBlock.blockParams;

    let inverse,
        inverseStrip;

    if (inverseAndProgram) {
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

    if (openBlock.helper) {
        openBlock.path.helper = true;
    }

    return {
        type: 'block',
        path: openBlock.path,
        params: openBlock.params,
        hash: openBlock.hash,
        program,
        inverse,
        openStrip: openBlock.strip,
        inverseStrip: inverseStrip,
        closeStrip: close.strip,
        loc: this.locInfo(locInfo)
    }
}