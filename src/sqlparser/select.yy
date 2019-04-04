
select_stmt
	: def_select select_sort_clause limit_clause def_consistent_read
		{
			$$ = {
				statement: 'SELECT',
				operation: 'query',
				dynamodb: $1.dynamodb,
			};
			yy.extend($$.dynamodb,$2);
			yy.extend($$.dynamodb,$3);
			yy.extend($$.dynamodb,$4);
		}
	;


limit_clause
	:
		{ $$ = undefined; }
	| LIMIT signed_number
		{ $$ = { Limit: $2 }; }
	;

select_sort_clause
	:
		{ $$ = { ScanIndexForward: true }; }
	| DESC
		{ $$ = { ScanIndexForward: false }; }
	;

def_consistent_read
	:
		{ $$ = { ConsistentRead: false }; }
	| CONSISTENT_READ
		{ $$ = { ConsistentRead: true }; }
	;



def_select_columns
	: def_select_columns COMMA def_select_onecolumn
		{ $$ = $1; $$.push($3); }
	| def_select_onecolumn
		{ $$ = [$1]; }
	;

def_select_onecolumn
	: STAR
		{ $$ = {type: 'star', star:true}; }
	| name
		{ $$ = {type: 'column', column: $1}; }
	| name AS name
		{ $$ = {type: 'column', column: $1, alias: $3 }; }
	;



def_select_from
	: FROM dynamodb_table_name_or_keyword
		{ $$ = $2; }
	;

def_select_use_index
	:
		{ $$ = undefined; }
	| USE INDEX dynamodb_index_name_or_keyword
		{ $$ = $3; }
	;



def_select_where
	: WHERE select_where_hash
		{
			$$ = {
				//KeyConditionExpression: $2,
				ExpressionAttributeNames: {},
				ExpressionAttributeValues: {},
			};

			$$.ExpressionAttributeNames[ '#partitionKeyName' ] = $2.partition.partitionKeyName
			$$.ExpressionAttributeValues[ ':partitionKeyValue' ] = $2.partition.partitionKeyValue
			$$.KeyConditionExpression = ' #partitionKeyName =  :partitionKeyValue '

		}
	| WHERE select_where_hash AND select_where_range
		{
			$$ = {
				//KeyConditionExpression: $2,
				ExpressionAttributeNames: {},
				ExpressionAttributeValues: {},
			};

			$$.ExpressionAttributeNames[ '#partitionKeyName' ] = $2.partition.partitionKeyName
			$$.ExpressionAttributeValues[ ':partitionKeyValue' ] = $2.partition.partitionKeyValue
			$$.KeyConditionExpression = ' #partitionKeyName =  :partitionKeyValue '


			if ($4.sort) {
				$$.ExpressionAttributeNames[ '#sortKeyName' ] = $4.sort.sortKeyName

				switch ($4.sort.op) {
					case '=':
					case '>':
					case '>=':
					case '<':
					case '<=':
						$$.ExpressionAttributeValues[ ':sortKeyValue' ] = $4.sort.sortKeyValue
						$$.KeyConditionExpression += ' AND #sortKeyName ' + $4.sort.op + ' :sortKeyValue '

						break;
					case 'BETWEEN':
						$$.ExpressionAttributeValues[ ':sortKeyValue1' ] = $4.sort.sortKeyValue1
						$$.ExpressionAttributeValues[ ':sortKeyValue2' ] = $4.sort.sortKeyValue2
						$$.KeyConditionExpression += ' AND #sortKeyName BETWEEN :sortKeyValue1 AND :sortKeyValue2'
						break;
					case 'BEGINS_WITH':

						if ($4.sort.sortKeyValue.S.slice(-1) !== '%' )
							throw "LIKE '%string' must end with a % for sort key "


						$4.sort.sortKeyValue.S = $4.sort.sortKeyValue.S.slice(0,-1)

						$$.ExpressionAttributeValues[ ':sortKeyValue' ] = $4.sort.sortKeyValue
						$$.KeyConditionExpression += ' AND begins_with ( #sortKeyName, :sortKeyValue ) '

						break;
				}

			}


		}
	;


def_having
	: HAVING having_expr
		{ $$ = {having: $2}; }
	|
	;


def_select
	: SELECT def_select_columns def_select_from def_select_use_index def_select_where def_having 
		{
			$$ = {
				dynamodb: {
					TableName: $3,
					IndexName: $4,
				},
				columns:$2
			};

			yy.extend($$.dynamodb,$5);
			yy.extend($$.dynamodb,$6);

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

where_expr
	: literal_value
		{ $$ = $1; }
	| bind_parameter
		{ $$ = {bind_parameter: $1}; }
	| name
		{ $$ = {column: $1}; }

	| where_expr AND where_expr
		{ $$ = {op: 'AND', left: $1, right: $3}; }
	| where_expr OR where_expr
		{ $$ = {op: 'OR', left: $1, right: $3}; }

	| where_expr EQ where_expr
		{ $$ = {op: '=', left: $1, right: $3}; }
	| where_expr GT where_expr
		{ $$ = {op: '>', left: $1, right: $3}; }
	| where_expr GE where_expr
		{ $$ = {op: '>=', left: $1, right: $3}; }
	| where_expr LT where_expr
		{ $$ = {op: '<', left: $1, right: $3}; }
	| where_expr LE where_expr
		{ $$ = {op: '<=', left: $1, right: $3}; }


	| where_expr BETWEEN where_between
		{ $$ = {op: 'BETWEEN', left: $1, right:$3 }; }
	| where_expr LIKE string_literal
		{ $$ = {op: 'LIKE', left:$1, right: { type: 'string', string: $3 } }; }
	;

select_where_hash
	: dynamodb_attribute_name_or_keyword EQ select_where_hash_value
		{
			$$ = {
				partition: {
					partitionKeyName: $1,
					partitionKeyValue: $3
				}
			}
		}
	;

select_where_hash_value
	: javascript_raw_expr
		{ $$ = $1 }
/*
	: dynamodb_raw_number
		{ $$ = $1 }
	| dynamodb_raw_string
		{ $$ = $1 }
	| javascript_raw_obj_date
		{ $$ = $1 }
	| javascript_raw_obj_math
		{ $$ = $1 }
*/
	;


select_where_range
	: dynamodb_attribute_name_or_keyword EQ select_where_range_value
		{
			$$ = {
				sort: {
					sortKeyName: $1,
					sortKeyValue: $3,
					op: '='
				}
			}
		}

	| dynamodb_attribute_name_or_keyword GT select_where_range_value
		{
			$$ = {
				sort: {
					sortKeyName: $1,
					sortKeyValue: $3,
					op: '>'
				}
			}
		}
	| dynamodb_attribute_name_or_keyword GE select_where_range_value
		{
			$$ = {
				sort: {
					sortKeyName: $1,
					sortKeyValue: $3,
					op: '>='
				}
			}
		}
	| dynamodb_attribute_name_or_keyword LT select_where_range_value
		{
			$$ = {
				sort: {
					sortKeyName: $1,
					sortKeyValue: $3,
					op: '<'
				}
			}
		}
	| dynamodb_attribute_name_or_keyword LE select_where_range_value
		{
			$$ = {
				sort: {
					sortKeyName: $1,
					sortKeyValue: $3,
					op: '<='
				}
			}
		}


	| dynamodb_attribute_name_or_keyword BETWEEN select_where_between
		{
			$$ = {
				sort: {
					sortKeyName: $1,
					sortKeyValue1: $3[0],
					sortKeyValue2: $3[1],
					op: 'BETWEEN'
				}
			}
		}
	| dynamodb_attribute_name_or_keyword LIKE dynamodb_raw_string
		{
			$$ = {
				sort: {
					sortKeyName: $1,
					sortKeyValue: $3,
					op: 'BEGINS_WITH'
				}
			}
		}
	;
select_where_range_value
	: javascript_raw_expr
		{ $$ = $1 }
	/* javascript_raw_expr replaces dynamodb_raw_string, dynamodb_raw_number, javascript_raw_obj_date, javascript_raw_obj_math */
	;

select_where_between
	: dynamodb_raw_number AND dynamodb_raw_number
		{ $$ = [ $1, $3 ]; }
	| dynamodb_raw_string AND dynamodb_raw_string
		{ $$ = [ $1, $3 ]; }
	;


where_between
	: signed_number AND signed_number
		{ $$ = {left: { type: 'number', number: $1}, right: {type: 'number', number: $3 } }; }
	| string_literal AND string_literal
		{ $$ = {left: { type: 'string', string: $1}, right: {type: 'string', string: $3 } }; }
	;






having_expr
	: literal_value
		{ $$ = $1; }
	| boolean_value
		{ $$ = $1; }

	| bind_parameter
		{ $$ = {bind_parameter: $1}; }

	| name
		{ $$ = {column: $1}; }

	| having_expr AND having_expr
		{ $$ = {op: 'AND', left: $1, right: $3}; }
	| having_expr OR having_expr
		{ $$ = {op: 'OR', left: $1, right: $3}; }

	| having_expr EQ having_expr
		{ $$ = {op: '=', left: $1, right: $3}; }
	| having_expr GT having_expr
		{ $$ = {op: '>', left: $1, right: $3}; }
	| having_expr GE having_expr
		{ $$ = {op: '>=', left: $1, right: $3}; }
	| having_expr LT having_expr
		{ $$ = {op: '<', left: $1, right: $3}; }
	| having_expr LE having_expr
		{ $$ = {op: '<=', left: $1, right: $3}; }


	| having_expr BETWEEN where_between
		{ $$ = {op: 'BETWEEN', left: $1, right:$3 }; }
	| having_expr LIKE string_literal
		{ $$ = {op: 'LIKE', left:$1, right: { type: 'string', string: $3 } }; }
	| having_expr CONTAINS string_literal
		{ $$ = {op: 'CONTAINS', left:$1, right: { type: 'string', string: $3 } }; }
	| having_expr CONTAINS signed_number
		{ $$ = {op: 'CONTAINS', left:$1, right: { type: 'number', number: $3 } }; }
	| having_expr CONTAINS boolean_value
		{ $$ = {op: 'CONTAINS', left:$1, right: { type: 'boolean', value: $3 } }; }
	;
