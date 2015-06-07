import _ from 'lodash';
import Immutable from 'immutable';

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

        let val = compiler.resolveValue({node: node.context, ctx: ctx});

        let out      = [];
        let sep      = '';

        if (Array.isArray(val.value)) {
            val.value.forEach(function (value, i) {
                out.push(compiler.process({ast: node.bodies, ctx: val.ctx.concat(i)}));
            });
        } else if (_.isObject(val.value)) {
            Object.keys(val.value).forEach(function (key) {
                out.push(compiler.process({ast: node.bodies, ctx: val.ctx.concat(key)}));
            });
        }

        return out.join(sep);
    }
}
