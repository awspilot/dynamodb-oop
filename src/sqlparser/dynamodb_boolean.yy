dynamodb_data_boolean
	: TRUE
		{ $$ = true; }
	| FALSE
		{ $$ = false; }
	;

dynamodb_raw_boolean
	: TRUE
		{ $$ = { 'BOOL': true  } }
	| FALSE
		{ $$ = { 'BOOL': false } }
	;
