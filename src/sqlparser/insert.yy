
insert_stmt
	: INSERT def_insert_ignore INTO dynamodb_table_name_or_keyword SET def_insert_columns
		{
			var $kv = {}
			$6.map(function(v) { $kv[v[0]] = v[1] })

			$$ = {
				statement: 'INSERT',
				operation: 'putItem',
				ignore: $2,
				dynamodb: {
					TableName: $4,
					Item: $kv,

				},

			};

		}
	| INSERT def_insert_ignore INTO dynamodb_table_name_or_keyword VALUES def_insert_items
		{
			if ($6.length == 1) {
				$$ = {
					statement: 'INSERT',
					operation: 'putItem',
					ignore: $2,
					dynamodb: {
						TableName: $4,
						Item: $6[0].M,
					},

				};
			} else {
				// batch insert
				$$ = {
					statement: 'BATCHINSERT',
					operation: 'batchWriteItem',
					dynamodb: {
						RequestItems: {}
					}

				}

				var RequestItems = {}

				RequestItems[$4] = []

				$6.map(function(v) {
					RequestItems[$4].push({
						PutRequest: {
							Item: v.M
						}
					})
				})
				$$.dynamodb.RequestItems = RequestItems;
			}
		}
	;

def_insert_ignore
	:
		{{ $$ = false }}
	| IGNORE
		{{ $$ = true }}
	;


def_insert_items
	: def_insert_items COMMA def_insert_item
		{ $$ = $1; $$.push($3); }
	| def_insert_item
		{ $$ = [$1]; }
	;


def_insert_item
	: LPAR dynamodb_raw_json RPAR
		{ $$ = $2 }
	;

def_insert_columns
	: def_insert_columns COMMA def_insert_onecolumn
		{ $$ = $1; $$.push($3); }
	| def_insert_onecolumn
		{ $$ = [$1]; }
	;
def_insert_onecolumn
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
	;
