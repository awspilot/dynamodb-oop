
<a name="deleteitem"></a>
<h1>Delete Item</h1>

Delete is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html" target="_blank">deleteItem</a>.<br>
<br>
Does not fail if the item does not exist.<br>
<br>
Deletes a single item in a table by primary key<br>
<br>
<div class="code">

// delete an item from a HASH table
DynamoDB
	.table('users')
	.where('email').eq( 'test@test.com' )
	.delete(function( err, data ) {

	});

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

	DynamoDB.query("DELETE FROM `messages` WHERE `to` = 'user1@test.com' AND `date` =  1375538399 ", function(err) { });

</div>