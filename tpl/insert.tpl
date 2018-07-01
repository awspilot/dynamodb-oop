
<a name="insert"></a>
<h1>Insert Item</h1>
<p> 
	Insert does not replace existing items. Use <a>.insert_or_replace()</a> or <a>.insert_or_update()</a> instead.<br>
	
	<br><br>
	WARNING: insert() will do an extra call (describeTable) to get the table schema and prevent item overwrite,<br>
	If an item with the same key exists, 'ConditionalCheckFailedException' error is returned<br>

</p>

<div class="code">
// carefull though as foo.bar domain actually exists :)

DynamoDB
	.table('users')
	.insert({
		email: 'test@test.com',
		password: 'qwert',
		boolean: true,
		number: 1,
		created_at: new Date().getTime(),
		updated_at: null,
		buffer: new Buffer("test"),
		array_empty: [],
		array_strings: ['alfa','beta','gama'], // inserted as datatype L
		string_set: DynamoDB.SS(['sss','bbb','ccc']), // inserted as datatype SS
		array_numbers: [7,9,15], // inserted as datatype L
		number_set: DynamoDB.NS([111,222,333]), // inserted as datatype NS
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
		console.log( err, data )
	})
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
		a_list        = [ 'alfa', 'beta', 'gama', 1, null, true ], 
		a_map         = { 'string': 's', 'number': 1 },
		ss            =  new StringSet( 'sss','bbb','ccc' ),
		ns            =  new NumberSet( 111, 222, 333 ),

	`, 
	function( err, data ) {
		
	})
</div>

<h1>Insert on Duplicate Item Update</h1>
<div class="code">
DynamoDB
	.table('users')
	.where('email').eq('test@test.com')
	.return(DynamoDB.UPDATED_OLD)
	.insert_or_update({
		password: 'qwert',
		firstname: 'Smith',
		number: 5,
		page_views: DynamoDB.add(5), // increment by 5
		list: [5,'a', {}, [] ], // nested attributes
		phones: DynamoDB.add([5,'a']), // push these elements at the end of the list (L)
		string_set: DynamoDB.add(DynamoDB.SS(['ddd','eee'])), // add to SS,
		number_set: DynamoDB.add(DynamoDB.NS([444,555])), // add to NS,

		unneeded_attribute: DynamoDB.del(),
		unneeded_ss_items: DynamoDB.del(DynamoDB.SS(['ccc','ddd'])), // remove elements from stringSet
		unneeded_ns_items: DynamoDB.del(DynamoDB.NS([111,444])), // remove elements from numberSet
	}, function( err, data ) {
		console.log( err, data )
	})
</div>


<h1>Insert on Duplicate Item Replace</h1>

<div class="code">
DynamoDB
	.table('users')
	.return(DynamoDB.ALL_OLD)
	.insert_or_replace({
		email: 'test@test.com',
		password: 'qwert',
		firstname: 'Smith'
	}, function( err, data ) {
		console.log( err, data )
	})
</div>


