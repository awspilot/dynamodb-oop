


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

