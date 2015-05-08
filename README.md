### crossbow-core

> because all the other templating languages are not quite what Crossbow needs. 

## Design goals

Create a powerful, low-level templating language. Node/iojs only - avoiding the browser means 
there's no need to worry about deliverable code size going over the network.

### Better helpers

Traditional helper blocks should be more powerful. Give them *either* access to the AST + Compiler
*or* access to the raw, un-processed content. 
 
**helper has access to raw, unprocessed content using `@` in end tag**
```html
{@hl}
var helperGets = 'raw string content';
{/@hl}
```

**helper has access to AST when `@` is omitted from end tag**
```html
{@hl}
var helperGets = 'AST';
{/hl}
```

### Better Filters

Filter / Modifiers should accept multiple arguments inline.
 
```
{post.excerpt|trunc~200}
```

### Access any module

As it's node only, allow `namespace` `:` `method` `:` `arg` signature for filters to leverage
any module. For example, to process a variable by passing it through the lodash 
function `pad` with the args `10` & `-`;
  
```
{tag|lodash:trunc~10, '-'}
```

## Todo - Parser

- [x] Helper blocks have access RAW input via `{@helper}content{/@helper}`
- [x] Helper blocks have access to ast via `{@helper}content{/helper}`
- [x] Filters/modifiers should accept params eg: `{post.excerpt|trunc~200}`.
- [ ] Configurable left / right delimeters
- [ ] Inverse blocks with `{else:}`
- [x] Every node should report detailed location info
- [x] Path notation for references: `{name}` `{person.name}` etc
- [x] Array notation for references: `{people[0].name}` etc

## Todo - Compiler

- [x] Use immutable data structure for initial context 
- [x] Allow helpers to be registered 
- [x] Allow filters to be registered 
- [ ] Allow modifiers to be registered 
- [x] Raw input should nuke whitespace if a tag is the only item on a line. 
- [x] Helper blocks have access to AST & compiler.
- [x] Iterator for arrays `{#names}{first}{/names}`
- [ ] Iterator for object with keys/values `{@loop:pkg}{$key} - {value}{/loop}`
- [x] Path lookup for references
- [ ] **Reverse** Path lookup for references
- [ ] Index lookup for references
