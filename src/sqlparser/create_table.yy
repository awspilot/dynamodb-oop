
create_table_stmt
	: CREATE def_billing_mode TABLE dynamodb_table_name_or_keyword LPAR def_ct_typedef_list COMMA def_ct_pk def_ct_indexes RPAR
		{
			$$ = {
				statement: 'CREATE_TABLE',
				operation: 'createTable',
				dynamodb: {
					TableName: $4,
					BillingMode: $2,
					AttributeDefinitions: $6,
				}

			};
			yy.extend($$.dynamodb,$8); // extend with pk
			yy.extend($$.dynamodb,$9); // extend with indexes
		}
	;

def_billing_mode
	:
		{ $$ = undefined; }
	| PROVISIONED
		{ $$ = $1; }
	| PAY_PER_REQUEST
		{ $$ = $1; }
	;



def_ct_indexes
	:
		{ $$ = undefined; }
	| COMMA def_ct_index_list
		{
			var indexes = {
				LocalSecondaryIndexes: [],
				GlobalSecondaryIndexes: []
			}

			$2.map(function(idx) {
				if (idx.hasOwnProperty('LSI'))
					indexes.LocalSecondaryIndexes.push(idx.LSI)
				if (idx.hasOwnProperty('GSI'))
					indexes.GlobalSecondaryIndexes.push(idx.GSI)
			})
			$$ = indexes
		}
	;
def_ct_index_list
	: def_ct_index_list COMMA def_ct_index
		{ $$ = $1; $$.push($3); }
	| def_ct_index
		{ $$ = [ $1 ]; }
	;

def_ct_index
	: INDEX dynamodb_index_name_or_keyword LSI LPAR name RPAR def_ct_projection
		{
			$$ = {}
			$$[$3] = {
				IndexName: $2,
				KeySchema: [ { AttributeName: $5, KeyType: 'HASH' } ],
				Projection: $7,
			}
		}
	| INDEX dynamodb_index_name_or_keyword GSI LPAR name RPAR def_ct_projection def_ct_throughput
		{
			$$ = {}
			$$[$3] = {
				IndexName: $2,
				KeySchema: [ { AttributeName: $5, KeyType: 'HASH' } ],
				Projection: $7,
				ProvisionedThroughput: $8
			}
		}

	| INDEX dynamodb_index_name_or_keyword LSI LPAR name COMMA name RPAR def_ct_projection
		{
			$$ = {}
			$$[$3] = {
				IndexName: $2,
				KeySchema: [ { AttributeName: $5, KeyType: 'HASH' }, { AttributeName: $7, KeyType: 'RANGE' } ],
				Projection: $9,
			}
		}
	| INDEX dynamodb_index_name_or_keyword GSI LPAR name COMMA name RPAR def_ct_projection def_ct_throughput
		{
			$$ = {}
			$$[$3] = {
				IndexName: $2,
				KeySchema: [ { AttributeName: $5, KeyType: 'HASH' }, { AttributeName: $7, KeyType: 'RANGE' } ],
				Projection: $9,
				ProvisionedThroughput: $10
			}
		}
	;

def_ct_pk
	: PRIMARY KEY LPAR name            RPAR def_ct_throughput
		{ $$ = { KeySchema: [ { AttributeName: $4, KeyType: 'HASH' }], ProvisionedThroughput: $6 }  }
	| PRIMARY KEY LPAR name COMMA name RPAR def_ct_throughput
		{ $$ = { KeySchema: [ { AttributeName: $4, KeyType: 'HASH' } , { AttributeName: $6, KeyType: 'RANGE' } ], ProvisionedThroughput: $8 }  }
	;
def_ct_throughput
	:
		{ $$ = { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }; }
	| THROUGHPUT signed_number signed_number
		{ $$ = { ReadCapacityUnits: eval($2), WriteCapacityUnits: eval($3) } }
	;

def_ct_projection
	:
		{ $$ = { ProjectionType: 'ALL' }; }
	| PROJECTION ALL
		{ $$ = { ProjectionType: 'ALL' }; }
	| PROJECTION KEYS_ONLY
		{ $$ = { ProjectionType: 'KEYS_ONLY' } }
	| PROJECTION INCLUDE LPAR def_ct_projection_list RPAR
		{ $$ = { ProjectionType: 'INCLUDE', NonKeyAttributes: $4 } }
	;

def_ct_projection_list
	: def_ct_projection_list COMMA dynamodb_attribute_name_or_keyword
		{ $$ = $1; $$.push($3); }
	| dynamodb_attribute_name_or_keyword
		{ $$ = [$1]; }
	;


def_ct_typedef_list
	: def_ct_typedef_list COMMA def_ct_typedef
		{ $$ = $1; $$.push($3) }
	| def_ct_typedef
		{ $$ = [ $1 ]; }
	;

def_ct_typedef
	: dynamodb_attribute_name_or_keyword STRING
		{ $$ = { AttributeName: $1, AttributeType: 'S'}; }
	| dynamodb_attribute_name_or_keyword NUMBER
		{ $$ = { AttributeName: $1, AttributeType: 'N'}; }
	| dynamodb_attribute_name_or_keyword BINARY
		{ $$ = { AttributeName: $1, AttributeType: 'B'}; }
	;
