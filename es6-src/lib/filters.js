export default {
    upper (string, ctx) {
        return string.toUpperCase();
    },
    ucfirst (value, ctx) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
