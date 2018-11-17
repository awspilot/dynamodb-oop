dynamodb_data_null
	: NULL
		{ $$ = null; }
	;

dynamodb_raw_null
	: NULL
		{ $$ = { 'NULL': true } }
	;