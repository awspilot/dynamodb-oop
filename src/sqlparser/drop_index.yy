
drop_index_stmt
	: DROP INDEX dynamodb_index_name ON dynamodb_table_name
		{
			$$ = {
				statement: 'DROP_INDEX',
				operation: 'updateTable',
				dynamodb: {
					TableName: $5,
					GlobalSecondaryIndexUpdates: [
						{
							Delete: {
								IndexName: $3
							}
						}
					]
				}
			};
		}
	;