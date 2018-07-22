<div class="content">
<a name="update"></a>
<br>
<div class="code">

	// update multiple attributes in a HASH table
	DynamoDB
		.table('users')
		.where('email').eq('test@test.com')
		.return(DynamoDB.ALL_OLD)
		.update({
			password: 'qwert',
			name: 'Smith',
			active: true,
			subscription: null,

			// increment
			page_views: DynamoDB.add(5),

			list: [5,'a', {}, [] ],

			// ADD to array (L) - not documented by AWS
			arr:  DynamoDB.add( ['x','y', false, null, {}] ),
			
			// updated as datatype SS
			string_set1: DynamoDB.SS(['sss','bbb','ccc']), 
			string_set2: new Set(['sss','bbb','ccc']), 

			// updated as datatype NS
			number_set1: DynamoDB.NS([111,222,333]), 
			number_set2: new Set([[111,222,333]]),

			// updated as datatype L
			list1: [7,9,15], 
			list2: new Set([]),
			list3: new Set([ 'a', 1 ]),


			// ADD to StringSet and NumberSet, will only keep unique values
			ss1:  DynamoDB.add( DynamoDB.SS(['aaa','ddd']) ),
			ns1:  DynamoDB.add( DynamoDB.NS([11,44]) ),

			// delete from StringSet and NumberSet
			ss2:  DynamoDB.del( DynamoDB.SS(['bbb']) ),
			ns2:  DynamoDB.del( DynamoDB.NS([22]) ),

			// delete from Array (L) not supported by Amazon

			// delete attribute
			unneeded_attribute: DynamoDB.del(),

		}, function( err, data ) {

		});

</div>
<br><br>

SQL version does not currently support adding / removing from StringSet or NumberSet. (Awspilot limitation).<br>


<br>
<div class="code">

	DynamoDB.query(`

		UPDATE
			users
		SET
			active          = true,
			nulled          = null,
			updated_at      = 1468137844,
			
			/* delete attribute */
			activation_code = undefined,
			
			/* increment attribute */
			login_count    += 1,

			/* decrement attribute */
			days_left    += -1,

			list            = ['a',1,true, null, {}, [] ],
			map             = {
				nonkeyword = 'value1',
				"sqlkeyword1" = 'value2',
				'sqlkeyword2' = 'value3'
			},
			tags            = new StringSet(['dev','nodejs']),
			lucky_numbers   = new NumberSet([ 12, 23 ]),
			
			/* evaluated to String or Number when parsed  */
			expire_at       =  new Date( 1530723266352 ).getTime()

		WHERE
			domain = 'test.com' AND user = 'testuser'

	`, function(err) {
		
	});

</div>
</div>