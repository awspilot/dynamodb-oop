
update_stmt
	: UPDATE dynamodb_table_name_or_keyword SET def_update_columns WHERE def_update_where
		{

			var Key = {}
			$6.map(function(k) {
				Key[k.k] = k.v
			})
			var Expected = {}
			$6.map(function(k) {
				Expected[k.k] = {
					ComparisonOperator: 'EQ',
					Value: k.v,

				}
			})

			var AttributeUpdates = {}
			$4.map(function(k) {
				var Value = k[1]
				var Action = 'PUT' // default

				if (k[2] === '+=')
					Action = 'ADD'

				if (k[2] === 'delete') {
					Action = 'DELETE'

				}

				AttributeUpdates[k[0]] = {
					Action: Action,
					Value: Value,
				}
			})

			$$ = {
				statement: 'UPDATE',
				operation: 'updateItem',
				dynamodb: {
					TableName: $2,
					Key: Key,
					Expected: Expected,
					AttributeUpdates: AttributeUpdates,
				},
			}
		}
	;


def_update_columns
	: def_update_columns COMMA def_update_onecolumn
		{ $$ = $1; $$.push($3); }
	| def_update_onecolumn
		{ $$ = [$1]; }
	;
def_update_onecolumn
	: dynamodb_attribute_name_or_keyword EQ javascript_raw_expr
		{ $$ = [ $1, $3 ]; }

	/* javascript_raw_expr replaces dynamodb_raw_string, dynamodb_raw_number, javascript_raw_obj_date, javascript_raw_obj_math */

	| dynamodb_attribute_name_or_keyword EQ dynamodb_raw_boolean
		{ $$ = [ $1, $3 ]; }
	| dynamodb_attribute_name_or_keyword EQ dynamodb_raw_null
		{ $$ = [ $1, $3 ]; }
	| dynamodb_attribute_name_or_keyword EQ dynamodb_raw_json
		{ $$ = [ $1, $3 ]; }
	| dynamodb_attribute_name_or_keyword EQ dynamodb_raw_array
		{ $$ = [ $1, $3 ]; }
	| dynamodb_attribute_name_or_keyword EQ dynamodb_raw_stringset
		{ $$ = [ $1, $3 ]; }
	| dynamodb_attribute_name_or_keyword EQ dynamodb_raw_numberset
		{ $$ = [ $1, $3 ]; }
	| dynamodb_attribute_name_or_keyword EQ dynamodb_raw_binaryset
		{ $$ = [ $1, $3 ]; }

	| dynamodb_attribute_name_or_keyword PLUSEQ javascript_raw_expr
		{ $$ = [ $1, $3, '+=' ]; }
	| dynamodb_attribute_name_or_keyword EQ dynamodb_data_undefined
		{ $$ = [ $1, undefined, 'delete' ]; }
	;

def_update_where
	: def_update_where_cond
		{ $$ = [ $1 ]; }
	| def_update_where_cond AND def_update_where_cond
		{ $$ = [$1, $3]; }
	;



def_update_where_cond
	: name EQ javascript_raw_expr
		{ $$ = {k: $1, v: $3 }; }

	/*
	: name EQ dynamodb_raw_string
		{ $$ = {k: $1, v: $3 }; }
	| name EQ dynamodb_raw_number
		{ $$ = {k: $1, v: $3 }; }

	// javascript objects
	| name EQ javascript_raw_obj_date
		{ $$ = {k: $1, v: $3 }; }
	| name EQ javascript_raw_obj_math
		{ $$ = {k: $1, v: $3 }; }
	*/
	;
