
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

	})

</div>