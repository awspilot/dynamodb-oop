
<br><br>

<div class="code html iplastic">

	INSERT INTO
		tbl_name
	SET
		partition_key = &lt;VALUE&gt;,
		sort_key =&lt;VALUE&gt;
		[, other_key = &lt;VALUE&gt;, ... ]

	/*
		NOTES:
		 - SQL keywords must be enclosed ex. SET `set` = true  
		 - keys in json that are keywords must be enclosed too:
				SET myobject = { 
						'number'  : 1,
						"keyword2": "value",
						'keyword3': 'value',
					}
		 - keys in json must be enclosed in the same way as in JavaScript
				SET `object` = {
						splitme   : 'value',
						"split-me": 'value',
					} 
		 - values for partition_key and sort_key can be of type String  or Number
		 - values for the other attributes can be:
				string: "foo", 'bar'
				number: 3.14, -1
				boolean: true or false
				null	
				list: ["string", 1, true, null, [ 1,2,3], {} ]
				map: { 'number': 1, "string": "text", 'bool': true, arr: [] }
				stringset: new Set(['a','b','c'])
				numberset: new Set([ 1 , 2 , 3 ])
				expression (currently only JavaScript Date supported): 
					new Date( string_or_number_parameter ).getTime()
	*/

</div>


<br><br>

<div class="code html iplastic">

	INSERT INTO 
		tbl_name 
	VALUES
			( &lt;JSON&gt; )
			[ , ( &lt;JSON&gt; ) ]

</div>
