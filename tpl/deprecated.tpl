<div class="content">
<a name="deprecated"></a>
<h1>Deprecated</h1>
<p> To be removed in aws-dynamodb@0.2</p>
<div class="code">

	DynamoDB
	    .table('users')
	    .where('email').eq('test@test.com')
	    .increment({
	        login_count: 1
	    }, function( err, data ) {
	        console.log( err, data )
	    })

</div>
<br>
<div class="code">

	// Deprecated ways to deleting an attribute
	DynamoDB
		.table('messages')
		.where('to').eq('user1@test.com')
		.where('date').eq( 1375538399 )
		.update({
			seen: undefined,
			subject: undefined
		}, function(err) {})

</div>
<br>
<div class="code">

	DynamoDB
		.table('messages')
		.where('to').eq('user1@test.com')
		.where('date').eq( 1375538399 )
		.delete(['seen','subject'], function( err, data ) {
			console.log( err, data )
		})

</div>
</div>