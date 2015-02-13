[![npm page](https://nodei.co/npm/aws-dynamodb.png?downloads=true)](https://www.npmjs.com/package/aws-dynamodb)

#aws-dynamodb
Wrapper around aws-sdk for nodejs to simplify working with DynamoDB

**Installation**

	npm install aws-dynamodb
	
	// check for new versions
	npm outdated 
	
	// upgrade if necessary
	npm update aws-dynamodb
	

**Initialization**

	var $credentials = {
		"accessKeyId": "XXXXXXXXXXXXXXXX", 
		"secretAccessKey": "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", 
		"region": "eu-west-1"
	}

	var DynamoDB = require('aws-dynamodb')($credentials)

**Doing raw calls to aws-sdk**

	DynamoDB.client.listTables(function(err, data) {
		console.log(data.TableNames);
	});
	console.log( DynamoDB.client )

**Insert Item** ( does not replace existing items )

	DynamoDB
		.table('users')
		.insert({
			email: 'test@test.com',
			password: 'qwert',
			created_at: new Date().getTime(),
			updated_at: null
		}, function(err,data) {
			console.log( err, data )
		})
	
	DynamoDB
		.table('messages')
		.insert({
			to: 'test@test.com',
			date: new Date().getTime(),
			subject: 'Foo',
			message: 'Bar'
		})

	// insert item with nested attributes
	// carefull though as foo.bar domain actually exist :)
	DynamoDB
		.table('messages')
		.insert({
			to: 'test@test.com',
			date: new Date().getTime(),
			boolean_true: true,
			boolean_false: false,
			key_null: null,
			string: "string",
			number: 1,
			array_empty: [],
			array_strings: ['alfa','beta','gama'],
			array_numbers: [7,9,15],
			array_mixed: [null, "string", 5, true, false, { key: "value"}, ["nested","array"] ],
			nested_object: {
				name: "Foo",
				email: "baz@foo.bar",
				nested_attribute: {
					boolean_value: true,
					null_key: null,
					some_string: "tadaa",
					lucky_number: 12
				}
			}
		})


**Update Item** ( does not create the item if item does not exist )

	// update multiple attributes in a HASH table
	DynamoDB
		.table('users')
		.where('email').eq('test@test.com')
		.update({
			password: 'qwert', 
			firstname: 'Smith'
		}, function( err, data ) {
			console.log( err, data )
		})
	
	// update 1 attribute in a HASH-RANGE table
	DynamoDB
		.table('messages')
		.where('to').eq('user1@test.com')
		.where('date').eq( 1375538399 )
		.update({
			seen: true
		}, function( err, data ) {
			console.log( err, data )
		})

**Replace Item** ( does not create the item if item does not exist )
	
	// completely replaces the item, new item will only contain specified attributes 
	DynamoDB
		.table('users')
		.replace({
			email: 'test@test.com',
			password: 'qwert',
			created_at: new Date().getTime()
		}, function(err,data) {
			console.log( err, data )
		})

**Insert on Duplicate Key Update** ( in 1 request to DynamoDB )

	DynamoDB
		.table('users')
		.where('email').eq('test@test.com')
		.insert_or_update({
			password: 'qwert', 
			firstname: 'Smith'
		}, function( err, data ) {
			console.log( err, data )
		})

**Increment Item's Attribute(s)** ( does not create the item if item does not exist )

	// increment 1 attribute in a HASH table 
	DynamoDB
		.table('users')
		.where('email').eq('test@test.com')
		.increment({
			login_count: 1
		}, function( err, data ) {
			console.log( err, data )
		})
		
	// increment multiple attributes in a HASH-RANGE table
	DynamoDB
		.table('statistics')
		.where('domain').eq('mydomain.com')
		.where('day').eq('2013-11-01')
		.increment({
			visitors: 1,
			page_views 5,
			unique_page_views: 1
		}, function( err, data ) {
			console.log( err, data )
		})

**Delete Item's Attribute(s)**

	DynamoDB
		.table('messages')
		.where('to').eq('user1@test.com')
		.where('date').eq( 1375538399 )
		.delete(['seen','subject'], function( err, data ) {
			console.log( err, data )
		})

**Delete Item**

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
		.delete(function( err, data ) {
			console.log( err, data )
		})

**Get Item**

	// getting an item with HASH key only
	DynamoDB
		.table('users')
		.where('email').eq('test@test.com')
		.get(function( err, data ) {
			console.log( err, data )
		})

	// getting an item from a HASH-RANGE table, with consistent read
	DynamoDB
		.table('messages')
		.where('to').eq('user1@test.com')
		.where('date').eq( 1375538399 )
		.consistent_read()
		.get(function( err, data ) {
			console.log( err, data )
		})

	// specifying what attributes to return
	DynamoDB
		.table('users')
		.select('email','registered_at')
		.where('email').eq( 'test@test.com' )
		.get(function( err, data ) {
			console.log( err, data )
		})
		
**Query** ( not possible on HASH only tables )

	// for hash key comparson operator is always eq()
	// for range key you can specify: le() , lt() , ge() , gt() , begins_with() , between(a,b)

	// base query, return 10 records with consistent read
	DynamoDB
		.table('statistics')
		.where('domain').eq('mydomain.com')
		.limit(10)
		.consistent_read()
		.query(function(err, data ) {
			console.log(err,data)
		})

	// only return specified fields, in descending order
	DynamoDB
		.table('statistics')
		.select('unique_visitors','unique_pageviews')
		.where('domain').eq('mydomain.com')
		.where('day').ge('2013-11-01')
		.descending()
		.query(function( err, data ) {
			console.log( err, data )
		})
	
**Query an Index with order_by()**

	// suppose you have an index on messages called starredIndex
	// and you want to retrieve only the messages that are starred

	DynamoDB
		.table('messages')
		.where('to').eq('user1@test.com')
		.order_by('starredIndex')
		.descending()
		.query(function( err, data ) {
			console.log( err, data )
		})

	// return all attributes including non-projected ( LSI only )
	DynamoDB
		.table('messages')
		.select( DynamoDB.ALL )
		.where('to').eq('user1@test.com')
		.order_by('starredIndex')
		.descending()
		.query(function( err, data ) {
			console.log( err, data )
		})
	
	// NOTE: specifying non-projected fields in select() will:
	// * cost you extra reads on a LSI index
	// * not be returned on a GSI index

**Query filtering**

	// A filter lets you apply conditions to the data after query
	// Only the items that meet your conditions are returned
	// All the conditions must evaluate to true ( conditions are ANDed together )
	// Comparison operators: eq(), le() , lt() , ge() , gt() , begins_with() , between(a,b)
	DynamoDB
		.table('messages')
		.where('to').eq('user1@test.com')
		.having('one_attribute').between(100,200)
		.having('other_attribute').eq(true)
		.query(function( err, data ) {
			console.log( err, data )
		})

**Full table scan** 

	// optionally you can limit the returned attributes with .select()
	// and the number of results with .limit()

	DynamoDB
		.table('messages')
		.select('from','subject')
		.having('somkey').eq('somevalue')
		.limit(10)
		.scan(function( err, data ) {
			console.log( err, data )
		})

	// NOTE: specifying non-projected fields in select() will:
	// * cost you extra reads on a LSI index
	// * not be returned on a GSI index


#Tables referenced in the samples

Table **users** with HASH key only 

email `hash` | password | created_at
--- | --- | ---
**test@test.com** | test123 | *1375538399*


Table **messages** with HASH and RANGE (int) key

to `hash` | date `range` | from | subject | message_body | starred
--- | --- | --- | --- | ---
**user1@test.com** | **1375538399** | user2@test.com | Hello User1 | Goodbye User1 | 1
**user2@test.com** | **1384167887** | somebody@otherdomain.com | Foo | Bar |


Table **statistics** with HASH and RANGE (string) key

site `hash` | day `range` | visitors | unique_visitors | pageviews | unique_pageviews
--- | --- | --- | --- | --- | ---
**mydomain.com** | **2013-11-01 21:00:00** | 100 | 50 | 200 | 150
**mydomain.com** | **2013-11-01 23:00:00** | 90 | 40 | 100 | 95

