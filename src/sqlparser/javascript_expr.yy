

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
