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

var _formattingPass = require('./ast-transforms');

var _parser = require('../src/parser');

var _parser2 = _interopRequireDefault(_parser);

var _Immutable = require('immutable');

var _Immutable2 = _interopRequireDefault(_Immutable);

var Compiler = (function () {
    function Compiler(opts) {
        _classCallCheck(this, Compiler);

        this.opts = opts;
        this.helpers = _helpers2['default'];
        this.filters = _filters2['default'];
        this.nodes = _nodes2['default'];
    }

    _createClass(Compiler, [{
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
            compiler._original = content;
            compiler._ctx = _Immutable2['default'].fromJS(ctx);
            compiler._ctxPath = [];
            return compiler.process({ ast: ast, ctx: [], compiler: compiler });
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

            var compiler = this;

            ast = _formattingPass.formattingPass({ ast: ast, compiler: compiler, ctx: ctx });

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
        key: 'getValue',
        value: function getValue(paths, advancePointer) {

            var compiler = this;

            if (!Array.isArray(paths)) {
                paths = [paths];
            }

            //let newpath = compiler._ctxPath.concat(paths);

            //if (advancePointer) {
            //    compiler._ctxPath = newpath;
            //}

            var curr = compiler._ctx.getIn(paths);

            if (typeof curr !== 'undefined') {
                if (_Immutable2['default'].Map.isMap(curr) || _Immutable2['default'].List.isList(curr)) {
                    return curr.toJS();
                }
                return curr;
            }
        }
    }, {
        key: 'resolveValue',

        /**
         * Take an array of paths and try to resolve a value
         * @param ctx
         * @param node
         * @returns {{value: *, ctx: Array}}
         */
        value: function resolveValue(_ref3) {
            var ctx = _ref3.ctx;
            var node = _ref3.node;

            var compiler = this;
            var lookup = undefined;
            var paths = node.identifier.paths;
            var value = node.identifier.value;

            if (node.identifier.type === 'key') {
                if (paths && paths.length) {
                    lookup = paths;
                } else {
                    lookup = value;
                }
            }

            ctx = ctx.concat(lookup);

            return {
                value: compiler.getValue(ctx),
                ctx: ctx
            };
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