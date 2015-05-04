import parser  from '../src/parser';

// Check if a string consists of *only* whitespace chars
const containsWhitespaceOnly = /^[\n\t\v\f \u00A0\uFEFF]+$/;

function formattingPass ({ast, ctx, compiler}) {

    //return ast;
    return ast.map(function (item, i, all) {

        /**
         * Reference blocks.
         * These are typically 'loops' so we want to
         * strip whitespace from around the tags and allow
         */
        if (item.type === "#") {
            let start = item.loc.start.column;
            let prev = all[i-1];
            prev.raw = prev.raw.slice(0, prev.raw.length - start);

            if (item.end) {
                let start = item.end.loc.start.column;
                let lastBody = item.bodies[item.bodies.length -1];
                if (lastBody && lastBody.type === 'format') {
                    lastBody.raw = lastBody.raw.slice(0, lastBody.raw.length - start);
                }
            }
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

export {formattingPass as formattingPass};
