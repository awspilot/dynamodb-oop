<div class="content">
<h1>Batch Insert</h1>
Insert with multiple items in "VALUES" is handled as <a href='https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html' target='_blank'>batchWriteItem</a>.<br> 

<br>
<div class="code">

	// if there are multiple items in VALUES then batchWriteItem is performed 
	// insert using VALUES does not currently support StringSet or NumberSet
	DynamoDB.query(`

		INSERT INTO users VALUES 
			({ email         : 'user1@test.com', active: false }),
			({ email         : 'user2@test.com', active: false }),
			({ email         : 'user2@test.com', active: true  })

		`, 
		function( err, data ) {
			
		});

</div>
</div>