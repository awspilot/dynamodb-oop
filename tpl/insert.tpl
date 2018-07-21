
<a name="insert"></a>
<h1>Insert Item</h1>

Insert is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html" target="_blank">putItem</a> with an extra condition to make sure item does not already exist.<br>
<br>
Insert does not replace existing items. Use <a href="../insert-or-replace/">.insert_or_replace()</a> or <a href="../insert-or-update/">.insert_or_update()</a> instead.<br>
<br>
WARNING: insert() will do an extra call (describeTable) to get the table schema and prevent item overwrite,<br>
If an item with the same key exists, 'ConditionalCheckFailedException' error is returned<br>


<br>
<div class="code">

	DynamoDB
		.table('users')
		.insert({

			// carefull though as foo.bar domain actually exists :)
			domain: 'foo.bar',
			email: 'baz@foo.bar',

			password: 'qwert',
			boolean: true,
			number: 1,
			created_at: new Date().getTime(),
			updated_at: null,
			buffer: new Buffer("test"),
			array_empty: [],
			
			// inserted as datatype L
			array_strings: ['alfa','beta','gama'], 
			
			// inserted as datatype SS
			string_set1: DynamoDB.SS(['sss','bbb','ccc']), 
			string_set2: new Set(['sss','bbb','ccc']), 

			// inserted as datatype NS
			number_set1: DynamoDB.NS([111,222,333]), 
			number_set2: new Set([[111,222,333]]),

			// inserted as datatype L
			list1: [7,9,15], 
			list2: new Set([]),
			list3: new Set([ 'a', 1 ]),

			array_mixed: [
				null,
				"string",
				5,
				true,
				false,
				{ key: "value"},
				["nested","array"],
				new Buffer("test")
			],

			nested_object: {
				name: "Foo",
				email: "baz@foo.bar",
				nested_attribute: {
					boolean_value: true,
					null_key: null,
					some_string: "tadaa",
					lucky_number: 12
				}
			}
		}, function(err,data) {

		});
</div>

<br><br>


<div class="code">

	// SQL keywords must be enclosed in "`", keywords inside json must be enclosed in quotes
	// if no callback supplied, promise is returned

	DynamoDB.query(`

		INSERT INTO users SET
			email         = 'test@test.com',
			password      = 'qwert',
			bool          = true,
			one           = 1,
			updated_at    = null,
			a_list        = [ 'alpha', 'beta', 'gamma', 1, null, true ], 
			a_map         = { 'string': 's', 'number': 1 },
			ss            =  new StringSet( 'sss','bbb','ccc' ),
			ns            =  new NumberSet( 111, 222, 333 ),
			
			/* evaluated to String or Number when parsed  */
			expire_at     =  new Date( 1530723266352 ).getTime()

		`, 
		function( err, data ) {
			
		});
</div>
<br>
<div class="code">

	// insert using VALUES does not currently support StringSet or NumberSet
	DynamoDB.query(`

			INSERT INTO users VALUES ({
				email         : 'test@test.com',
				password      : 'qwert',
				bool          : true,
				one           : 1,
				updated_at    : null,
				a_list        : [ 'alpha', 'beta', 'gamma', 1, null, true ], 
				a_map         : { 'string': 's', 'number': 1 },
			})

		`, 
		function( err, data ) {
			
		});

</div>

<br><br>

<div class="code sql light">

	INSERT INTO
		tbl_name
	SET
		partition_key = <VALUE>,
		sort_key = <VALUE>
		[, other_key = <VALUE>, ... ]

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




