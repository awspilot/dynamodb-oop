<div class="content">
<a name="deleteitem"></a>
<h1>Delete Item</h1>
<br>
<div class="code">

	// delete an item from a HASH table
	DynamoDB
		.table('users')
		.where('email').eq( 'test@test.com' )
		.delete(function( err, data ) {

		});

</div>
<br>
<div class="code">
	// delete an item from a HASH-RANGE table
	DynamoDB
		.table('messages')
		.where('to').eq( 'user1@test.com' )
		.where('date').eq( 1375538399 )
		.return(DynamoDB.ALL_OLD)
		.delete(function( err, data ) {

		});

</div>
<br>


<br>
<div class="code">

	DynamoDB.query("DELETE FROM `users` WHERE `email` = 'test@test.com'", function(err) { });

</div>

<br>
<div class="code">

	DynamoDB.query(`
		DELETE FROM 
			messages 
		WHERE 
			to   = 'user1@test.com' AND 
			date =  1375538399 
	`, function(err) { 
	
	});

</div>
</div>