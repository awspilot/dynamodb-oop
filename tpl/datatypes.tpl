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