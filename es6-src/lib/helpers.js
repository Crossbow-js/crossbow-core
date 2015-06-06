export default {
    hl ({node, ctx, compiler}) {
        if (!node.raw) {
            compiler.error('@hl helper expects a raw block, an empty string will be used in stead');
            compiler.error('eg: {@hl}var name = "shane"{/@hl}');
            return '';
        }
        return `<pre class="highlight"><code>${node.raw}</code></pre>`;
    },

    loop ({node, ctx, compiler}) {

        let lookup   = compiler.getLookupPath({node: node.context});
        let freshctx = ctx.concat(lookup);
        let value    = compiler.getValue(freshctx);

        let out      = [];
        let sep      = '';

        if (Array.isArray(value)) {
            value.forEach(function (value, i) {
                out.push(compiler.process({ast: node.bodies, ctx: freshctx.concat(i)}));
            });
        }

        return out.join(sep);
    }
}
