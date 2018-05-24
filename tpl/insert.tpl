
<a name="insert"></a>
<h1>Insert Item</h1>
<p>does not replace existing items</p>
<div class="code">
DynamoDB
	.table('users')
	.insert({
		email: 'test@test.com',
		password: 'qwert',
		created_at: new Date().getTime(),
		updated_at: null
	}, function(err,data) {
		console.log( err, data )
	})

DynamoDB
	.table('messages')
	.insert({
		to: 'test@test.com',
		date: new Date().getTime(),
		subject: 'Foo',
		message: 'Bar'
	})
	.then(console.log, console.log)
	.catch(console.log)

// insert item with nested attributes
// carefull though as foo.bar domain actually exists :)
DynamoDB
	.table('messages')
	.insert({
		to: 'test@test.com',
		date: new Date().getTime(),
		boolean_true: true,
		boolean_false: false,
		key_null: null,
		string: "string",
		number: 1,
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
	})
</div>



<a name="insertorupdate"></a>
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

<a name="insertorreplace"></a>
<h1>Insert on Duplicate Item Replace</h1>
<p>1 request to DynamoDB</p>
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


