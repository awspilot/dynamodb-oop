
replace_stmt
	: REPLACE INTO dynamodb_table_name_or_keyword SET def_replace_columns
		{
			var $kv = {}
			$5.map(function(v) {
				$kv[v[0]] = v[1]
			})
			$$ = {
				statement: 'REPLACE',
				operation: 'putItem',
				dynamodb: {
					TableName: $3,
					Item: $kv
				},
			}
		}
	;


def_replace_columns
	: def_replace_columns COMMA def_replace_onecolumn
		{ $$ = $1; $$.push($3); }
	| def_replace_onecolumn
		{ $$ = [$1]; }
	;
def_replace_onecolumn
	: name EQ javascript_raw_expr
		{ $$ = [ $1, $3 ]; }
/*
	: name EQ dynamodb_raw_string
		{ $$ = [ $1, $3 ]; }
	| name EQ dynamodb_raw_number
		{ $$ = [ $1, $3 ]; }
	// javascript objects
	| name EQ javascript_raw_obj_date
		{ $$ = [ $1, $3 ]; }
	| name EQ javascript_raw_obj_math
		{ $$ = [ $1, $3 ]; }

*/

	| name EQ dynamodb_raw_boolean
		{ $$ = [ $1, $3 ]; }
	| name EQ dynamodb_raw_null
		{ $$ = [ $1, $3 ]; }
	| name EQ dynamodb_raw_json
		{ $$ = [ $1, $3 ]; }
	| name EQ dynamodb_raw_array
		{ $$ = [ $1, $3 ]; }
	| name EQ dynamodb_raw_stringset
		{ $$ = [ $1, $3 ]; }
	| name EQ dynamodb_raw_numberset
		{ $$ = [ $1, $3 ]; }
	;
