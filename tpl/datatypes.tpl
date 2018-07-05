<a name="datatypes"></a>
<h1>DynamoDB data types supported by aws-dynamodb</h1>
<p> Please note binary data types BS is not supported yet.</p>
<p> Binary data type B is supported only as of 0.1.62</p>
<div class="code">

	DynamoDB
		.table($tableName)
		.insert({
			// String
			string1: 'string',
			string2: DynamoDB.S('string'),

			// Number
			number1: 1,
			number2: DynamoDB.N(1),

			// Boolean
			bool1: true,

			// Null
			null: null,

			// Buffer (B)
			buff: new Buffer('test'),

			// Array (L)
			array1: [1,[],true,{}],
			array2: DynamoDB.L([1,[],true,{}]),

			// Array of unique numbers numberSet (NS)
			number_set: DynamoDB.NS([111,222,333]),

			// Array or unique strings stringSet (SS)
			string_set: DynamoDB.SS(['aaa','bbb','ccc']),

			// Object key-value Map (M)
			object: {
				prop1: 1,
				prop2: '2',
				prop3: true,
				prop4: null,
				prop5: {},
				prop6: [],
				prop7: new Buffer('test')
			},

		})

</div>



<a name="operations"></a>
<h1>Operations on supported data types</h1>
<div class="code">

	DynamoDB
		.table($tableName)
		.where(..)
		.update({
			// delete an iteam of any data type
			any_item: DynamoDB.del(),

			// increment a number (N), use minus (-) to decrement
			number1: DynamoDB.add(),
			number2: DynamoDB.add(5),
			number3: DynamoDB.add(DynamoDB.N(5)),

			// add elements to an Array (L)
			array1: DynamoDB.add([1,[],{},null,'string']),
			array2: DynamoDB.add(DynamoDB.L([1,[],{},null,'string'])),

			// removing elements from an Array is not supported by AWS

			// adding properties to an Object (M) is not supported

			// deleting properties from an Object (M) is not supported

			// adding elements to a stringSet (SS)
			string_set: DynamoDB.add(DynamoDB.SS(['aaa','bbb'])),

			// removing elements from a stringSet (SS)
			string_set: DynamoDB.del(DynamoDB.SS(['aaa','bbb'])),

			// adding elements to a numberSet (NS)
			number_set: DynamoDB.add(DynamoDB.NS([111,222])),

			// removing elements from a numberSet (NS)
			number_set: DynamoDB.del(DynamoDB.NS([111,222])),
		})
</div>