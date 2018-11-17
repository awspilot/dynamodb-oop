dynamodb_data_number
	: NUMBER
		{ $$ = eval($1); }
	;

dynamodb_raw_number
	: NUMBER
		{ $$ = { 'N': eval($1).toString() } }
	;