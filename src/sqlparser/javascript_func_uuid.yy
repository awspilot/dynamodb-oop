

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
