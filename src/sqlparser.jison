%lex
%options case-insensitive
%%

/*
\[([^\]])*?\]									return 'BRALITERAL'
*/

([`](\\.|[^"]|\\\")*?[`])+                    	return 'BRALITERAL'
/*
X(['](\\.|[^']|\\\')*?['])+                     return 'XSTRING'
*/
(['](\\.|[^']|\\\')*?['])+                  	return 'SINGLE_QUOTED_STRING'
(["](\\.|[^"]|\\\")*?["])+                    	return 'DOUBLE_QUOTED_STRING'



"--"(.*?)($|\r\n|\r|\n)							/* skip -- comments */

\s+   											/* skip whitespace */

'ABORT'			return 'ABORT'
'ADD'			return 'ADD'
'AFTER'			return 'AFTER'

'ALTER'			return 'ALTER'
'ANALYZE'		return 'ANALYZE'
'AND'			return 'AND'
'AS'			return 'AS'
'ASC'			return 'ASC'
'ATTACH'		return 'ATTACH'
'BEFORE'		return 'BEFORE'
'BEGIN'			return 'BEGIN'
'BETWEEN'		return 'BETWEEN'
'BY'			return 'BY'
'CASCADE'		return 'CASCADE'
'CASE'			return 'CASE'
'CAST'			return 'CAST'
'CHECK'			return 'CHECK'
'COLLATE'		return 'COLLATE'
'COLUMN'		return 'COLUMN'
'CONFLICT'		return 'CONFLICT'
'CONSISTENT_READ' return 'CONSISTENT_READ'
'CONSTRAINT'	return 'CONSTRAINT'
'CREATE'		return 'CREATE'
'CROSS'			return 'CROSS'
'CURRENT_DATE'	return 'CURRENT DATE'
'CURRENT_TIME'	return 'CURRENT TIME'
'CURRENT_TIMESTAMP'		return 'CURRENT TIMESTAMP'
'DATABASE'		return 'DATABASE'
'DEFAULT'		return 'DEFAULT'
'DEFERRABLE'	return 'DEFERRABLE'
'DEFERRED'		return 'DEFERRED'
'DELETE'		return 'DELETE'
'DESC'			return 'DESC'
'DETACH'		return 'DETACH'
'DISTINCT'		return 'DISTINCT'
'DROP'			return 'DROP'
'DESCRIBE'		return 'DESCRIBE'
'EACH'			return 'EACH'
'ELSE'			return 'ELSE'
'END'			return 'END'
'ESCAPE'		return 'ESCAPE'
'EXCEPT'		return 'EXCEPT'
'EXCLUSIVE'		return 'EXCLUSIVE'
'EXISTS'		return 'EXISTS'
'EXPLAIN'		return 'EXPLAIN'
'FAIL'			return 'FAIL'
'FOR'			return 'FOR'
'FOREIGN'		return 'FOREIGN'
'FROM'			return 'FROM'
'FULL'			return 'FULL'
'GLOB'			return 'GLOB'
'GROUP'			return 'GROUP'
'HAVING'		return 'HAVING'
'IF'			return 'IF'
'IGNORE'		return 'IGNORE'
'IMMEDIATE'		return 'IMMEDIATE'
'IN'			return 'IN'
'USE'			return 'USE'
'INDEX'			return 'INDEX'
'INDEXED'		return 'INDEXED'
'INITIALLY'		return 'INITIALLY'
'INNER'			return 'INNER'
'INSERT'		return 'INSERT'
'INSTEAD'		return 'INSTEAD'
'INTERSECT'		return 'INTERSECT'
'INTO'			return 'INTO'
'IS'			return 'IS'
'ISNULL'		return 'ISNULL'
'JOIN'			return 'JOIN'
'KEY'			return 'KEY'
'LEFT'			return 'LEFT'
'LIKE'			return 'LIKE'
'CONTAINS'		return 'CONTAINS'
'LIMIT'			return 'LIMIT'
'MATCH'			return 'MATCH'
'NATURAL'		return 'NATURAL'
'NO'			return 'NO'
'NOT'			return 'NOT'
'NOTNULL'		return 'NOTNULL'
'NULL'			return 'NULL'
'UNDEFINED'		return 'UNDEFINED'
'OF'			return 'OF'
'OFFSET'		return 'OFFSET'
'ON'			return 'ON'
'OR'			return 'OR'
'ORDER'			return 'ORDER'
'OUTER'			return 'OUTER'
'PLAN'			return 'PLAN'
'PRAGMA'		return 'PRAGMA'
'PRIMARY'		return 'PRIMARY'
'QUERY'			return 'QUERY'
'RAISE'			return 'RAISE'
'RECURSIVE'		return 'RECURSIVE'
'REFERENCES'	return 'REFERENCES'
'REGEXP'		return 'REGEXP'
'REINDEX'		return 'REINDEX'
'RELEASE'		return 'RELEASE'
'RENAME'		return 'RENAME'
'REPLACE'		return 'REPLACE'
'RESTRICT'		return 'RESTRICT'
'RIGHT'			return 'RIGHT'
'ROLLBACK'		return 'ROLLBACK'
'ROW'			return 'ROW'
'SELECT'		return 'SELECT'
'SCAN'			return 'SCAN'
'SET'			return 'SET'
'TABLE'			return 'TABLE'
'TEMP'			return 'TEMP'
'THEN'			return 'THEN'
'TO'			return 'TO'
'TRIGGER'		return 'TRIGGER'
'UNION'			return 'UNION'
'UNIQUE'		return 'UNIQUE'
'UPDATE'		return 'UPDATE'
'USING'			return 'USING'
'VACUUM'		return 'VACUUM'
'VALUES'		return 'VALUES'
'VIEW'			return 'VIEW'
'WHEN'			return 'WHEN'
'WHERE'			return 'WHERE'
'WITH'			return 'WITH'
'TRUE'			return 'TRUE'
'FALSE'			return 'FALSE'
'SHOW'			return 'SHOW'
'TABLES'		return 'TABLES'

'STRING'		return 'STRING'
'NUMBER'		return 'NUMBER'
'STRINGSET'		return 'STRINGSET'
'NUMBERSET'		return 'NUMBERSET'
'BINARYSET'		return 'BINARYSET'
'THROUGHPUT'	return 'THROUGHPUT'
'GSI'			return 'GSI'
'LSI'			return 'LSI'
'PROJECTION'	return 'PROJECTION'
'ALL'			return 'ALL'
'KEYS_ONLY'		return 'KEYS_ONLY'
'INCLUDE'		return 'INCLUDE'
'NEW'			return 'NEW'
'PROVISIONED'	return 'PROVISIONED'
'PAY_PER_REQUEST'	return 'PAY_PER_REQUEST'
'BUFFER'		return 'BUFFER'
'DEBUG'			return 'DEBUG'

/* dynamodb reserved keywords taken from https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html */
'ALLOCATE'		return 'ALLOCATE'
'ALTER'			return 'ALTER'
'ANALYZE'		return 'ANALYZE'
'AND'			return 'AND'
'ANY'			return 'ANY'
'ARCHIVE'		return 'ARCHIVE'
'ARE'			return 'ARE'
'ARRAY'			return 'ARRAY'
'AS'			return 'AS'
'ASC'			return 'ASC'
'ASCII'			return 'ASCII'
'ASENSITIVE'		return 'ASENSITIVE'
'ASSERTION'			return 'ASSERTION'
'ASYMMETRIC'		return 'ASYMMETRIC'
'AT'			return 'AT'
'ATOMIC'		return 'ATOMIC'
'ATTACH'		return 'ATTACH'
'ATTRIBUTE'		return 'ATTRIBUTE'
'AUTH'			return 'AUTH'
'AUTHORIZATION'		return 'AUTHORIZATION'
'AUTHORIZE'		return 'AUTHORIZE'
'AUTO'			return 'AUTO'
'AVG'			return 'AVG'
'BACK'			return 'BACK'
'BACKUP'		return 'BACKUP'
'BASE'			return 'BASE'
'BATCH'			return 'BATCH'
'BEFORE'		return 'BEFORE'
'BEGIN'			return 'BEGIN'
'BETWEEN'		return 'BETWEEN'
'BIGINT'		return 'BIGINT'
'BINARY'		return 'BINARY'
'BIT'			return 'BIT'
'BLOB'			return 'BLOB'
'BLOCK'			return 'BLOCK'
'BOOLEAN'		return 'BOOLEAN'
'BOTH'			return 'BOTH'
'BREADTH'		return 'BREADTH'
'BUCKET'		return 'BUCKET'
'BULK'		return 'BULK'
'BY'		return 'BY'
'BYTE'		return 'BYTE'
'CALL'		return 'CALL'
'CALLED'		return 'CALLED'
'CALLING'		return 'CALLING'
'CAPACITY'		return 'CAPACITY'
'CASCADE'		return 'CASCADE'
'CASCADED'		return 'CASCADED'
'CASE'		return 'CASE'
'CAST'		return 'CAST'
'CATALOG'		return 'CATALOG'
'CHAR'		return 'CHAR'
'CHARACTER'		return 'CHARACTER'
'CHECK'		return 'CHECK'
'CLASS'		return 'CLASS'
'CLOB'		return 'CLOB'
'CLOSE'		return 'CLOSE'
'CLUSTER'		return 'CLUSTER'
'CLUSTERED'		return 'CLUSTERED'
'CLUSTERING'		return 'CLUSTERING'
'CLUSTERS'		return 'CLUSTERS'
'COALESCE'		return 'COALESCE'
'COLLATE'		return 'COLLATE'
'COLLATION'		return 'COLLATION'
'COLLECTION'		return 'COLLECTION'
'COLUMN'		return 'COLUMN'
'COLUMNS'		return 'COLUMNS'
'COMBINE'		return 'COMBINE'
'COMMENT'		return 'COMMENT'
'COMMIT'		return 'COMMIT'
'COMPACT'		return 'COMPACT'
'COMPILE'		return 'COMPILE'
'COMPRESS'		return 'COMPRESS'
'CONDITION'		return 'CONDITION'
'CONFLICT'		return 'CONFLICT'
'CONNECT'		return 'CONNECT'
'CONNECTION'		return 'CONNECTION'
'CONSISTENCY'		return 'CONSISTENCY'
'CONSISTENT'		return 'CONSISTENT'
'CONSTRAINT'		return 'CONSTRAINT'
'CONSTRAINTS'		return 'CONSTRAINTS'
'CONSTRUCTOR'		return 'CONSTRUCTOR'
'CONSUMED'		return 'CONSUMED'
'CONTINUE'		return 'CONTINUE'
'CONVERT'		return 'CONVERT'
'COPY'		return 'COPY'
'CORRESPONDING'		return 'CORRESPONDING'
'COUNT'		return 'COUNT'
'COUNTER'		return 'COUNTER'
'CREATE'		return 'CREATE'
'CROSS'		return 'CROSS'
'CUBE'		return 'CUBE'
'CURRENT'		return 'CURRENT'
'CURSOR'		return 'CURSOR'
'CYCLE'		return 'CYCLE'
'DATA'		return 'DATA'
'DATABASE'		return 'DATABASE'
'DATE'		return 'DATE'
'DATETIME'		return 'DATETIME'
'DAY'		return 'DAY'
'DEALLOCATE'		return 'DEALLOCATE'
'DEC'		return 'DEC'
'DECIMAL'		return 'DECIMAL'
'DECLARE'		return 'DECLARE'
'DEFAULT'		return 'DEFAULT'
'DEFERRABLE'		return 'DEFERRABLE'
'DEFERRED'		return 'DEFERRED'
'DEFINE'		return 'DEFINE'
'DEFINED'		return 'DEFINED'
'DEFINITION'		return 'DEFINITION'
'DELETE'		return 'DELETE'
'DELIMITED'		return 'DELIMITED'
'DEPTH'		return 'DEPTH'
'DEREF'		return 'DEREF'
'DESC'		return 'DESC'
'DESCRIBE'		return 'DESCRIBE'
'DESCRIPTOR'		return 'DESCRIPTOR'
'DETACH'		return 'DETACH'
'DETERMINISTIC'		return 'DETERMINISTIC'
'DIAGNOSTICS'		return 'DIAGNOSTICS'
'DIRECTORIES'		return 'DIRECTORIES'
'DISABLE'		return 'DISABLE'
'DISCONNECT'		return 'DISCONNECT'
'DISTINCT'		return 'DISTINCT'
'DISTRIBUTE'		return 'DISTRIBUTE'
'DO'		return 'DO'
'DOMAIN'		return 'DOMAIN'
'DOUBLE'		return 'DOUBLE'
'DROP'		return 'DROP'
'DUMP'		return 'DUMP'
'DURATION'		return 'DURATION'
'DYNAMIC'		return 'DYNAMIC'
'EACH'		return 'EACH'
'ELEMENT'		return 'ELEMENT'
'ELSE'		return 'ELSE'
'ELSEIF'		return 'ELSEIF'
'EMPTY'		return 'EMPTY'
'ENABLE'		return 'ENABLE'
'END'		return 'END'
'EQUAL'		return 'EQUAL'
'EQUALS'		return 'EQUALS'
'ERROR'		return 'ERROR'
'ESCAPE'		return 'ESCAPE'
'ESCAPED'		return 'ESCAPED'
'EVAL'		return 'EVAL'
'EVALUATE'		return 'EVALUATE'
'EXCEEDED'		return 'EXCEEDED'
'EXCEPT'		return 'EXCEPT'
'EXCEPTION'		return 'EXCEPTION'
'EXCEPTIONS'		return 'EXCEPTIONS'
'EXCLUSIVE'		return 'EXCLUSIVE'
'EXEC'		return 'EXEC'
'EXECUTE'		return 'EXECUTE'
'EXISTS'		return 'EXISTS'
'EXIT'		return 'EXIT'
'EXPLAIN'		return 'EXPLAIN'
'EXPLODE'		return 'EXPLODE'
'EXPORT'		return 'EXPORT'
'EXPRESSION'		return 'EXPRESSION'
'EXTENDED'		return 'EXTENDED'
'EXTERNAL'		return 'EXTERNAL'
'EXTRACT'		return 'EXTRACT'
'FAIL'		return 'FAIL'
'FALSE'		return 'FALSE'
'FAMILY'		return 'FAMILY'
'FETCH'		return 'FETCH'
'FIELDS'		return 'FIELDS'
'FILE'		return 'FILE'
'FILTER'		return 'FILTER'
'FILTERING'		return 'FILTERING'
'FINAL'		return 'FINAL'
'FINISH'		return 'FINISH'
'FIRST'		return 'FIRST'
'FIXED'		return 'FIXED'
'FLATTERN'		return 'FLATTERN'
'FLOAT'		return 'FLOAT'
'FOR'		return 'FOR'
'FORCE'		return 'FORCE'
'FOREIGN'		return 'FOREIGN'
'FORMAT'		return 'FORMAT'
'FORWARD'		return 'FORWARD'
'FOUND'		return 'FOUND'
'FREE'		return 'FREE'
'FROM'		return 'FROM'
'FULL'		return 'FULL'
'FUNCTION'		return 'FUNCTION'
'FUNCTIONS'		return 'FUNCTIONS'
'GENERAL'		return 'GENERAL'
'GENERATE'		return 'GENERATE'
'GET'		return 'GET'
'GLOB'		return 'GLOB'
'GLOBAL'		return 'GLOBAL'
'GO'		return 'GO'
'GOTO'		return 'GOTO'
'GRANT'		return 'GRANT'
'GREATER'		return 'GREATER'
'GROUP'		return 'GROUP'
'GROUPING'		return 'GROUPING'
'HANDLER'		return 'HANDLER'
'HASH'			return 'HASH'
'HAVE'		return 'HAVE'
'HAVING'		return 'HAVING'
'HEAP'		return 'HEAP'
'HIDDEN'		return 'HIDDEN'
'HOLD'		return 'HOLD'
'HOUR'		return 'HOUR'
'IDENTIFIED'		return 'IDENTIFIED'
'IDENTITY'		return 'IDENTITY'
'IF'		return 'IF'
'IGNORE'		return 'IGNORE'
'IMMEDIATE'		return 'IMMEDIATE'
'IMPORT'		return 'IMPORT'
'IN'		return 'IN'
'INCLUDING'		return 'INCLUDING'
'INCLUSIVE'		return 'INCLUSIVE'
'INCREMENT'		return 'INCREMENT'
'INCREMENTAL'		return 'INCREMENTAL'
'INDEX'		return 'INDEX'
'INDEXED'		return 'INDEXED'
'INDEXES'		return 'INDEXES'
'INDICATOR'		return 'INDICATOR'
'INFINITE'		return 'INFINITE'
'INITIALLY'		return 'INITIALLY'
'INLINE'		return 'INLINE'
'INNER'		return 'INNER'
'INNTER'		return 'INNTER'
'INOUT'		return 'INOUT'
'INPUT'		return 'INPUT'
'INSENSITIVE'		return 'INSENSITIVE'
'INSERT'		return 'INSERT'
'INSTEAD'		return 'INSTEAD'
'INT'		return 'INT'
'INTEGER'		return 'INTEGER'
'INTERSECT'		return 'INTERSECT'
'INTERVAL'		return 'INTERVAL'
'INTO'		return 'INTO'
'INVALIDATE'		return 'INVALIDATE'
'IS'		return 'IS'
'ISOLATION'		return 'ISOLATION'
'ITEM'		return 'ITEM'
'ITEMS'		return 'ITEMS'
'ITERATE'		return 'ITERATE'
'JOIN'		return 'JOIN'
'KEY'		return 'KEY'
'KEYS'		return 'KEYS'
'LAG'		return 'LAG'
'LANGUAGE'		return 'LANGUAGE'
'LARGE'		return 'LARGE'
'LAST'		return 'LAST'
'LATERAL'		return 'LATERAL'
'LEAD'		return 'LEAD'
'LEADING'		return 'LEADING'
'LEAVE'		return 'LEAVE'
'LEFT'		return 'LEFT'
'LENGTH'		return 'LENGTH'
'LESS'		return 'LESS'
'LEVEL'		return 'LEVEL'
'LIKE'		return 'LIKE'
'LIMIT'		return 'LIMIT'
'LIMITED'		return 'LIMITED'
'LINES'		return 'LINES'
'LIST'		return 'LIST'
'LOAD'		return 'LOAD'
'LOCAL'		return 'LOCAL'
'LOCALTIME'		return 'LOCALTIME'
'LOCALTIMESTAMP'		return 'LOCALTIMESTAMP'
'LOCATION'		return 'LOCATION'
'LOCATOR'		return 'LOCATOR'
'LOCK'		return 'LOCK'
'LOCKS'		return 'LOCKS'
'LOG'		return 'LOG'
'LOGED'		return 'LOGED'
'LONG'		return 'LONG'
'LOOP'		return 'LOOP'
'LOWER'		return 'LOWER'
'MAP'		return 'MAP'
'MATCH'		return 'MATCH'
'MATERIALIZED'		return 'MATERIALIZED'
'MAX'		return 'MAX'
'MAXLEN'		return 'MAXLEN'
'MEMBER'		return 'MEMBER'
'MERGE'		return 'MERGE'
'METHOD'		return 'METHOD'
'METRICS'		return 'METRICS'
'MIN'		return 'MIN'
'MINUS'		return 'MINUS'
'MINUTE'		return 'MINUTE'
'MISSING'		return 'MISSING'
'MOD'		return 'MOD'
'MODE'		return 'MODE'
'MODIFIES'		return 'MODIFIES'
'MODIFY'		return 'MODIFY'
'MODULE'		return 'MODULE'
'MONTH'		return 'MONTH'
'MULTI'		return 'MULTI'
'MULTISET'		return 'MULTISET'
'NAME'		return 'NAME'
'NAMES'		return 'NAMES'
'NATIONAL'		return 'NATIONAL'
'NATURAL'		return 'NATURAL'
'NCHAR'		return 'NCHAR'
'NCLOB'		return 'NCLOB'
'NEW'		return 'NEW'
'NEXT'		return 'NEXT'
'NO'		return 'NO'
'NONE'		return 'NONE'
'NOT'		return 'NOT'
'NULL'		return 'NULL'
'NULLIF'		return 'NULLIF'
'NUMBER'		return 'NUMBER'
'NUMERIC'		return 'NUMERIC'
'OBJECT'		return 'OBJECT'
'OF'		return 'OF'
'OFFLINE'		return 'OFFLINE'
'OFFSET'		return 'OFFSET'
'OLD'		return 'OLD'
'ON'		return 'ON'
'ONLINE'		return 'ONLINE'
'ONLY'		return 'ONLY'
'OPAQUE'		return 'OPAQUE'
'OPEN'		return 'OPEN'
'OPERATOR'		return 'OPERATOR'
'OPTION'		return 'OPTION'
'OR'		return 'OR'
'ORDER'		return 'ORDER'
'ORDINALITY'		return 'ORDINALITY'
'OTHER'		return 'OTHER'
'OTHERS'		return 'OTHERS'
'OUT'		return 'OUT'
'OUTER'		return 'OUTER'
'OUTPUT'		return 'OUTPUT'
'OVER'		return 'OVER'
'OVERLAPS'		return 'OVERLAPS'
'OVERRIDE'		return 'OVERRIDE'
'OWNER'		return 'OWNER'
'PAD'		return 'PAD'
'PARALLEL'		return 'PARALLEL'
'PARAMETER'		return 'PARAMETER'
'PARAMETERS'		return 'PARAMETERS'
'PARTIAL'		return 'PARTIAL'
'PARTITION'		return 'PARTITION'
'PARTITIONED'		return 'PARTITIONED'
'PARTITIONS'		return 'PARTITIONS'
'PATH'		return 'PATH'
'PERCENT'		return 'PERCENT'
'PERCENTILE'		return 'PERCENTILE'
'PERMISSION'		return 'PERMISSION'
'PERMISSIONS'		return 'PERMISSIONS'
'PIPE'		return 'PIPE'
'PIPELINED'		return 'PIPELINED'
'PLAN'		return 'PLAN'
'POOL'		return 'POOL'
'POSITION'		return 'POSITION'
'PRECISION'		return 'PRECISION'
'PREPARE'		return 'PREPARE'
'PRESERVE'		return 'PRESERVE'
'PRIMARY'		return 'PRIMARY'
'PRIOR'		return 'PRIOR'
'PRIVATE'		return 'PRIVATE'
'PRIVILEGES'		return 'PRIVILEGES'
'PROCEDURE'		return 'PROCEDURE'
'PROCESSED'		return 'PROCESSED'
'PROJECT'		return 'PROJECT'
'PROJECTION'		return 'PROJECTION'
'PROPERTY'		return 'PROPERTY'
'PROVISIONING'		return 'PROVISIONING'
'PUBLIC'		return 'PUBLIC'
'PUT'		return 'PUT'
'QUERY'		return 'QUERY'
'QUIT'		return 'QUIT'
'QUORUM'		return 'QUORUM'
'RAISE'		return 'RAISE'
'RANDOM'		return 'RANDOM'
'RANGE'		return 'RANGE'
'RANK'		return 'RANK'
'RAW'		return 'RAW'
'READ'		return 'READ'
'READS'		return 'READS'
'REAL'		return 'REAL'
'REBUILD'		return 'REBUILD'
'RECORD'		return 'RECORD'
'RECURSIVE'		return 'RECURSIVE'
'REDUCE'		return 'REDUCE'
'REF'		return 'REF'
'REFERENCE'		return 'REFERENCE'
'REFERENCES'		return 'REFERENCES'
'REFERENCING'		return 'REFERENCING'
'REGEXP'		return 'REGEXP'
'REGION'		return 'REGION'
'REINDEX'		return 'REINDEX'
'RELATIVE'		return 'RELATIVE'
'RELEASE'		return 'RELEASE'
'REMAINDER'		return 'REMAINDER'
'RENAME'		return 'RENAME'
'REPEAT'		return 'REPEAT'
'REPLACE'		return 'REPLACE'
'REQUEST'		return 'REQUEST'
'RESET'		return 'RESET'
'RESIGNAL'		return 'RESIGNAL'
'RESOURCE'		return 'RESOURCE'
'RESPONSE'		return 'RESPONSE'
'RESTORE'		return 'RESTORE'
'RESTRICT'		return 'RESTRICT'
'RESULT'		return 'RESULT'
'RETURN'		return 'RETURN'
'RETURNING'		return 'RETURNING'
'RETURNS'		return 'RETURNS'
'REVERSE'		return 'REVERSE'
'REVOKE'		return 'REVOKE'
'RIGHT'		return 'RIGHT'
'ROLE'		return 'ROLE'
'ROLES'		return 'ROLES'
'ROLLBACK'		return 'ROLLBACK'
'ROLLUP'		return 'ROLLUP'
'ROUTINE'		return 'ROUTINE'
'ROW'		return 'ROW'
'ROWS'		return 'ROWS'
'RULE'		return 'RULE'
'RULES'		return 'RULES'
'SAMPLE'		return 'SAMPLE'
'SATISFIES'		return 'SATISFIES'
'SAVE'		return 'SAVE'
'SAVEPOINT'		return 'SAVEPOINT'
'SCAN'		return 'SCAN'
'SCHEMA'		return 'SCHEMA'
'SCOPE'		return 'SCOPE'
'SCROLL'		return 'SCROLL'
'SEARCH'		return 'SEARCH'
'SECOND'		return 'SECOND'
'SECTION'		return 'SECTION'
'SEGMENT'		return 'SEGMENT'
'SEGMENTS'		return 'SEGMENTS'
'SELECT'		return 'SELECT'
'SELF'		return 'SELF'
'SEMI'		return 'SEMI'
'SENSITIVE'		return 'SENSITIVE'
'SEPARATE'		return 'SEPARATE'
'SEQUENCE'		return 'SEQUENCE'
'SERIALIZABLE'		return 'SERIALIZABLE'
'SESSION'		return 'SESSION'
'SET'		return 'SET'
'SETS'		return 'SETS'
'SHARD'		return 'SHARD'
'SHARE'		return 'SHARE'
'SHARED'		return 'SHARED'
'SHORT'		return 'SHORT'
'SHOW'		return 'SHOW'
'SIGNAL'		return 'SIGNAL'
'SIMILAR'		return 'SIMILAR'
'SIZE'		return 'SIZE'
'SKEWED'		return 'SKEWED'
'SMALLINT'		return 'SMALLINT'
'SNAPSHOT'		return 'SNAPSHOT'
'SOME'		return 'SOME'
'SOURCE'		return 'SOURCE'
'SPACE'		return 'SPACE'
'SPACES'		return 'SPACES'
'SPARSE'		return 'SPARSE'
'SPECIFIC'		return 'SPECIFIC'
'SPECIFICTYPE'		return 'SPECIFICTYPE'
'SPLIT'		return 'SPLIT'
'SQL'		return 'SQL'
'SQLCODE'		return 'SQLCODE'
'SQLERROR'		return 'SQLERROR'
'SQLEXCEPTION'		return 'SQLEXCEPTION'
'SQLSTATE'		return 'SQLSTATE'
'SQLWARNING'		return 'SQLWARNING'
'START'		return 'START'
'STATE'		return 'STATE'
'STATIC'		return 'STATIC'
'STATUS'		return 'STATUS'
'STORAGE'		return 'STORAGE'
'STORE'		return 'STORE'
'STORED'		return 'STORED'
'STREAM'		return 'STREAM'
'STRING'		return 'STRING'
'STRUCT'		return 'STRUCT'
'STYLE'		return 'STYLE'
'SUB'		return 'SUB'
'SUBMULTISET'		return 'SUBMULTISET'
'SUBPARTITION'		return 'SUBPARTITION'
'SUBSTRING'		return 'SUBSTRING'
'SUBTYPE'		return 'SUBTYPE'
'SUM'		return 'SUM'
'SUPER'		return 'SUPER'
'SYMMETRIC'		return 'SYMMETRIC'
'SYNONYM'		return 'SYNONYM'
'SYSTEM'		return 'SYSTEM'
'TABLE'		return 'TABLE'
'TABLESAMPLE'		return 'TABLESAMPLE'
'TEMP'		return 'TEMP'
'TEMPORARY'		return 'TEMPORARY'
'TERMINATED'		return 'TERMINATED'
'TEXT'		return 'TEXT'
'THAN'		return 'THAN'
'THEN'		return 'THEN'
'THROUGHPUT'		return 'THROUGHPUT'
'TIME'		return 'TIME'
'TIMESTAMP'		return 'TIMESTAMP'
'TIMEZONE'		return 'TIMEZONE'
'TINYINT'		return 'TINYINT'
'TO'		return 'TO'
'TOKEN'		return 'TOKEN'
'TOTAL'		return 'TOTAL'
'TOUCH'		return 'TOUCH'
'TRAILING'		return 'TRAILING'
'TRANSACTION'		return 'TRANSACTION'
'TRANSFORM'		return 'TRANSFORM'
'TRANSLATE'		return 'TRANSLATE'
'TRANSLATION'		return 'TRANSLATION'
'TREAT'		return 'TREAT'
'TRIGGER'		return 'TRIGGER'
'TRIM'		return 'TRIM'
'TRUE'		return 'TRUE'
'TRUNCATE'		return 'TRUNCATE'
'TTL'		return 'TTL'
'TUPLE'		return 'TUPLE'
'TYPE'		return 'TYPE'
'UNDER'		return 'UNDER'
'UNDO'		return 'UNDO'
'UNION'		return 'UNION'
'UNIQUE'		return 'UNIQUE'
'UNIT'		return 'UNIT'
'UNKNOWN'		return 'UNKNOWN'
'UNLOGGED'		return 'UNLOGGED'
'UNNEST'		return 'UNNEST'
'UNPROCESSED'		return 'UNPROCESSED'
'UNSIGNED'		return 'UNSIGNED'
'UNTIL'		return 'UNTIL'
'UPDATE'		return 'UPDATE'
'UPPER'		return 'UPPER'
'URL'		return 'URL'
'USAGE'		return 'USAGE'
'USE'		return 'USE'
'USER'		return 'USER'
'USERS'		return 'USERS'
'USING'		return 'USING'
'UUID'		return 'UUID'
'VACUUM'		return 'VACUUM'
'VALUE'		return 'VALUE'
'VALUED'		return 'VALUED'
'VALUES'		return 'VALUES'
'VARCHAR'		return 'VARCHAR'
'VARIABLE'		return 'VARIABLE'
'VARIANCE'		return 'VARIANCE'
'VARINT'		return 'VARINT'
'VARYING'		return 'VARYING'
'VIEW'		return 'VIEW'
'VIEWS'		return 'VIEWS'
'VIRTUAL'		return 'VIRTUAL'
'VOID'		return 'VOID'
'WAIT'		return 'WAIT'
'WHEN'		return 'WHEN'
'WHENEVER'		return 'WHENEVER'
'WHERE'		return 'WHERE'
'WHILE'		return 'WHILE'
'WINDOW'		return 'WINDOW'
'WITH'		return 'WITH'
'WITHIN'		return 'WITHIN'
'WITHOUT'		return 'WITHOUT'
'WORK'		return 'WORK'
'WRAPPED'		return 'WRAPPED'
'WRITE'		return 'WRITE'
'YEAR'		return 'YEAR'
'ZONE'		return 'ZONE'

/* Javascript Objects and Functions */
'JSON'		return 'JSON'
'MATH'		return 'MATH'
'UUID'		return 'UUID'


[-]?(\d*[.])?\d+[eE]\d+							return 'NUMBER'
[-]?(\d*[.])?\d+								return 'NUMBER'

'~'												return 'TILDEs'
'+='											return 'PLUSEQ'
'+'												return 'PLUS'
'-' 											return 'MINUS'
'*'												return 'STAR'
'/'												return 'SLASH'
'%'												return 'REM'
'>>'											return 'RSHIFT'
'<<'											return 'LSHIFT'
'<>'											return 'NE'
'!='											return 'NE'
'>='											return 'GE'
'>'												return 'GT'
'<='											return 'LE'
'<'												return 'LT'
'='												return 'EQ'
'&'												return 'BITAND'
'|'												return 'BITOR'

'('												return 'LPAR'
')'												return 'RPAR'

'{'												return 'JSONLPAR'
'}'												return 'JSONRPAR'

'['												return 'ARRAYLPAR'
']'												return 'ARRAYRPAR'

'.'												return 'DOT'
','												return 'COMMA'
':'												return 'COLON'
';'												return 'SEMICOLON'
'$'												return 'DOLLAR'
'?'												return 'QUESTION'
'^'												return 'CARET'

[a-zA-Z_][a-zA-Z_0-9]*                       	return 'LITERAL'

<<EOF>>               							return 'EOF'
.												return 'INVALID'

/lex

/* %left unary_operator binary_operator  */

%left OR
%left AND
%left BETWEEN
%right NOT
%left IS MATCH LIKE CONTAINS IN ISNULL NOTNULL NE EQ
%left ESCAPE
%left GT LE LT GE
%left BITAND BITOR LSHIFT RSHIFT
$left PLUS MINUS
%left STAR SLASH REM
%left CONCAT
%left COLLATE
%right BITNOT


%start main

%%
main
	: sql_stmt_list EOF
		{
			$$ = $1;
			return $$;
		}
	;

sql_stmt_list
	: sql_stmt_list SEMICOLON sql_stmt
		{ $$ = $1; if($3) $$.push($3); }
	| sql_stmt
		{ $$ = [$1]; }
	;
/*
sql_stmt
	: alter_table_stmt
	| create_index_stmt



	;
*/
sql_stmt
	: select_stmt
	| insert_stmt
	| update_stmt
	| replace_stmt
	| delete_stmt
	| create_table_stmt
	| show_tables_stmt
	| drop_table_stmt
	| describe_table_stmt
	| drop_index_stmt
	| scan_stmt
	| debug_stmt
	;

name
	: LITERAL
		{ $$ = $1; }
	| BRALITERAL
		{ $$ = $1.substr(1,$1.length-2); }
	;
name_or_keyword
	: LITERAL
		{ $$ = $1; }
	| BRALITERAL
		{ $$ = $1.substr(1,$1.length-2); }
	| KEYWORD
		{ $$ = $1 }
	;

database_table_name
	: name DOT name
		{ $$ = {database:$1, table:$3}; }
	| name
		{ $$ = {table:$1}; }
	;

dynamodb_table_name
	: name
		{ $$ = $1; }
	;
dynamodb_table_name_or_keyword
	: name_or_keyword
		{ $$ = $1; }
	;
dynamodb_index_name_or_keyword
	: name_or_keyword
		{ $$ = $1; }
	;
dynamodb_attribute_name_or_keyword
	: name_or_keyword
		{ $$ = $1; }
	;



database_index_name
	: name
		{ $$ = {index:$1}; }
	;

dynamodb_index_name
	: name
		{ $$ = $1; }
	;


signed_number
	: NUMBER
		{ $$ = $1; }
	;

string_literal
	: SINGLE_QUOTED_STRING
		{ $$ = $1; }
	| DOUBLE_QUOTED_STRING
		{ $$ = $1; }
	| XSTRING
		{ $$ = $1; }
	;

literal_value
	: signed_number
		{ $$ = {type:'number', number:$1}; }
	| string_literal
		{ $$ = {type:'string', string: $1}}
	;

boolean
	: TRUE
		{ $$ = true; }
	| FALSE
		{ $$ = false; }
	;

boolean_value
	: TRUE
		{ $$ = {type:'boolean', value: true }; }
	| FALSE
		{ $$ = {type:'boolean', value: false }; }
	;
/* sql keywords not part of Amazon DynamoDB keywords */

SQLKEYWORD
	: JSON
		{ $$ = yytext; }
	| MATH
		{ $$ = yytext; }
	| ABORT
		{ $$ = yytext; }
	| ADD
		{ $$ = yytext; }
	| AFTER
		{ $$ = yytext; }
	| CONSISTENT_READ
		{ $$ = yytext; }
	| CURRENT_DATE
		{ $$ = yytext; }
	| CURRENT_TIME
		{ $$ = yytext; }
	| CURRENT_TIMESTAMP
		{ $$ = yytext; }
	| ISNULL
		{ $$ = yytext; }
	| CONTAINS
		{ $$ = yytext; }
	| NOTNULL
		{ $$ = yytext; }
	| UNDEFINED
		{ $$ = yytext; }
	| PRAGMA
		{ $$ = yytext; }
	| TABLES
		{ $$ = yytext; }
	| STRINGSET
		{ $$ = yytext; }
	| NUMBERSET
		{ $$ = yytext; }
	| BINARYSET
		{ $$ = yytext; }
	| GSI
		{ $$ = yytext; }
	| LSI
		{ $$ = yytext; }
	| ALL
		{ $$ = yytext; }
	| KEYS_ONLY
		{ $$ = yytext; }
	| INCLUDE
		{ $$ = yytext; }
	| PROVISIONED
		{ $$ = yytext; }
	| PAY_PER_REQUEST
		{ $$ = yytext; }
	| BUFFER
		{ $$ = yytext; }
	| DEBUG
		{ $$ = yytext; }
	;



/* dynamodb reserved keywords taken from https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html */


DYNAMODBKEYWORD
	: ALLOCATE
		{ $$ = yytext; }
	| ALTER
		{ $$ = yytext; }
	| ANALYZE
		{ $$ = yytext; }
	| AND
		{ $$ = yytext; }
	| ANY
		{ $$ = yytext; }
	| ARE
		{ $$ = yytext; }
	| ARRAY
		{ $$ = yytext; }
	| AS
		{ $$ = yytext; }
	| ASC
		{ $$ = yytext; }
	| ASCII
		{ $$ = yytext; }
	| ASENSITIVE
		{ $$ = yytext; }
	| ASSERTION
		{ $$ = yytext; }
	| ASYMMETRIC
		{ $$ = yytext; }
	| AT
		{ $$ = yytext; }
	| ATOMIC
		{ $$ = yytext; }
	| ATTACH
		{ $$ = yytext; }
	| ATTRIBUTE
		{ $$ = yytext; }
	| AUTH
		{ $$ = yytext; }
	| AUTHORIZATION
		{ $$ = yytext; }
	| AUTHORIZE
		{ $$ = yytext; }
	| AUTO
		{ $$ = yytext; }
	| AVG
		{ $$ = yytext; }
	| BACK
		{ $$ = yytext; }
	| BACKUP
		{ $$ = yytext; }
	| BASE
		{ $$ = yytext; }
	| BATCH
		{ $$ = yytext; }
	| BEFORE
		{ $$ = yytext; }
	| BEGIN
		{ $$ = yytext; }
	| BETWEEN
		{ $$ = yytext; }
	| BIGINT
		{ $$ = yytext; }
	| BINARY
		{ $$ = yytext; }
	| BIT
		{ $$ = yytext; }
	| BLOB
		{ $$ = yytext; }
	| BLOCK
		{ $$ = yytext; }
	| BOOLEAN
		{ $$ = yytext; }
	| BOTH
		{ $$ = yytext; }
	| BREADTH
		{ $$ = yytext; }
	| BUCKET
		{ $$ = yytext; }
	| BULK
		{ $$ = yytext; }
	| BY
		{ $$ = yytext; }
	| BYTE
		{ $$ = yytext; }
	| CALL
		{ $$ = yytext; }
	| CALLED
		{ $$ = yytext; }
	| CALLING
		{ $$ = yytext; }
	| CAPACITY
		{ $$ = yytext; }
	| CASCADE
		{ $$ = yytext; }
	| CASCADED
		{ $$ = yytext; }
	| CASE
		{ $$ = yytext; }
	| CAST
		{ $$ = yytext; }
	| CATALOG
		{ $$ = yytext; }
	| CHAR
		{ $$ = yytext; }
	| CHARACTER
		{ $$ = yytext; }
	| CHECK
		{ $$ = yytext; }
	| CLASS
		{ $$ = yytext; }
	| CLOB
		{ $$ = yytext; }
	| CLOSE
		{ $$ = yytext; }
	| CLUSTER
		{ $$ = yytext; }
	| CLUSTERED
		{ $$ = yytext; }
	| CLUSTERING
		{ $$ = yytext; }
	| CLUSTERS
		{ $$ = yytext; }
	| COALESCE
		{ $$ = yytext; }
	| COLLATE
		{ $$ = yytext; }
	| COLLATION
		{ $$ = yytext; }
	| COLLECTION
		{ $$ = yytext; }
	| COLUMN
		{ $$ = yytext; }
	| COLUMNS
		{ $$ = yytext; }
	| COMBINE
		{ $$ = yytext; }
	| COMMENT
		{ $$ = yytext; }
	| COMMIT
		{ $$ = yytext; }
	| COMPACT
		{ $$ = yytext; }
	| COMPILE
		{ $$ = yytext; }
	| COMPRESS
		{ $$ = yytext; }
	| CONDITION
		{ $$ = yytext; }
	| CONFLICT
		{ $$ = yytext; }
	| CONNECT
		{ $$ = yytext; }
	| CONNECTION
		{ $$ = yytext; }
	| CONSISTENCY
		{ $$ = yytext; }
	| CONSISTENT
		{ $$ = yytext; }
	| CONSTRAINT
		{ $$ = yytext; }
	| CONSTRAINTS
		{ $$ = yytext; }
	| CONSTRUCTOR
		{ $$ = yytext; }
	| CONSUMED
		{ $$ = yytext; }
	| CONTINUE
		{ $$ = yytext; }
	| CONVERT
		{ $$ = yytext; }
	| COPY
		{ $$ = yytext; }
	| CORRESPONDING
		{ $$ = yytext; }
	| COUNT
		{ $$ = yytext; }
	| COUNTER
		{ $$ = yytext; }
	| CREATE
		{ $$ = yytext; }
	| CROSS
		{ $$ = yytext; }
	| CUBE
		{ $$ = yytext; }
	| CURRENT
		{ $$ = yytext; }
	| CURSOR
		{ $$ = yytext; }
	| CYCLE
		{ $$ = yytext; }
	| DATA
		{ $$ = yytext; }
	| DATABASE
		{ $$ = yytext; }
	| DATE
		{ $$ = yytext; }
	| DATETIME
		{ $$ = yytext; }
	| DAY
		{ $$ = yytext; }
	| DEALLOCATE
		{ $$ = yytext; }
	| DEC
		{ $$ = yytext; }
	| DECIMAL
		{ $$ = yytext; }
	| DECLARE
		{ $$ = yytext; }
	| DEFAULT
		{ $$ = yytext; }
	| DEFERRABLE
		{ $$ = yytext; }
	| DEFERRED
		{ $$ = yytext; }
	| DEFINE
		{ $$ = yytext; }
	| DEFINED
		{ $$ = yytext; }
	| DEFINITION
		{ $$ = yytext; }
	| DELETE
		{ $$ = yytext; }
	| DELIMITED
		{ $$ = yytext; }
	| DEPTH
		{ $$ = yytext; }
	| DEREF
		{ $$ = yytext; }
	| DESC
		{ $$ = yytext; }
	| DESCRIBE
		{ $$ = yytext; }
	| DESCRIPTOR
		{ $$ = yytext; }
	| DETACH
		{ $$ = yytext; }
	| DETERMINISTIC
		{ $$ = yytext; }
	| DIAGNOSTICS
		{ $$ = yytext; }
	| DIRECTORIES
		{ $$ = yytext; }
	| DISABLE
		{ $$ = yytext; }
	| DISCONNECT
		{ $$ = yytext; }
	| DISTINCT
		{ $$ = yytext; }
	| DISTRIBUTE
		{ $$ = yytext; }
	| DO
		{ $$ = yytext; }
	| DOMAIN
		{ $$ = yytext; }
	| DOUBLE
		{ $$ = yytext; }
	| DROP
		{ $$ = yytext; }
	| DUMP
		{ $$ = yytext; }
	| DURATION
		{ $$ = yytext; }
	| DYNAMIC
		{ $$ = yytext; }
	| EACH
		{ $$ = yytext; }
	| ELEMENT
		{ $$ = yytext; }
	| ELSE
		{ $$ = yytext; }
	| ELSEIF
		{ $$ = yytext; }
	| EMPTY
		{ $$ = yytext; }
	| ENABLE
		{ $$ = yytext; }
	| END
		{ $$ = yytext; }
	| EQUAL
		{ $$ = yytext; }
	| EQUALS
		{ $$ = yytext; }
	| ERROR
		{ $$ = yytext; }
	| ESCAPE
		{ $$ = yytext; }
	| ESCAPED
		{ $$ = yytext; }
	| EVAL
		{ $$ = yytext; }
	| EVALUATE
		{ $$ = yytext; }
	| EXCEEDED
		{ $$ = yytext; }
	| EXCEPT
		{ $$ = yytext; }
	| EXCEPTION
		{ $$ = yytext; }
	| EXCEPTIONS
		{ $$ = yytext; }
	| EXCLUSIVE
		{ $$ = yytext; }
	| EXEC
		{ $$ = yytext; }
	| EXECUTE
		{ $$ = yytext; }
	| EXISTS
		{ $$ = yytext; }
	| EXIT
		{ $$ = yytext; }
	| EXPLAIN
		{ $$ = yytext; }
	| EXPLODE
		{ $$ = yytext; }
	| EXPORT
		{ $$ = yytext; }
	| EXPRESSION
		{ $$ = yytext; }
	| EXTENDED
		{ $$ = yytext; }
	| EXTERNAL
		{ $$ = yytext; }
	| EXTRACT
		{ $$ = yytext; }
	| FAIL
		{ $$ = yytext; }
	| FALSE
		{ $$ = yytext; }
	| FAMILY
		{ $$ = yytext; }
	| FETCH
		{ $$ = yytext; }
	| FIELDS
		{ $$ = yytext; }
	| FILE
		{ $$ = yytext; }
	| FILTER
		{ $$ = yytext; }
	| FILTERING
		{ $$ = yytext; }
	| FINAL
		{ $$ = yytext; }
	| FINISH
		{ $$ = yytext; }
	| FIRST
		{ $$ = yytext; }
	| FIXED
		{ $$ = yytext; }
	| FLATTERN
		{ $$ = yytext; }
	| FLOAT
		{ $$ = yytext; }
	| FOR
		{ $$ = yytext; }
	| FORCE
		{ $$ = yytext; }
	| FOREIGN
		{ $$ = yytext; }
	| FORMAT
		{ $$ = yytext; }
	| FORWARD
		{ $$ = yytext; }
	| FOUND
		{ $$ = yytext; }
	| FREE
		{ $$ = yytext; }
	| FROM
		{ $$ = yytext; }
	| FULL
		{ $$ = yytext; }
	| FUNCTION
		{ $$ = yytext; }
	| FUNCTIONS
		{ $$ = yytext; }
	| GENERAL
		{ $$ = yytext; }
	| GENERATE
		{ $$ = yytext; }
	| GET
		{ $$ = yytext; }
	| GLOB
		{ $$ = yytext; }
	| GLOBAL
		{ $$ = yytext; }
	| GO
		{ $$ = yytext; }
	| GOTO
		{ $$ = yytext; }
	| GRANT
		{ $$ = yytext; }
	| GREATER
		{ $$ = yytext; }
	| GROUP
		{ $$ = yytext; }
	| GROUPING
		{ $$ = yytext; }
	| HANDLER
		{ $$ = yytext; }
	| HASH
		{ $$ = yytext; }
	| HAVE
		{ $$ = yytext; }
	| HAVING
		{ $$ = yytext; }
	| HEAP
		{ $$ = yytext; }
	| HIDDEN
		{ $$ = yytext; }
	| HOLD
		{ $$ = yytext; }
	| HOUR
		{ $$ = yytext; }
	| IDENTIFIED
		{ $$ = yytext; }
	| IDENTITY
		{ $$ = yytext; }
	| IF
		{ $$ = yytext; }
	| IGNORE
		{ $$ = yytext; }
	| IMMEDIATE
		{ $$ = yytext; }
	| IMPORT
		{ $$ = yytext; }
	| IN
		{ $$ = yytext; }
	| INCLUDING
		{ $$ = yytext; }
	| INCLUSIVE
		{ $$ = yytext; }
	| INCREMENT
		{ $$ = yytext; }
	| INCREMENTAL
		{ $$ = yytext; }
	| INDEX
		{ $$ = yytext; }
	| INDEXED
		{ $$ = yytext; }
	| INDEXES
		{ $$ = yytext; }
	| INDICATOR
		{ $$ = yytext; }
	| INFINITE
		{ $$ = yytext; }
	| INITIALLY
		{ $$ = yytext; }
	| INLINE
		{ $$ = yytext; }
	| INNER
		{ $$ = yytext; }
	| INNTER
		{ $$ = yytext; }
	| INOUT
		{ $$ = yytext; }
	| INPUT
		{ $$ = yytext; }
	| INSENSITIVE
		{ $$ = yytext; }
	| INSERT
		{ $$ = yytext; }
	| INSTEAD
		{ $$ = yytext; }
	| INT
		{ $$ = yytext; }
	| INTEGER
		{ $$ = yytext; }
	| INTERSECT
		{ $$ = yytext; }
	| INTERVAL
		{ $$ = yytext; }
	| INTO
		{ $$ = yytext; }
	| INVALIDATE
		{ $$ = yytext; }
	| IS
		{ $$ = yytext; }
	| ISOLATION
		{ $$ = yytext; }
	| ITEM
		{ $$ = yytext; }
	| ITEMS
		{ $$ = yytext; }
	| ITERATE
		{ $$ = yytext; }
	| JOIN
		{ $$ = yytext; }
	| KEY
		{ $$ = yytext; }
	| KEYS
		{ $$ = yytext; }
	| LAG
		{ $$ = yytext; }
	| LANGUAGE
		{ $$ = yytext; }
	| LARGE
		{ $$ = yytext; }
	| LAST
		{ $$ = yytext; }
	| LATERAL
		{ $$ = yytext; }
	| LEAD
		{ $$ = yytext; }
	| LEADING
		{ $$ = yytext; }
	| LEAVE
		{ $$ = yytext; }
	| LEFT
		{ $$ = yytext; }
	| LENGTH
		{ $$ = yytext; }
	| LESS
		{ $$ = yytext; }
	| LEVEL
		{ $$ = yytext; }
	| LIKE
		{ $$ = yytext; }
	| LIMIT
		{ $$ = yytext; }
	| LIMITED
		{ $$ = yytext; }
	| LINES
		{ $$ = yytext; }
	| LIST
		{ $$ = yytext; }
	| LOAD
		{ $$ = yytext; }
	| LOCAL
		{ $$ = yytext; }
	| LOCALTIME
		{ $$ = yytext; }
	| LOCALTIMESTAMP
		{ $$ = yytext; }
	| LOCATION
		{ $$ = yytext; }
	| LOCATOR
		{ $$ = yytext; }
	| LOCK
		{ $$ = yytext; }
	| LOCKS
		{ $$ = yytext; }
	| LOG
		{ $$ = yytext; }
	| LOGED
		{ $$ = yytext; }
	| LONG
		{ $$ = yytext; }
	| LOOP
		{ $$ = yytext; }
	| LOWER
		{ $$ = yytext; }
	| MAP
		{ $$ = yytext; }
	| MATCH
		{ $$ = yytext; }
	| MATERIALIZED
		{ $$ = yytext; }
	| MAX
		{ $$ = yytext; }
	| MAXLEN
		{ $$ = yytext; }
	| MEMBER
		{ $$ = yytext; }
	| MERGE
		{ $$ = yytext; }
	| METHOD
		{ $$ = yytext; }
	| METRICS
		{ $$ = yytext; }
	| MIN
		{ $$ = yytext; }
	| MINUS
		{ $$ = yytext; }
	| MINUTE
		{ $$ = yytext; }
	| MISSING
		{ $$ = yytext; }
	| MOD
		{ $$ = yytext; }
	| MODE
		{ $$ = yytext; }
	| MODIFIES
		{ $$ = yytext; }
	| MODIFY
		{ $$ = yytext; }
	| MODULE
		{ $$ = yytext; }
	| MONTH
		{ $$ = yytext; }
	| MULTI
		{ $$ = yytext; }
	| MULTISET
		{ $$ = yytext; }
	| NAME
		{ $$ = yytext; }
	| NAMES
		{ $$ = yytext; }
	| NATIONAL
		{ $$ = yytext; }
	| NATURAL
		{ $$ = yytext; }
	| NCHAR
		{ $$ = yytext; }
	| NCLOB
		{ $$ = yytext; }
	| NEW
		{ $$ = yytext; }
	| NEXT
		{ $$ = yytext; }
	| NO
		{ $$ = yytext; }
	| NONE
		{ $$ = yytext; }
	| NOT
		{ $$ = yytext; }
	| NULL
		{ $$ = yytext; }
	| NULLIF
		{ $$ = yytext; }
	| NUMBER
		{ $$ = yytext; }
	| NUMERIC
		{ $$ = yytext; }
	| OBJECT
		{ $$ = yytext; }
	| OF
		{ $$ = yytext; }
	| OFFLINE
		{ $$ = yytext; }
	| OFFSET
		{ $$ = yytext; }
	| OLD
		{ $$ = yytext; }
	| ON
		{ $$ = yytext; }
	| ONLINE
		{ $$ = yytext; }
	| ONLY
		{ $$ = yytext; }
	| OPAQUE
		{ $$ = yytext; }
	| OPEN
		{ $$ = yytext; }
	| OPERATOR
		{ $$ = yytext; }
	| OPTION
		{ $$ = yytext; }
	| OR
		{ $$ = yytext; }
	| ORDER
		{ $$ = yytext; }
	| ORDINALITY
		{ $$ = yytext; }
	| OTHER
		{ $$ = yytext; }
	| OTHERS
		{ $$ = yytext; }
	| OUT
		{ $$ = yytext; }
	| OUTER
		{ $$ = yytext; }
	| OUTPUT
		{ $$ = yytext; }
	| OVER
		{ $$ = yytext; }
	| OVERLAPS
		{ $$ = yytext; }
	| OVERRIDE
		{ $$ = yytext; }
	| OWNER
		{ $$ = yytext; }
	| PAD
		{ $$ = yytext; }
	| PARALLEL
		{ $$ = yytext; }
	| PARAMETER
		{ $$ = yytext; }
	| PARAMETERS
		{ $$ = yytext; }
	| PARTIAL
		{ $$ = yytext; }
	| PARTITION
		{ $$ = yytext; }
	| PARTITIONED
		{ $$ = yytext; }
	| PARTITIONS
		{ $$ = yytext; }
	| PATH
		{ $$ = yytext; }
	| PERCENT
		{ $$ = yytext; }
	| PERCENTILE
		{ $$ = yytext; }
	| PERMISSION
		{ $$ = yytext; }
	| PERMISSIONS
		{ $$ = yytext; }
	| PIPE
		{ $$ = yytext; }
	| PIPELINED
		{ $$ = yytext; }
	| PLAN
		{ $$ = yytext; }
	| POOL
		{ $$ = yytext; }
	| POSITION
		{ $$ = yytext; }
	| PRECISION
		{ $$ = yytext; }
	| PREPARE
		{ $$ = yytext; }
	| PRESERVE
		{ $$ = yytext; }
	| PRIMARY
		{ $$ = yytext; }
	| PRIOR
		{ $$ = yytext; }
	| PRIVATE
		{ $$ = yytext; }
	| PRIVILEGES
		{ $$ = yytext; }
	| PROCEDURE
		{ $$ = yytext; }
	| PROCESSED
		{ $$ = yytext; }
	| PROJECT
		{ $$ = yytext; }
	| PROJECTION
		{ $$ = yytext; }
	| PROPERTY
		{ $$ = yytext; }
	| PROVISIONING
		{ $$ = yytext; }
	| PUBLIC
		{ $$ = yytext; }
	| PUT
		{ $$ = yytext; }
	| QUERY
		{ $$ = yytext; }
	| QUIT
		{ $$ = yytext; }
	| QUORUM
		{ $$ = yytext; }
	| RAISE
		{ $$ = yytext; }
	| RANDOM
		{ $$ = yytext; }
	| RANGE
		{ $$ = yytext; }
	| RANK
		{ $$ = yytext; }
	| RAW
		{ $$ = yytext; }
	| READ
		{ $$ = yytext; }
	| READS
		{ $$ = yytext; }
	| REAL
		{ $$ = yytext; }
	| REBUILD
		{ $$ = yytext; }
	| RECORD
		{ $$ = yytext; }
	| RECURSIVE
		{ $$ = yytext; }
	| REDUCE
		{ $$ = yytext; }
	| REF
		{ $$ = yytext; }
	| REFERENCE
		{ $$ = yytext; }
	| REFERENCES
		{ $$ = yytext; }
	| REFERENCING
		{ $$ = yytext; }
	| REGEXP
		{ $$ = yytext; }
	| REGION
		{ $$ = yytext; }
	| REINDEX
		{ $$ = yytext; }
	| RELATIVE
		{ $$ = yytext; }
	| RELEASE
		{ $$ = yytext; }
	| REMAINDER
		{ $$ = yytext; }
	| RENAME
		{ $$ = yytext; }
	| REPEAT
		{ $$ = yytext; }
	| REPLACE
		{ $$ = yytext; }
	| REQUEST
		{ $$ = yytext; }
	| RESET
		{ $$ = yytext; }
	| RESIGNAL
		{ $$ = yytext; }
	| RESOURCE
		{ $$ = yytext; }
	| RESPONSE
		{ $$ = yytext; }
	| RESTORE
		{ $$ = yytext; }
	| RESTRICT
		{ $$ = yytext; }
	| RESULT
		{ $$ = yytext; }
	| RETURN
		{ $$ = yytext; }
	| RETURNING
		{ $$ = yytext; }
	| RETURNS
		{ $$ = yytext; }
	| REVERSE
		{ $$ = yytext; }
	| REVOKE
		{ $$ = yytext; }
	| RIGHT
		{ $$ = yytext; }
	| ROLE
		{ $$ = yytext; }
	| ROLES
		{ $$ = yytext; }
	| ROLLBACK
		{ $$ = yytext; }
	| ROLLUP
		{ $$ = yytext; }
	| ROUTINE
		{ $$ = yytext; }
	| ROW
		{ $$ = yytext; }
	| ROWS
		{ $$ = yytext; }
	| RULE
		{ $$ = yytext; }
	| RULES
		{ $$ = yytext; }
	| SAMPLE
		{ $$ = yytext; }
	| SATISFIES
		{ $$ = yytext; }
	| SAVE
		{ $$ = yytext; }
	| SAVEPOINT
		{ $$ = yytext; }
	| SCAN
		{ $$ = yytext; }
	| SCHEMA
		{ $$ = yytext; }
	| SCOPE
		{ $$ = yytext; }
	| SCROLL
		{ $$ = yytext; }
	| SEARCH
		{ $$ = yytext; }
	| SECOND
		{ $$ = yytext; }
	| SECTION
		{ $$ = yytext; }
	| SEGMENT
		{ $$ = yytext; }
	| SEGMENTS
		{ $$ = yytext; }
	| SELECT
		{ $$ = yytext; }
	| SELF
		{ $$ = yytext; }
	| SEMI
		{ $$ = yytext; }
	| SENSITIVE
		{ $$ = yytext; }
	| SEPARATE
		{ $$ = yytext; }
	| SEQUENCE
		{ $$ = yytext; }
	| SERIALIZABLE
		{ $$ = yytext; }
	| SESSION
		{ $$ = yytext; }
	| SET
		{ $$ = yytext; }
	| SETS
		{ $$ = yytext; }
	| SHARD
		{ $$ = yytext; }
	| SHARE
		{ $$ = yytext; }
	| SHARED
		{ $$ = yytext; }
	| SHORT
		{ $$ = yytext; }
	| SHOW
		{ $$ = yytext; }
	| SIGNAL
		{ $$ = yytext; }
	| SIMILAR
		{ $$ = yytext; }
	| SIZE
		{ $$ = yytext; }
	| SKEWED
		{ $$ = yytext; }
	| SMALLINT
		{ $$ = yytext; }
	| SNAPSHOT
		{ $$ = yytext; }
	| SOME
		{ $$ = yytext; }
	| SOURCE
		{ $$ = yytext; }
	| SPACE
		{ $$ = yytext; }
	| SPACES
		{ $$ = yytext; }
	| SPARSE
		{ $$ = yytext; }
	| SPECIFIC
		{ $$ = yytext; }
	| SPECIFICTYPE
		{ $$ = yytext; }
	| SPLIT
		{ $$ = yytext; }
	| SQL
		{ $$ = yytext; }
	| SQLCODE
		{ $$ = yytext; }
	| SQLERROR
		{ $$ = yytext; }
	| SQLEXCEPTION
		{ $$ = yytext; }
	| SQLSTATE
		{ $$ = yytext; }
	| SQLWARNING
		{ $$ = yytext; }
	| START
		{ $$ = yytext; }
	| STATE
		{ $$ = yytext; }
	| STATIC
		{ $$ = yytext; }
	| STATUS
		{ $$ = yytext; }
	| STORAGE
		{ $$ = yytext; }
	| STORE
		{ $$ = yytext; }
	| STORED
		{ $$ = yytext; }
	| STREAM
		{ $$ = yytext; }
	| STRING
		{ $$ = yytext; }
	| STRUCT
		{ $$ = yytext; }
	| STYLE
		{ $$ = yytext; }
	| SUB
		{ $$ = yytext; }
	| SUBMULTISET
		{ $$ = yytext; }
	| SUBPARTITION
		{ $$ = yytext; }
	| SUBSTRING
		{ $$ = yytext; }
	| SUBTYPE
		{ $$ = yytext; }
	| SUM
		{ $$ = yytext; }
	| SUPER
		{ $$ = yytext; }
	| SYMMETRIC
		{ $$ = yytext; }
	| SYNONYM
		{ $$ = yytext; }
	| SYSTEM
		{ $$ = yytext; }
	| TABLE
		{ $$ = yytext; }
	| TABLESAMPLE
		{ $$ = yytext; }
	| TEMP
		{ $$ = yytext; }
	| TEMPORARY
		{ $$ = yytext; }
	| TERMINATED
		{ $$ = yytext; }
	| TEXT
		{ $$ = yytext; }
	| THAN
		{ $$ = yytext; }
	| THEN
		{ $$ = yytext; }
	| THROUGHPUT
		{ $$ = yytext; }
	| TIME
		{ $$ = yytext; }
	| TIMESTAMP
		{ $$ = yytext; }
	| TIMEZONE
		{ $$ = yytext; }
	| TINYINT
		{ $$ = yytext; }
	| TO
		{ $$ = yytext; }
	| TOKEN
		{ $$ = yytext; }
	| TOTAL
		{ $$ = yytext; }
	| TOUCH
		{ $$ = yytext; }
	| TRAILING
		{ $$ = yytext; }
	| TRANSACTION
		{ $$ = yytext; }
	| TRANSFORM
		{ $$ = yytext; }
	| TRANSLATE
		{ $$ = yytext; }
	| TRANSLATION
		{ $$ = yytext; }
	| TREAT
		{ $$ = yytext; }
	| TRIGGER
		{ $$ = yytext; }
	| TRIM
		{ $$ = yytext; }
	| TRUE
		{ $$ = yytext; }
	| TRUNCATE
		{ $$ = yytext; }
	| TTL
		{ $$ = yytext; }
	| TUPLE
		{ $$ = yytext; }
	| TYPE
		{ $$ = yytext; }
	| UNDER
		{ $$ = yytext; }
	| UNDO
		{ $$ = yytext; }
	| UNION
		{ $$ = yytext; }
	| UNIQUE
		{ $$ = yytext; }
	| UNIT
		{ $$ = yytext; }
	| UNKNOWN
		{ $$ = yytext; }
	| UNLOGGED
		{ $$ = yytext; }
	| UNNEST
		{ $$ = yytext; }
	| UNPROCESSED
		{ $$ = yytext; }
	| UNSIGNED
		{ $$ = yytext; }
	| UNTIL
		{ $$ = yytext; }
	| UPDATE
		{ $$ = yytext; }
	| UPPER
		{ $$ = yytext; }
	| URL
		{ $$ = yytext; }
	| USAGE
		{ $$ = yytext; }
	| USE
		{ $$ = yytext; }
	| USER
		{ $$ = yytext; }
	| USERS
		{ $$ = yytext; }
	| USING
		{ $$ = yytext; }
	| UUID
		{ $$ = yytext; }
	| VACUUM
		{ $$ = yytext; }
	| VALUE
		{ $$ = yytext; }
	| VALUED
		{ $$ = yytext; }
	| VALUES
		{ $$ = yytext; }
	| VARCHAR
		{ $$ = yytext; }
	| VARIABLE
		{ $$ = yytext; }
	| VARIANCE
		{ $$ = yytext; }
	| VARINT
		{ $$ = yytext; }
	| VARYING
		{ $$ = yytext; }
	| VIEW
		{ $$ = yytext; }
	| VIEWS
		{ $$ = yytext; }
	| VIRTUAL
		{ $$ = yytext; }
	| VOID
		{ $$ = yytext; }
	| WAIT
		{ $$ = yytext; }
	| WHEN
		{ $$ = yytext; }
	| WHENEVER
		{ $$ = yytext; }
	| WHERE
		{ $$ = yytext; }
	| WHILE
		{ $$ = yytext; }
	| WINDOW
		{ $$ = yytext; }
	| WITH
		{ $$ = yytext; }
	| WITHIN
		{ $$ = yytext; }
	| WITHOUT
		{ $$ = yytext; }
	| WORK
		{ $$ = yytext; }
	| WRAPPED
		{ $$ = yytext; }
	| WRITE
		{ $$ = yytext; }
	| YEAR
		{ $$ = yytext; }
	| ZONE
		{ $$ = yytext; }
	;

dynamodb_data_string
	: SINGLE_QUOTED_STRING
		{ $$ = eval($1.split("\n").join("\\n"));}
	| DOUBLE_QUOTED_STRING
		{ $$ = eval($1.split("\n").join("\\n"));}
	;

dynamodb_raw_string
	: SINGLE_QUOTED_STRING
		{ $$ = { 'S': eval($1.split("\n").join("\\n")).toString() } }
	| DOUBLE_QUOTED_STRING
		{ $$ = { 'S': eval($1.split("\n").join("\\n")).toString() } }
	;
dynamodb_data_number
	: NUMBER
		{ $$ = eval($1); }
	;

dynamodb_raw_number
	: NUMBER
		{ $$ = { 'N': eval($1).toString() } }
	;dynamodb_data_boolean
	: TRUE
		{ $$ = true; }
	| FALSE
		{ $$ = false; }
	;

dynamodb_raw_boolean
	: TRUE
		{ $$ = { 'BOOL': true  } }
	| FALSE
		{ $$ = { 'BOOL': false } }
	;
dynamodb_data_null
	: NULL
		{ $$ = null; }
	;

dynamodb_raw_null
	: NULL
		{ $$ = { 'NULL': true } }
	;dynamodb_data_undefined
	: UNDEFINED
		{ $$ = "\0"; }
	;
/* there is a bug that causes array to return last element in array  as null, eg: [ null ] */

dynamodb_data_array
	: ARRAYLPAR array_list ARRAYRPAR
		{
			if ($2.slice(-1) == "\0") {
				$$ = $2.slice(0,-1)
			} else
				$$ = $2;
		}
	;
array_list
	: array_list COMMA array_value
		{
			$$ = $1
			$$.push($3);
		}
	| array_value
		{ $$ = [$1]; }
	;

/* array should also support expr */
array_value
	:
		{ $$ = "\0" }
	| dynamodb_data_number
		{ $$ = $1 }
	| dynamodb_data_string
		{ $$ = $1 }
	| dynamodb_data_boolean
		{ $$ = $1 }
	| dynamodb_data_null
		{ $$ = $1 }
	| dynamodb_data_array
		{ $$ = $1 }
	| dynamodb_data_json
		{ $$ = $1 }
	;





dynamodb_raw_array
	: ARRAYLPAR array_list_raw ARRAYRPAR
		{
			if ($2.slice(-1) == "\0") {
				$2 = $2.slice(0,-1)
			}
			$$ = { 'L': $2 }
		}
	;
array_list_raw
	: array_list_raw COMMA array_value_raw
		{
			$$ = $1
			$$.push($3);
		}
	| array_value_raw
		{ $$ = [$1]; }
	;
array_value_raw
	:
		{ $$ = "\0" }

	/* javascript_raw_expr replaces dynamodb_raw_string, dynamodb_raw_number, javascript_raw_obj_date, javascript_raw_obj_math */
	| javascript_raw_expr
		{ $$ = $1 }
	| dynamodb_raw_boolean
		{ $$ = $1 }
	| dynamodb_raw_null
		{ $$ = $1 }
	| dynamodb_raw_array
		{ $$ = $1 }
	| dynamodb_raw_json
		{ $$ = $1 }
	| dynamodb_raw_numberset
		{ $$ = $1 }
	| dynamodb_raw_stringset
		{ $$ = $1 }
	| dynamodb_raw_binaryset
		{ $$ = $1 }
	;

dynamodb_data_json
	: JSONLPAR dynamodb_data_json_list JSONRPAR
		{
			var $kv = {}
			if ($2) {
				$2.map(function(v) {
					if (v)
						$kv[v[0]] = v[1]
				})
			}
			$$ = $kv
		}
	;

dynamodb_data_json_list
	: dynamodb_data_json_list COMMA dynamodb_data_json_kv
		{ $$ = $1; $$.push($3); }
	| dynamodb_data_json_kv
		{ $$ = [$1]; }
	;


dynamodb_data_json_kv
	:
		{ $$ = undefined; }
	| name COLON dynamodb_data_number
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_number
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_number
		{ $$ = [$1, $3 ] }

	| name COLON dynamodb_data_string
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_string
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_string
		{ $$ = [$1, $3 ] }

	| name COLON dynamodb_data_boolean
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_boolean
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_boolean
		{ $$ = [$1, $3 ] }


	| name COLON dynamodb_data_null
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_null
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_null
		{ $$ = [$1, $3 ] }

	| name COLON dynamodb_data_array
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_array
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_array
		{ $$ = [$1, $3 ] }

	| name COLON dynamodb_data_json
		{ $$ = [$1, $3 ] }
	| SINGLE_QUOTED_STRING COLON dynamodb_data_json
		{ $$ = [$1, $3 ] }
	| DOUBLE_QUOTED_STRING COLON dynamodb_data_json
		{ $$ = [$1, $3 ] }
	;







dynamodb_raw_json
	: JSONLPAR dynamodb_data_json_list_raw JSONRPAR
		{
			var $kv = {}
			if ($2) {
				$2.map(function(v) {
					if (v)
						$kv[v[0]] = v[1]
				})
			}
			$$ = { 'M': $kv }
		}
	;
dynamodb_data_json_list_raw
	: dynamodb_data_json_list_raw COMMA dynamodb_raw_json_kv
		{ $$ = $1; $$.push($3); }
	| dynamodb_raw_json_kv
		{ $$ = [$1]; }
	;

dynamodb_raw_json_kv_key
	: SINGLE_QUOTED_STRING
		{ $$ = eval($1) }
	| DOUBLE_QUOTED_STRING
		{ $$ = eval($1) }
	| dynamodb_attribute_name_or_keyword /* includes name(LITERAL | BRALITERAL) | KEYWORD */
		{ $$ = $1 }
	;

dynamodb_raw_json_kv
	:
		{ $$ = undefined; }

	/* javascript_raw_expr replaces dynamodb_raw_string, dynamodb_raw_number, javascript_raw_obj_date, javascript_raw_obj_math */
	| dynamodb_raw_json_kv_key COLON javascript_raw_expr
		{ $$ = [$1, $3 ] }


	| dynamodb_raw_json_kv_key COLON dynamodb_raw_boolean
		{ $$ = [$1, $3 ] }
	| dynamodb_raw_json_kv_key COLON dynamodb_raw_null
		{ $$ = [$1, $3 ] }
	| dynamodb_raw_json_kv_key COLON dynamodb_raw_array
		{ $$ = [$1, $3 ] }
	| dynamodb_raw_json_kv_key COLON dynamodb_raw_json
		{ $$ = [$1, $3 ] }
	| dynamodb_raw_json_kv_key COLON dynamodb_raw_numberset
		{ $$ = [$1, $3 ] }
	| dynamodb_raw_json_kv_key COLON dynamodb_raw_stringset
		{ $$ = [$1, $3 ] }
	| dynamodb_raw_json_kv_key COLON dynamodb_raw_binaryset
		{ $$ = [$1, $3 ] }
	;

dynamodb_raw_stringset
	: NEW STRINGSET LPAR ARRAYLPAR stringset_list ARRAYRPAR RPAR
		{
			if ($5.slice(-1) == "\0") {
				$5 = $5.slice(0,-1)
			}
			$$ = { 'SS': $5 }
		}
	;

stringset_list
	: stringset_list COMMA dynamodb_data_string
		{
			$$ = $1 
			$$.push($3); 
		}
	| dynamodb_data_string
		{ $$ = [$1]; }
	;

dynamodb_raw_numberset
	: NEW NUMBERSET LPAR ARRAYLPAR numberset_list ARRAYRPAR RPAR
		{
			if ($5.slice(-1) == "\0") {
				$5 = $5.slice(0,-1)
			}
			$$ = { 'NS': $5 }
		}
	;

numberset_list
	: numberset_list COMMA dynamodb_data_number
		{
			$$ = $1 
			$$.push( ($3).toString() ); 
		}
	| dynamodb_data_number
		{ $$ = [ ($1).toString() ]; }
	;

dynamodb_raw_binaryset
	: NEW BINARYSET LPAR ARRAYLPAR binaryset_list ARRAYRPAR RPAR
		{
			$$ = { 'BS': $5 }
		}
	;


binaryset_list
	: binaryset_list COMMA javascript_data_func_buffer
		{
			$$ = $1 
			$$.push($3); 
		}
	| javascript_data_func_buffer
		{ $$ = [ $1 ]; }
	;


javascript_data_obj_date
	: NEW DATE LPAR  javascript_raw_date_parameter  RPAR
		{
			var date;
			if ($4)
				date = new Date($4);
			else
				date = new Date()

			if (typeof date === "object") {
				$$ = date.toString()
			}
			if (typeof date === "string") {
				$$ = date
			}
			if (typeof date === "number") {
				$$ = date
			}
		}
	| NEW DATE LPAR  javascript_raw_date_parameter  RPAR DOT LITERAL LPAR RPAR
		{
			var date;
			if ($4)
				date = new Date($4);
			else
				date = new Date()


			if (typeof date[$7] === "function" ) {
				date = date[$7]();
				if (typeof date === "object") {
					$$ = date.toString()
				}
				if (typeof date === "string") {
					$$ = date
				}
				if (typeof date === "number") {
					$$ = date
				}
			} else {
				throw $7 + " not a function"
			}
		}
	;

javascript_raw_obj_date
	: NEW DATE LPAR  javascript_raw_date_parameter  RPAR
		{
			var date;
			if ($4)
				date = new Date($4);
			else
				date = new Date()

			if (typeof date === "object") {
				$$ = { S: date.toString() }
			}
			if (typeof date === "string") {
				$$ = { S: date }
			}
			if (typeof date === "number") {
				$$ = { N: date.toString() }
			}
		}
	| NEW DATE LPAR  javascript_raw_date_parameter  RPAR DOT LITERAL LPAR RPAR
		{
			var date;
			if ($4)
				date = new Date($4);
			else
				date = new Date()


			if (typeof date[$7] === "function" ) {
				date = date[$7]();
				if (typeof date === "object") {
					$$ = { S: date.toString() }
				}
				if (typeof date === "string") {
					$$ = { S: date }
				}
				if (typeof date === "number") {
					$$ = { N: date.toString() }
				}
			} else {
				throw $7 + " not a function"
			}
		}
	;
javascript_raw_date_parameter
	:
		{ $$ = undefined }
	| def_resolvable_expr
		{ $$ = $1 }
	;


javascript_raw_obj_math
	: javascript_data_obj_math
		{
			if (typeof $1 === "object") {
				$$ = { S: $1.toString() }
			}
			if (typeof $1 === "string") {
				$$ = { S: $1 }
			}
			if (typeof $1 === "number") {
				$$ = { N: $1.toString() }
			}
		}
	;
javascript_data_obj_math
	: MATH DOT javascript_raw_math_funcname LPAR javascript_raw_math_parameter RPAR
		{
			if (typeof Math[$3] === "function" ) {
				$$ = Math[$3]($5);
			} else {
				throw 'Math.' + $3 + " not a function"
			}
		}
	;
javascript_raw_math_funcname
	: LITERAL
		{ $$ = $1 }
	| RANDOM
		{ $$ = 'random' }
	;
javascript_raw_math_parameter
	:
		{ $$ = undefined }
	| def_resolvable_expr
		{ $$ = $1 }
	;


javascript_data_func_uuid
	: UUID LPAR RPAR
		{
			$$ =  '########-####-####-####-############'.replace(/[#]/g, function(c) { var r = Math.random()*16|0, v = c == '#' ? r : (r&0x3|0x8); return v.toString(16); })
 		}
	| UUID LPAR javascript_data_expr RPAR
		{
			$$ =  '########-####-####-####-############'.replace(/[#]/g, function(c) { var r = Math.random()*16|0, v = c == '#' ? r : (r&0x3|0x8); return v.toString(16); })
			if ( typeof $3 === 'string')
				$$ =  $3.replace(/[#]/g, function(c) { var r = Math.random()*16|0, v = c == '#' ? r : (r&0x3|0x8); return v.toString(16); })

			if ( typeof $3 === 'number')
				$$ = '#'.repeat(
					Math.max(
						1,
						Math.min(36, $3)
					)
				).replace(/[#]/g, function(c) { var r = Math.random()*16|0, v = c == '#' ? r : (r&0x3|0x8); return v.toString(16); })
		}
	;



javascript_data_func_buffer
	: BUFFER DOT FROM LPAR dynamodb_data_string COMMA dynamodb_data_string RPAR
		{
			if ( $1 !== 'Buffer')
				throw ('ReferenceError: ' + $1 + ' is not defined')

			if ( $3 !== 'from')
				throw ('TypeError: Buffer.' + $3 + ' is not a function')

			if ( $7 !== 'base64')
				throw ('TypeError: Buffer.from - only base64 supported')

			var buf;
			if (typeof Buffer.from === "function") { // Node 5.10+
				buf = Buffer.from( $5, $7 );
			} else { // older Node versions, now deprecated
				buf = new Buffer( $5, $7 );
			}
			$$ = buf;
		}
	;



javascript_raw_expr
	: def_resolvable_expr
		{
			if (Buffer.isBuffer($1) ) {
				$$ = { B: $1 }
				return;
			}
			if (typeof $1 === "object") {
				$$ = { S: $1.toString() }
			}
			if (typeof $1 === "string") {
				$$ = { S: $1 }
			}
			if (typeof $1 === "number") {
				$$ = { N: $1.toString() }
			}
		}
	;


javascript_data_expr
	: def_resolvable_expr
		{ $$ = $1 }
	;



def_resolvable_expr
	: dev_resolvable_value
		{ $$ = $1 }
	| LPAR def_resolvable_expr RPAR
		{ $$ = $2 }
	| def_resolvable_expr PLUS def_resolvable_expr
		{ $$ = $1 + $3 }
	| def_resolvable_expr MINUS def_resolvable_expr
		{ $$ = $1 - $3 }
	| def_resolvable_expr STAR def_resolvable_expr
		{ $$ = $1 * $3 }
	| def_resolvable_expr SLASH def_resolvable_expr
		{
			if ($3 === 0 )
				throw 'Division by 0';

			$$ = $1 / $3
		}
	;

dev_resolvable_value
	: javascript_data_obj_date
		{ $$ = $1 }
	| javascript_data_obj_math
		{ $$ = $1 }
	| javascript_data_func_uuid
		{ $$ = $1 }
	| javascript_data_func_buffer
		{ $$ = $1 }
	| dynamodb_data_number
		{ $$ = $1 }
	| dynamodb_data_string
		{ $$ = $1 }
	;

/*
def_resolvable_expr
	[ ] .substr()
	[ ] .slice()
	[ ] .chain
	[ ] .func()
*/
KEYWORD
	: SQLKEYWORD
		{ $$ = $1; }
	| DYNAMODBKEYWORD
		{ $$ = $1; }
	;

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

replace_stmt
	: REPLACE INTO dynamodb_table_name_or_keyword SET def_replace_columns
		{
			var $kv = {}
			$5.map(function(v) {
				$kv[v[0]] = v[1]
			})
			$$ = {
				statement: 'REPLACE',
				operation: 'putItem',
				dynamodb: {
					TableName: $3,
					Item: $kv
				},
			}
		}
	;


def_replace_columns
	: def_replace_columns COMMA def_replace_onecolumn
		{ $$ = $1; $$.push($3); }
	| def_replace_onecolumn
		{ $$ = [$1]; }
	;
def_replace_onecolumn
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

delete_stmt
	: DELETE FROM dynamodb_table_name_or_keyword WHERE def_delete_where
		{
			var $kv = {}
			$5.map(function(v) { $kv[v.k] = v.v })

			$$ = {
				statement: 'DELETE',
				operation: 'deleteItem',
				dynamodb: {
					TableName: $3,
					Key: $kv,
				}
			}
		}
	;

def_delete_where
	: def_delete_where_cond
		{ $$ = [ $1 ]; }
	| def_delete_where_cond AND def_delete_where_cond
		{ $$ = [$1, $3]; }
	;



def_delete_where_cond
	: dynamodb_attribute_name_or_keyword EQ javascript_raw_expr
		{ $$ = {k: $1, v: $3 }; }
/*
	: name EQ dynamodb_raw_string
		{ $$ = {k: $1, v: $3 }; }
	| name EQ dynamodb_raw_number
		{ $$ = {k: $1, v: $3 }; }
	| name EQ javascript_raw_obj_date
		{ $$ = {k: $1, v: $3 }; }
	| name EQ javascript_raw_obj_math
		{ $$ = {k: $1, v: $3 }; }
*/
	;

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

describe_table_stmt
	: DESCRIBE TABLE dynamodb_table_name_or_keyword
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

debug_stmt
	: DEBUG javascript_raw_expr
		{
			$$ = $2
		}
	;
