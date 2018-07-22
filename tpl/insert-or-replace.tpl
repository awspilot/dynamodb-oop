<div class="content">

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



<br>
<div class="code">

	DynamoDB.query(`

		REPLACE INTO 
			users
		SET
			email          =  'test@test.com',

			updated_at     = 1530709469085,
			last_login_at  = null,
			active         = true,
			a_list         = [
				'a',
				1,
				true,
				null
			],
			a_object       = { 
				'string': 'text',
				'number': 1,
				'bool'  : true,
				'null'  : null, 
			},
			ss = new StringSet(['a','b','c']), 
			ns = new NumberSet([1,2,3]),
			
			/* evaluated to String or Number when parsed  */
			expire_at =  new Date( 1530723266352 ).getTime()

	`, function( err ){
		
	});

</div>
</div>