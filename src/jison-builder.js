var fs = require('fs');
var Jison = require('jison');

var grammar = fs.readFileSync(__dirname + '/grammar.jison', 'utf8');
var generator = new Jison.Generator(grammar);
var source = generator.generate({
    moduleType: 'commonjs',
    moduleName: 'Crossbow'
});
fs.writeFileSync(__dirname + '/jison-parser.js', source);

require('./jison-parser.js').parse('Hi');