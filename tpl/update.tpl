
<a name="update"></a>
<h1>Update Item</h1>

Update is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html" target="_blank">updateItem</a> with an extra condition to make sure item exists.<br>
<br>
Update does not insert a new item if it does not already exist. Use <a href="../insert-or-update/">.insert_or_update()</a> instead.<br>
<br>
Update can only update one item specified in WHERE (AWS DynamoDB limitation).<br>
<br>
WARNING: update() will do an extra call (describeTable) to get the table schema and prevent item creation,<br>
If an item with the same key does not exist, 'ConditionalCheckFailedException' error is returned<br>

<br>
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

		// ADD to array (L) - not documented by AWS
		arr:  DynamoDB.add( ['x','y', false, null, {}] ),

		// ADD to StringSet and NumberSet, will only keep unique values
		ss1:  DynamoDB.add( DynamoDB.SS(['aaa','ddd']) ),
		ns1:  DynamoDB.add( DynamoDB.NS([11,44]) ),

		// delete from StringSet and NumberSet
		ss2:  DynamoDB.del( DynamoDB.SS(['bbb']) ),
		ns2:  DynamoDB.del( DynamoDB.NS([22]) ),

		// delete from Array (L) not supported by Amazon

		// delete attribute
		unneeded_attribute: DynamoDB.del(),

	}, function( err, data ) {

	})
</div>
<br><br>

SQL version does not currently support adding / removing from StringSet or NumberSet. (Awspilot limitation).<br>


<br>
<div class="code">
DynamoDB.query(`

	UPDATE
		users
	SET
		active          = true,
		nulled          = null,
		updated_at      = 1468137844,
		
		/* delete attribute */
		activation_code = undefined,
		
		/* increment attribute */
		login_count    += 1,

		/* decrement attribute */
		days_left    += -1,

		list            = ['a',1,true, null, {}, [] ],
		map             = {
			nonkeyword = 'value1',
			"sqlkeyword1" = 'value2',
			'sqlkeyword2' = 'value3'
		},
		tags            = new StringSet(['dev','nodejs']),
		lucky_numbers   = new NumberSet([ 12, 23 ])
	WHERE
		domain = 'test.com' AND user = 'testuser'

`, function(err) {})

</div>