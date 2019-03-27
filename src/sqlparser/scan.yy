scan_stmt
	: def_scan def_scan_limit_clause def_scan_consistent_read
		{
			$$ = {
				statement: $1.statement,
				operation: 'scan',
				dynamodb: $1.dynamodb,
			};

			$$.columns = $1.columns
			$$.having  = Object.keys($1.having).length ? $1.having : undefined;

			yy.extend($$.dynamodb, $2);
			yy.extend($$.dynamodb, $3);
		}
	;
def_scan
	: SCAN def_scan_columns FROM dynamodb_table_name_or_keyword def_scan_use_index def_scan_having def_scan_into
		{
			$$ = {
				dynamodb: {
					TableName: $4,
					IndexName: $5,
				},
				statement: 'SCAN',
				columns:$2,
				having: {},
			};
			yy.extend($$,$6); // filter

			if ($7 && $7.type === 'stream')
				$$.statement = 'SCAN_DUMP_STREAM'

			// if we have star, then the rest does not matter
			if ($$.columns.filter(function(c) { return c.type === 'star'}).length === 0) {
				if (!$$.dynamodb.hasOwnProperty('ExpressionAttributeNames'))
					$$.dynamodb.ExpressionAttributeNames = {}

				var ExpressionAttributeNames_from_projection = { }
				var ProjectionExpression = []
				$$.columns.map(function(c) {
					if (c.type === "column") {
						var replaced_name = '#projection_' + c.column.split('-').join('_minus_').split('.').join('_dot_')
						ExpressionAttributeNames_from_projection[replaced_name] = c.column;
						ProjectionExpression.push(replaced_name)
					}
				})

				yy.extend($$.dynamodb.ExpressionAttributeNames,ExpressionAttributeNames_from_projection);

				if (ProjectionExpression.length)
					$$.dynamodb.ProjectionExpression = ProjectionExpression.join(' , ')

			}


		}
	;

def_scan_limit_clause
	:
		{ $$ = undefined; }
	| LIMIT signed_number
		{ $$ = {Limit: $2}; }
	;


def_scan_consistent_read
	:
		{ $$ = { ConsistentRead: false }; }
	| CONSISTENT_READ
		{ $$ = { ConsistentRead: true  }; }
	;



def_scan_columns
	: def_scan_columns COMMA def_scan_onecolumn
		{ $$ = $1; $$.push($3); }
	| def_scan_onecolumn
		{ $$ = [$1]; }
	;

def_scan_onecolumn
	: STAR
		{ $$ = {type: 'star', star:true}; }
	| name
		{ $$ = {type: 'column', column: $1}; }
	| name AS name
		{ $$ = {type: 'column', column: $1, alias: $3 }; }
	;




def_scan_use_index
	:
		{ $$ = undefined; }
	| USE INDEX dynamodb_index_name_or_keyword
		{ $$ = $3; }
	;

def_scan_having
	: HAVING def_scan_having_expr
		{ $$ = {having: $2}; }
	|
	;

def_scan_having_expr
	: literal_value
		{ $$ = $1; }
	| boolean_value
		{ $$ = $1; }

	| bind_parameter
		{ $$ = {bind_parameter: $1}; }

	| name
		{ $$ = {column: $1}; }

	| def_scan_having_expr AND def_scan_having_expr
		{ $$ = {op: 'AND', left: $1, right: $3}; }
	| def_scan_having_expr OR def_scan_having_expr
		{ $$ = {op: 'OR', left: $1, right: $3}; }

	| def_scan_having_expr EQ def_scan_having_expr
		{ $$ = {op: '=', left: $1, right: $3}; }
	| def_scan_having_expr GT def_scan_having_expr
		{ $$ = {op: '>', left: $1, right: $3}; }
	| def_scan_having_expr GE def_scan_having_expr
		{ $$ = {op: '>=', left: $1, right: $3}; }
	| def_scan_having_expr LT def_scan_having_expr
		{ $$ = {op: '<', left: $1, right: $3}; }
	| def_scan_having_expr LE def_scan_having_expr
		{ $$ = {op: '<=', left: $1, right: $3}; }


	| def_scan_having_expr BETWEEN where_between
		{ $$ = {op: 'BETWEEN', left: $1, right:$3 }; }
	| def_scan_having_expr LIKE string_literal
		{ $$ = {op: 'LIKE', left:$1, right: { type: 'string', string: $3 } }; }
	| def_scan_having_expr CONTAINS string_literal
		{ $$ = {op: 'CONTAINS', left:$1, right: { type: 'string', string: $3 } }; }
	| def_scan_having_expr CONTAINS signed_number
		{ $$ = {op: 'CONTAINS', left:$1, right: { type: 'number', number: $3 } }; }
	| def_scan_having_expr CONTAINS boolean_value
		{ $$ = {op: 'CONTAINS', left:$1, right: { type: 'boolean', value: $3 } }; }
	;


def_scan_into
	: INTO STREAM
		{
			$$ = { type: 'stream' };
		}
	|
	;
