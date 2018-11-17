

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
