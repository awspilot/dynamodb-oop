
drop_index_stmt
	: DROP INDEX dynamodb_index_name_or_keyword ON dynamodb_table_name_or_keyword
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
