'use strict';

var peg = require('pegjs');
var fs = require('fs');
var path = require('path');

var out = peg.buildParser(fs.readFileSync(path.resolve(__dirname, 'grammar.yaml'), 'utf-8'), { output: 'source' });
fs.writeFileSync(__dirname + '/parser.js', 'module.exports = ' + out);
