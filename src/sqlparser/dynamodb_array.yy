/* there is a bug that causes array to return last element in array  as null, eg: [ null ] */

dynamodb_data_array
	: ARRAYLPAR array_list ARRAYRPAR
		{
			if ($2.slice(-1) == "\0") {
				$$ = $2.slice(0,-1)
			} else
				$$ = $2;
		}
	;
array_list
	: array_list COMMA array_value
		{
			$$ = $1
			$$.push($3);
		}
	| array_value
		{ $$ = [$1]; }
	;

/* array should also support expr */
array_value
	:
		{ $$ = "\0" }
	| dynamodb_data_number
		{ $$ = $1 }
	| dynamodb_data_string
		{ $$ = $1 }
	| dynamodb_data_boolean
		{ $$ = $1 }
	| dynamodb_data_null
		{ $$ = $1 }
	| dynamodb_data_array
		{ $$ = $1 }
	| dynamodb_data_json
		{ $$ = $1 }
	;





dynamodb_raw_array
	: ARRAYLPAR array_list_raw ARRAYRPAR
		{
			if ($2.slice(-1) == "\0") {
				$2 = $2.slice(0,-1)
			}
			$$ = { 'L': $2 }
		}
	;
array_list_raw
	: array_list_raw COMMA array_value_raw
		{
			$$ = $1
			$$.push($3);
		}
	| array_value_raw
		{ $$ = [$1]; }
	;
array_value_raw
	:
		{ $$ = "\0" }

	/* javascript_raw_expr replaces dynamodb_raw_string, dynamodb_raw_number, javascript_raw_obj_date, javascript_raw_obj_math */
	| javascript_raw_expr
		{ $$ = $1 }
	| dynamodb_raw_boolean
		{ $$ = $1 }
	| dynamodb_raw_null
		{ $$ = $1 }
	| dynamodb_raw_array
		{ $$ = $1 }
	| dynamodb_raw_json
		{ $$ = $1 }
	| dynamodb_raw_numberset
		{ $$ = $1 }
	| dynamodb_raw_stringset
		{ $$ = $1 }
	| dynamodb_raw_binaryset
		{ $$ = $1 }
	;
