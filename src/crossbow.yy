%start root

%ebnf

%%

root
  : program EOF { return $1; }
  ;

program
  : statement* -> {bodies: $1}
  ;

statement
  : mustache -> $1
  | content -> $1
  ;

content
  : CONTENT -> {type: 'content', value: $1}
  ;

mustache
  : LD path+ RD -> {type: 'mustache', id: $2, loc: yy.locInfo(@$)}
  ;

path
  : pathPart+ -> {type: 'path', paths: $1}
  ;

pathPart
  : pathPart PATH_SEP -> $1
  | ID -> $1
  ;