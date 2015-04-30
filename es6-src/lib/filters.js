export default {
    upper ({value, ctx}) {
        return value.toUpperCase();
    },
    ucfirst ({value, ctx}) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
