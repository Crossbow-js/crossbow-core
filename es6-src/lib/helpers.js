export default {
    hl ({node, ctx, compiler}) {
        if (!node.raw) {
            compiler.error('@hl helper expects a raw block, an empty string will be used in stead');
            compiler.error('eg: {@hl}var name = "shane"{/@hl}');
            return '';
        }
        return `<pre class="highlight"><code>${node.raw}</code></pre>`;
    }
}
