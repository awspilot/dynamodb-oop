
dynamodb_data_string
	: SINGLE_QUOTED_STRING
		{ $$ = eval($1); }
	| DOUBLE_QUOTED_STRING
		{ $$ = eval($1); }
	;

dynamodb_raw_string
	: SINGLE_QUOTED_STRING
		{ $$ = { 'S': eval($1).toString() } }
	| DOUBLE_QUOTED_STRING
		{ $$ = { 'S': eval($1).toString() } }
	;