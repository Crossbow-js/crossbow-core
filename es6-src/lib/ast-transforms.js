import parser  from '../src/parser';

function formattingPass ({ast, ctx, compiler}) {
    return ast.map(function (item, i, all) {

        if (item.type === "#") {
            let start = item.loc.start.column;
            let prev = all[i-1];
            prev.raw = prev.raw.slice(0, prev.raw.length - start);

            if (item.end) {
                start = item.end.loc.start.column;
                let lastBody = item.bodies[item.bodies.length -1];
                if (lastBody && lastBody.type === 'format') {
                    lastBody.raw = lastBody.raw.slice(0, lastBody.raw.length - start);
                }
            }
        }

        if (item.raw && item.type !== '@') {
            item.bodies = parser.parse(item.raw);
        }
        return item;
    });
}

export {formattingPass as formattingPass};
