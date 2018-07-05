
<h1>Insert on Duplicate Item Replace</h1>
Handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html" target="_blank">putItem</a>.<br>

<br>
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