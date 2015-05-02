export default {
    hl ({node, ctx, compiler}) {
        return `<script src="${node.params[0]}">${node.raw}</script>`;
    }
}
