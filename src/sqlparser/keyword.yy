KEYWORD
	: SQLKEYWORD
		{ $$ = $1; }
	| DYNAMODBKEYWORD
		{ $$ = $1; }
	;
