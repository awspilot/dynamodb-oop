
<a name="get"></a>
<h1>Get Item</h1>
<p></p>
<div class="code">

	// getting an item with HASH key only
	DynamoDB
	    .table('users')
	    .where('email').eq('test@test.com')
	    .get(function( err, data ) {

	    });

</div>
<br>
<div class="code">

	// getting an item from a HASH-RANGE table, with consistent read
	DynamoDB
	    .table('messages')
	    .where('to').eq('user1@test.com')
	    .where('date').eq( 1375538399 )
	    .consistent_read()
	    .get(function( err, data ) {

	    });

</div>
<br>
<div class="code">

	// specifying what attributes to return
	DynamoDB
	    .table('users')
	    .select('email','registered_at','object.attribute','string_set[0]','array[1]')
	    .where('email').eq( 'test@test.com' )
	    .get(function( err, data ) {

	    });

</div>