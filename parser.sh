#!/usr/bin/env bash
./node_modules/.bin/jison -m 'commonjs' 'src/crossbow.yy' 'src/crossbow.l' -o src/jison-parse.js
echo "Done with Parser"