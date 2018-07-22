<div class="content">

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
</div>


