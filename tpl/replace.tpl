
<a name="replace"></a>
<h1>Replace Item</h1>
<p>
	<b>.replace()</b> does not create the item if item does not exist, use <a href='/pages/insert/'><b>insert_or_replace()</b></a> instead
</p>
<div class="code">
// completely replaces the item, new item will only contain specified attributes
DynamoDB
    .table('users')
	.return(DynamoDB.UPDATED_OLD)
    .replace({
        email: 'test@test.com',
        password: 'qwert',
        created_at: new Date().getTime()
    }, function(err,data) {
        console.log( err, data )
    })
</div>
<br><br>




<br>
<div class="code sql">
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
		ns = new NumberSet([1,2,3])

`, function( err ){
	
})
</div>