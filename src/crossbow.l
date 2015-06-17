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

<mu>"{{"  return 'OPEN'
<mu>"}}"  this.popState(); return 'CLOSE';
<mu>{ID}  return 'ID'

<INITIAL,mu><<EOF>>              return 'EOF';