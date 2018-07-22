
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

			// inserted as datatype SS
			string_set1: DynamoDB.SS(['sss','bbb','ccc']), 
			string_set2: new Set(['sss','bbb','ccc']), 

			// inserted as datatype NS
			number_set1: DynamoDB.NS([111,222,333]), 
			number_set2: new Set([[111,222,333]]),

			// inserted as datatype L
			list1: [7,9,15], 
			list2: new Set([]),
			list3: new Set([ 'a', 1 ]),

			created_at: new Date().getTime()
		}, function(err,data) {

		});

</div>
<br><br>


