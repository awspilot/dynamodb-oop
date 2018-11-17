
show_tables_stmt
	: SHOW TABLES
		{
			$$ = {
				statement: 'SHOW_TABLES',
				operation: 'listTables',
				dynamodb: {}
			}
		}
	;