## crossbow template engine

> for learning & specific templating requirements not available else where.

### Design goals

Create a powerful, low-level templating language. Node/iojs only, avoiding the browser means 
there's no worry about deliverable code size going over the network.

Traditional helper blocks should be more powerful. Give them access to the AST + Compiler
and always allow access to the raw, un-processed content. 
 
```
{@hl}
var shane = 'human';
{/hl}
```

Filter / Modifiers should accept arguments inline. I just like the way Angular does this
 and want this
 
```
{post.excerpt|trunc~200}
```
 
As it's node only, allow `namespace` `:` `method` `:` `arg` signature for filters to leveage
any module. For example, to process a variable by passing it through the lodash 
function `pad` with the args `10` & `-`;
  
```
{tag|lodash:trunc~10, '-'}
```

## Todo - Parser
[x] - Helpers blocks must have access RAW input.
[x] - Filters/modifiers should accept params eg: `{post.excerpt|trunc~200}`.
[ ] - left / right delimiters should be configurable.
[ ] - every node should report detailed location info

## Todo - Compiler
[x] - Helper blocks have access to AST & compiler.
[ ] - Loop blocks can traverse data for lookups
