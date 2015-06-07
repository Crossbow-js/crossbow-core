import parser  from '../src/parser';

// Check if a string consists of *only* whitespace chars
const containsWhitespaceOnly = /^[\n\t\v\f \u00A0\uFEFF]+$/;

function formattingPass ({ast, ctx, compiler}) {

    //return ast;
    return ast.map(function (item, i, all) {

        /**
         * Helper blocks.
         * Strip formatting from same line
         */
        if (item.type === "@") {
            formattingFn(item, i, all);
        }
        /**
         * These are typically 'loops' so we want to
         * strip whitespace from around the tags and allow
         */
        if (item.type === "#") {
            formattingFn(item, i, all);
        }

        /**
         * Raw helper - remove formatting running upto closing tag
         */
        if (item.type === "@" && item.raw) {

            let endtagStart = item.end.loc.start.column;
            let rawEnd = item.raw.slice(item.raw.length - endtagStart);

            /**
             * If the last x chars of the raw block are 'formatting' code,
             * strip them.
             */
            if (rawEnd.match(containsWhitespaceOnly)) {
                item.raw = item.raw.slice(0, item.raw.length - endtagStart);
            }
        }

        if (item.raw && item.type !== '@') {
            item.bodies = parser.parse(item.raw);
        }

        return item;
    });
}

/**
 * @param item
 * @param i
 * @param all
 * @returns {*}
 */
function formattingFn (item, i, all) {
    let start = item.loc.start.column;
    let prev = all[i-1];

    if (prev && prev.type === 'format') {
        prev.raw = prev.raw.slice(0, prev.raw.length - start);
    }

    if (item.end && item.bodies) {
        let start = item.end.loc.start.column;
        let lastBody = item.bodies[item.bodies.length -1];
        if (lastBody && lastBody.type === 'format') {
            lastBody.raw = lastBody.raw.slice(0, lastBody.raw.length - start);
        }
    }
    return item;
}

export {formattingPass as formattingPass};
export {formattingFn as formattingFn};
