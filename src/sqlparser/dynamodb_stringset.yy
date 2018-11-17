
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
