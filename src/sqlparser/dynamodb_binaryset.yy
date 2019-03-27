
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
