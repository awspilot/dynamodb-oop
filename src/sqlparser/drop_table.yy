
drop_table_stmt
	: DROP TABLE dynamodb_table_name_or_keyword
		{
			$$ = {
				statement: 'DROP_TABLE',
				operation: 'deleteTable',
				dynamodb: {
					TableName: $3
				}
			};
		}
	;
