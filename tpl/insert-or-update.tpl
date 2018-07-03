
<h1>Insert on Duplicate Item Update</h1>

Insert is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html" target="_blank">updateItem</a><br>



<br>
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

	})
</div>