
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
