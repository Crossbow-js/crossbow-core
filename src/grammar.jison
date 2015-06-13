%x mu emu com raw

%{

function strip(start, end) {
  return yytext = yytext.substr(start, yyleng-end);
}

%}

LEFT_STRIP    "~"
RIGHT_STRIP   "~"

LOOKAHEAD           [=~}\s\/.)|]
LITERAL_LOOKAHEAD   [~}\s)]

/*
ID is the inverse of control characters.
Control characters ranges:
  [\s]          Whitespace
  [!"#%-,\./]   !, ", #, %, &, ', (, ), *, +, ,, ., /,  Exceptions in range: $, -
  [;->@]        ;, <, =, >, @,                          Exceptions in range: :, ?
  [\[-\^`]      [, \, ], ^, `,                          Exceptions in range: _
  [\{-~]        {, |, }, ~
*/
ID    [^\s!"#%-,\.\/;->@\[-\^`\{-~]+/{LOOKAHEAD}

%%

[^\x00]*?/("{{")                {
                                   if(yytext.slice(-2) === "\\\\") {
                                     strip(0,1);
                                     this.begin("mu");
                                   } else if(yytext.slice(-1) === "\\") {
                                     strip(0,1);
                                     this.begin("emu");
                                   } else {
                                     this.begin("mu");
                                   }
                                   if(yytext) return 'CONTENT';
                                 }

[^\x00]+                         return 'CONTENT';

// marks CONTENT up to the next mustache or escaped mustache
<emu>[^\x00]{2,}?/("{{"|"\\{{"|"\\\\{{"|<<EOF>>) {
                                   this.popState();
                                   return 'CONTENT';
                                 }

<raw>"{{{{/"[^\s!"#%-,\.\/;->@\[-\^`\{-~]+/[=}\s\/.]"}}}}" {
                                  yytext = yytext.substr(5, yyleng-9);
                                  this.popState();
                                  return 'END_RAW_BLOCK';
                                 }
<raw>[^\x00]*?/("{{{{/")         { return 'CONTENT'; }

<com>[\s\S]*?"--"{RIGHT_STRIP}?"}}" {
  this.popState();
  return 'COMMENT';
}

<mu>"("                          return 'OPEN_SEXPR';
<mu>")"                          return 'CLOSE_SEXPR';

<mu>"{{{{"                       { return 'OPEN_RAW_BLOCK'; }
<mu>"}}}}"                       {
                                  this.popState();
                                  this.begin('raw');
                                  return 'CLOSE_RAW_BLOCK';
                                 }
<mu>"{{"{LEFT_STRIP}?">"         return 'OPEN_PARTIAL';
<mu>"{{"{LEFT_STRIP}?"#"         return 'OPEN_BLOCK';
<mu>"{{"{LEFT_STRIP}?"/"         return 'OPEN_ENDBLOCK';
<mu>"{{"{LEFT_STRIP}?"^"\s*{RIGHT_STRIP}?"}}"        this.popState(); return 'INVERSE';
<mu>"{{"{LEFT_STRIP}?\s*"else"\s*{RIGHT_STRIP}?"}}"  this.popState(); return 'INVERSE';
<mu>"{{"{LEFT_STRIP}?"^"         return 'OPEN_INVERSE';
<mu>"{{"{LEFT_STRIP}?\s*"else"   return 'OPEN_INVERSE_CHAIN';
<mu>"{{"{LEFT_STRIP}?"{"         return 'OPEN_UNESCAPED';
<mu>"{{"{LEFT_STRIP}?"&"         return 'OPEN';
<mu>"{{"{LEFT_STRIP}?"!--" {
  this.unput(yytext);
  this.popState();
  this.begin('com');
}
<mu>"{{"{LEFT_STRIP}?"!"[\s\S]*?"}}" {
  this.popState();
  return 'COMMENT';
}
<mu>"{{"{LEFT_STRIP}?            return 'OPEN';

<mu>"="                          return 'EQUALS';
<mu>".."                         return 'ID';
<mu>"."/{LOOKAHEAD}              return 'ID';
<mu>[\/.]                        return 'SEP';
<mu>\s+                          // ignore whitespace
<mu>"}"{RIGHT_STRIP}?"}}"        this.popState(); return 'CLOSE_UNESCAPED';
<mu>{RIGHT_STRIP}?"}}"           this.popState(); return 'CLOSE';
<mu>'"'("\\"["]|[^"])*'"'        yytext = strip(1,2).replace(/\\"/g,'"'); return 'STRING';
<mu>"'"("\\"[']|[^'])*"'"        yytext = strip(1,2).replace(/\\'/g,"'"); return 'STRING';
<mu>"@"                          return 'DATA';
<mu>"true"/{LITERAL_LOOKAHEAD}   return 'BOOLEAN';
<mu>"false"/{LITERAL_LOOKAHEAD}  return 'BOOLEAN';
<mu>"undefined"/{LITERAL_LOOKAHEAD} return 'UNDEFINED';
<mu>"null"/{LITERAL_LOOKAHEAD}   return 'NULL';
<mu>\-?[0-9]+(?:\.[0-9]+)?/{LITERAL_LOOKAHEAD} return 'NUMBER';
<mu>"as"\s+"|"                   return 'OPEN_BLOCK_PARAMS';
<mu>"|"                          return 'CLOSE_BLOCK_PARAMS';

<mu>{ID}                         return 'ID';

<mu>'['[^\]]*']'                 return 'ID';
<mu>.                            return 'INVALID';

<INITIAL,mu><<EOF>>              return 'EOF';

%start root

%ebnf

%%

root
  : program EOF { return $1; }
  ;

program
  : statement* -> new yy.Program($1, null, {}, yy.locInfo(@$))
  ;

statement
  : mustache -> $1
  | block -> $1
  | rawBlock -> $1
  | partial -> $1
  | content -> $1
  | COMMENT -> new yy.CommentStatement(yy.stripComment($1), yy.stripFlags($1, $1), yy.locInfo(@$))
  ;

content
  : CONTENT -> new yy.ContentStatement($1, yy.locInfo(@$))
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
  : OPEN_BLOCK helperName param* hash? blockParams? CLOSE -> { path: $2, params: $3, hash: $4, blockParams: $5, strip: yy.stripFlags($1, $6) }
  ;

openInverse
  : OPEN_INVERSE helperName param* hash? blockParams? CLOSE -> { path: $2, params: $3, hash: $4, blockParams: $5, strip: yy.stripFlags($1, $6) }
  ;

openInverseChain
  : OPEN_INVERSE_CHAIN helperName param* hash? blockParams? CLOSE -> { path: $2, params: $3, hash: $4, blockParams: $5, strip: yy.stripFlags($1, $6) }
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
  : OPEN_PARTIAL partialName param* hash? CLOSE -> new yy.PartialStatement($2, $3, $4, yy.stripFlags($1, $5), yy.locInfo(@$))
  ;

param
  : helperName -> $1
  | sexpr -> $1
  ;

sexpr
  : OPEN_SEXPR helperName param* hash? CLOSE_SEXPR -> new yy.SubExpression($2, $3, $4, yy.locInfo(@$))
  ;

hash
  : hashSegment+ -> new yy.Hash($1, yy.locInfo(@$))
  ;

hashSegment
  : ID EQUALS param -> new yy.HashPair(yy.id($1), $3, yy.locInfo(@$))
  ;

blockParams
  : OPEN_BLOCK_PARAMS ID+ CLOSE_BLOCK_PARAMS -> yy.id($2)
  ;

helperName
  : path -> $1
  | dataName -> $1
  | STRING -> new yy.StringLiteral($1, yy.locInfo(@$))
  | NUMBER -> new yy.NumberLiteral($1, yy.locInfo(@$))
  | BOOLEAN -> new yy.BooleanLiteral($1, yy.locInfo(@$))
  | UNDEFINED -> new yy.UndefinedLiteral(yy.locInfo(@$))
  | NULL -> new yy.NullLiteral(yy.locInfo(@$))
  ;

partialName
  : helperName -> $1
  | sexpr -> $1
  ;

dataName
  : DATA pathSegments -> yy.preparePath(true, $2, @$)
  ;

path
  : pathSegments -> yy.preparePath(false, $1, @$)
  ;

pathSegments
  : pathSegments SEP ID { $1.push({part: yy.id($3), original: $3, separator: $2}); $$ = $1; }
  | ID -> [{part: yy.id($1), original: $1}]
  ;