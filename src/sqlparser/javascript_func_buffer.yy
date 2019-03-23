


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
/*
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
*/
