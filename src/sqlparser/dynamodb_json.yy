
dynamodb_data_json
	: JSONLPAR dynamodb_data_json_list JSONRPAR
		{
			var $kv = {}
			if ($2) {
				$2.map(function(v) {
					if (v)
						$kv[v[0]] = v[1]
				})
			}
			$$ = $kv
		}
	;

dynamodb_data_json_list
	: dynamodb_data_json_list COMMA dynamodb_data_json_kv
		{ $$ = $1; $$.push($3); }
	| dynamodb_data_json_kv
		{ $$ = [$1]; }
	;

dynamodb_data_json_kv_key
	: name
		{ $$ = $1 }
	| SINGLE_QUOTED_STRING
		{ $$ = $1 }
	| DOUBLE_QUOTED_STRING
		{ $$ = $1 }
	;

dynamodb_data_json_kv
	:
		{ $$ = undefined; }
	| name COLON dynamodb_data_number
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_number
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_number
		{ $$ = [$1, $3 ] }

	| name COLON dynamodb_data_string
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_string
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_string
		{ $$ = [$1, $3 ] }

	| name COLON dynamodb_data_boolean
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_boolean
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_boolean
		{ $$ = [$1, $3 ] }


	| name COLON dynamodb_data_null
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_null
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_null
		{ $$ = [$1, $3 ] }

	| name COLON dynamodb_data_array
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_array
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_array
		{ $$ = [$1, $3 ] }

	| name COLON dynamodb_data_json
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_json
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_json
		{ $$ = [$1, $3 ] }
	;







dynamodb_raw_json
	: JSONLPAR dynamodb_data_json_list_raw JSONRPAR
		{
			var $kv = {}
			if ($2) {
				$2.map(function(v) {
					if (v)
						$kv[v[0]] = v[1]
				})
			}
			$$ = { 'M': $kv }
		}
	;
dynamodb_data_json_list_raw
	: dynamodb_data_json_list_raw COMMA dynamodb_raw_json_kv
		{ $$ = $1; $$.push($3); }
	| dynamodb_raw_json_kv
		{ $$ = [$1]; }
	;

dynamodb_raw_json_kv_key
	: name
		{ $$ = $1 }
	| SINGLE_QUOTED_STRING
		{ $$ = eval($1) }
	| DOUBLE_QUOTED_STRING
		{ $$ = eval($1) }
	;

dynamodb_raw_json_kv
	:
		{ $$ = undefined; }


	| dynamodb_raw_json_kv_key COLON javascript_raw_expr
		{ $$ = [$1, $3 ] }


/*
	| dynamodb_raw_json_kv_key COLON dynamodb_raw_number
		{ $$ = [$1, $3 ] }

	| dynamodb_raw_json_kv_key COLON dynamodb_raw_string
		{ $$ = [$1, $3 ] }
*/






	| dynamodb_raw_json_kv_key COLON dynamodb_raw_boolean
		{ $$ = [$1, $3 ] }


	| dynamodb_raw_json_kv_key COLON dynamodb_raw_null
		{ $$ = [$1, $3 ] }

	| dynamodb_raw_json_kv_key COLON dynamodb_raw_array
		{ $$ = [$1, $3 ] }

	| dynamodb_raw_json_kv_key COLON dynamodb_raw_json
		{ $$ = [$1, $3 ] }
	;
