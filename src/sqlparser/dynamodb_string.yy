
dynamodb_data_string
	: SINGLE_QUOTED_STRING
		{ $$ = eval($1.split("\n").join("\\n"));}
	| DOUBLE_QUOTED_STRING
		{ $$ = eval($1.split("\n").join("\\n"));}
	;

dynamodb_raw_string
	: SINGLE_QUOTED_STRING
		{ $$ = { 'S': eval($1.split("\n").join("\\n")).toString() } }
	| DOUBLE_QUOTED_STRING
		{ $$ = { 'S': eval($1.split("\n").join("\\n")).toString() } }
	;
