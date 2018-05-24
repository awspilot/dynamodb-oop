
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