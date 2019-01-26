


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
