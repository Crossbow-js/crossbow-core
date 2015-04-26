export default {
    'upper': function (string, ctx) {
        return string.toUpperCase();
    },
    'ucfirst': function (value, ctx) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
