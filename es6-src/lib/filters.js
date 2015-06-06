export default {
    upper ({value, ctx}) {
        return value.toUpperCase();
    },
    ucfirst ({value, ctx}) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    },
    "+": function ({value, ctx}) {
        console.log(value);
    },
    "another": function ({value, ctx}) {
        console.log(ctx);
    },
    "plus": function ({node, ctx}) {
        console.log(node.modifiers[0].args);
    }

}
