'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _filters = require('./filters');

var _filters2 = _interopRequireDefault(_filters);

var _nodes = require('./nodes');

var _nodes2 = _interopRequireDefault(_nodes);

var _parser = require('../src/parser');

var _parser2 = _interopRequireDefault(_parser);

var Compiler = (function () {
    function Compiler(opts) {
        _classCallCheck(this, Compiler);

        this.opts = opts;
        this.helpers = _helpers2['default'];
        this.filters = _filters2['default'];
        this.nodes = _nodes2['default'];
    }

    _createClass(Compiler, [{
        key: 'firstPass',

        /**
         * Perform any initial tranformations on
         * ast before even thinking about context
         * @param ast
         * @returns {Array|*}
         */
        value: function firstPass(ast) {

            var compiler = this;

            return ast.map(function (item, i, all) {

                if (item.type === '#') {
                    if (all[i - 1].type === 'format') {
                        all[i - 1].skip = true;
                    }
                    if (item.bodies) {
                        var next = item.bodies[item.bodies.length - 1];
                        if (next && next.type === 'format') {
                            next.skip = true;
                        }
                        item.bodies = compiler.firstPass(item.bodies);
                    }
                }

                if (item.raw && item.type !== '@') {
                    item.bodies = _parser2['default'].parse(item.raw);
                }
                return item;
            });
        }
    }, {
        key: 'parse',

        /**
         *
         * @param content
         * @param opts
         * @param ctx
         * @returns {*}
         */
        value: function parse(_ref) {
            var content = _ref.content;
            var _ref$opts = _ref.opts;
            var opts = _ref$opts === undefined ? {} : _ref$opts;
            var _ref$ctx = _ref.ctx;
            var ctx = _ref$ctx === undefined ? {} : _ref$ctx;

            var compiler = this;
            var ast = _parser2['default'].parse(content);
            ast = compiler.firstPass(ast);
            return compiler.process({ ast: ast, ctx: ctx, compiler: compiler });
        }
    }, {
        key: 'process',

        /**
         * Final step, transform AST > String
         * by visiting each node
         * @param ast
         * @param ctx
         * @param compiler
         * @returns {*}
         */
        value: function process(_ref2) {
            var ast = _ref2.ast;
            var ctx = _ref2.ctx;
            var compiler = _ref2.compiler;

            return ast.reduce(function (all, node) {
                if (node.skip) {
                    return all;
                }
                if (compiler.nodes[node.type]) {
                    all += compiler.nodes[node.type]({ node: node, ctx: ctx, compiler: compiler });
                }

                return all;
            }, '');
        }
    }, {
        key: 'error',

        /**
         * Error handling
         * @param err
         */
        value: function error(err) {
            console.error(err);
        }
    }]);

    return Compiler;
})();

exports['default'] = Compiler;
module.exports = exports['default'];