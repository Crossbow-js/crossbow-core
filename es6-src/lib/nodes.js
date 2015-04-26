import _filters from './filters';

export default {
    buffer: function (item, ctx) {
        return item.value;
    },
    tag: function (item, ctx) {
        var replacement = getId(item, ctx);
        return replacement;
    },
    format: function (item) {
        return item.raw;
    },
    "#": function (item, ctx) {

        if (item.bodies) {

            var curr = ctx[item.identifier.value];

            if (typeof curr === 'undefined') {
                return ''; // no context
            }

            if (typeof curr === 'number' || typeof curr === 'string') {
                return curr;
            }

            if (Array.isArray(curr)) {
                return curr.reduce(function (all, _ctx, i) {

                    _ctx.$this    = _ctx;
                    _ctx.$index   = i;
                    _ctx.$length  = _ctx.length;

                    all += process(item.bodies, {data: _ctx});

                    return all;
                }, '');
            }


            if (typeof curr === 'object') {
                if (Object.keys(curr).length) {
                    var out = Object.keys(curr).reduce(function (all, key, i) {
                        var currContext = {
                            $key:    String(key),
                            $value:  String(curr[key]),
                            $this:   String(curr[key]),
                            $index:  String(i)
                        };
                        all += process(item.bodies, {
                                data: currContext
                            }
                        );
                        return all;
                    }, '');
                    return out;
                }
            }
        }
    },
    reference: function (item, ctx) {

        var filters = item.filters;
        var value;

        if (item.identifier.type === 'key') {
            if (item.identifier.paths) {
                value = require('object-path').get(ctx, item.identifier.value);
            } else {
                value = ctx[item.identifier.value] || '';
            }
        }

        if (filters.length) {
            filters.forEach(function (filter) {
                if (_filters[filter]) {
                    value = _filters[filter](value, ctx);
                }
            })
        }

        return value;
    }
}
