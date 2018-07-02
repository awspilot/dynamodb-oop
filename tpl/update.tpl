
<a name="update"></a>
<h1>Update Item</h1>
<p>
	Update does not insert a new item if it does not already exist. Use <a>.insert_or_update()</a> instead.<br>

	<br><br>
	WARNING: update() will do an extra call (describeTable) to get the table schema and prevent item creation,<br>
	If an item with the same key does not exist, 'ConditionalCheckFailedException' error is returned<br>
	<br><br>

</p>
<div class="code">
// update multiple attributes in a HASH table
DynamoDB
	.table('users')
	.where('email').eq('test@test.com')
	.return(DynamoDB.ALL_OLD)
	.update({
		password: 'qwert',
		name: 'Smith',
		active: true,
		subscription: null,

		// increment
		page_views: DynamoDB.add(5),

		list: [5,'a', {}, [] ],

		// push these elements at the end of the array
		phones: DynamoDB.add( [ 5, 'a' ] ),

		// delete attribute
		unneeded_attribute: DynamoDB.del(),

	}, function( err, data ) {

	})
</div>
