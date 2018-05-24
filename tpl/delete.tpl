
<a name="deleteitem"></a>
<h1>Delete Item</h1>
<p>delete() does not fail if the item does not exist</p>
<div class="code">
// delete an item from a HASH table
DynamoDB
    .table('users')
    .where('email').eq( 'test@test.com' )
    .delete(function( err, data ) {
        console.log( err, data )
    })

// delete an item from a HASH-RANGE table
DynamoDB
    .table('messages')
    .where('to').eq( 'user1@test.com' )
    .where('date').eq( 1375538399 )
	.return(DynamoDB.ALL_OLD)
    .delete(function( err, data ) {
        console.log( err, data )
    })
</div>
