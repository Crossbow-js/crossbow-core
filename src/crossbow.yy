%start root

%ebnf

%%

root
  : program EOF { return $1; }
  ;

program
  : statement* -> { type: 'program', body: $1, loc: yy.locInfo(@$) }
  ;

statement
  : mustache -> $1
  | block -> $1
  | rawBlock -> $1
  | partial -> $1
  | content -> $1
  | COMMENT -> {type: 'comment', value: yy.stripComment($1), strip: yy.stripFlags($1, $1), loc: yy.locInfo(@$)}
  ;

content
  : CONTENT -> {type: 'buffer', value: $1, loc: yy.locInfo(@$)}
  ;

rawBlock
  : openRawBlock content END_RAW_BLOCK -> yy.prepareRawBlock($1, $2, $3, @$)
  ;

openRawBlock
  : OPEN_RAW_BLOCK helperName param* hash? CLOSE_RAW_BLOCK -> { path: $2, params: $3, hash: $4 }
  ;

block
  : openBlock program inverseChain? closeBlock -> yy.prepareBlock($1, $2, $3, $4, false, @$)
  | openInverse program inverseAndProgram? closeBlock -> yy.prepareBlock($1, $2, $3, $4, true, @$)
  ;

openBlock
  : OPEN_BLOCK helperName param* hash? CLOSE -> { path: $2, params: $3, hash: $4, strip: yy.stripFlags($1, $5) }
  ;

openInverse
  : OPEN_INVERSE helperName param* hash? CLOSE -> { path: $2, params: $3, hash: $4, strip: yy.stripFlags($1, $5) }
  ;

openInverseChain
  : OPEN_INVERSE_CHAIN helperName param* hash? CLOSE -> { path: $2, params: $3, hash: $4, strip: yy.stripFlags($1, $5) }
  ;

inverseAndProgram
  : INVERSE program -> { strip: yy.stripFlags($1, $1), program: $2 }
  ;

inverseChain
  : openInverseChain program inverseChain? {
    var inverse = yy.prepareBlock($1, $2, $3, $3, false, @$),
        program = new yy.Program([inverse], null, {}, yy.locInfo(@$));
    program.chained = true;

    $$ = { strip: $1.strip, program: program, chain: true };
  }
  | inverseAndProgram -> $1
  ;

closeBlock
  : OPEN_ENDBLOCK helperName CLOSE -> {path: $2, strip: yy.stripFlags($1, $3)}
  ;

mustache
  // Parsing out the '&' escape token at AST level saves ~500 bytes after min due to the removal of one parser node.
  // This also allows for handler unification as all mustache node instances can utilize the same handler
  : OPEN helperName param* hash? CLOSE -> yy.prepareMustache($2, $3, $4, $1, yy.stripFlags($1, $5), @$)
  | OPEN_UNESCAPED helperName param* hash? CLOSE_UNESCAPED -> yy.prepareMustache($2, $3, $4, $1, yy.stripFlags($1, $5), @$)
  ;

partial
  : OPEN_PARTIAL partialName param* hash? CLOSE -> {type: 'partial', name: $2, params: $3, hash: $4, strip: yy.stripFlags($1, $5), loc: yy.locInfo(@$) }
  ;

param
  : helperName -> $1
  | sexpr -> $1
  ;

sexpr
  : OPEN_SEXPR helperName param* hash? CLOSE_SEXPR -> { type: 'sexpr', path: $2, params: $3, hash: $4, loc: yy.locInfo(@$) }
  ;

hash
  : hashSegment+ -> { type: 'hash', pairs: $1, loc: yy.locInfo(@$) }
  ;

hashSegment
  : ID EQUALS param -> {type: 'hashpair', key: yy.id($1), value: $3, loc: yy.locInfo(@$)}
  ;

helperName
  : path -> $1
  | dataName -> $1
  | STRING ->    {type: 'string', value: $1, loc: yy.locInfo(@$)}
  | NUMBER ->    {type: 'number', value: $1, loc: yy.locInfo(@$)}
  | BOOLEAN ->   {type: 'boolean', value: $1, loc: yy.locInfo(@$)}
  | UNDEFINED -> {type: 'undefined', value: $1, loc: yy.locInfo(@$)}
  | NULL ->      {type: 'null', value: $1, loc: yy.locInfo(@$)}
  ;

partialName
  : helperName -> $1
  | sexpr -> $1
  ;

dataName
  : DATA pathSegments -> yy.preparePath(true, $2, [], @$)
  ;

path
  : pathSegments filter? -> yy.preparePath(false, $1, [], @$)
  ;

filter
  : PIPE pathSegments -> $2
  ;

pathSegments
  : pathSegments SEP ID { $1.push({part: yy.id($3), original: $3, separator: $2}); $$ = $1; }
  | ID -> [{part: yy.id($1), original: $1}]
  ;