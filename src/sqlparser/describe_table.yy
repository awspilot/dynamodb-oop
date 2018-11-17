
describe_table_stmt
	: DESCRIBE TABLE dynamodb_table_name
		{
			$$ = {
				statement: 'DESCRIBE_TABLE',
				operation: 'describeTable',
				dynamodb: {
					TableName: $3
				}
			};
		}
	;