#aws-dynamodb
=================
Wrapper around aws-sdk for nodejs to simplify working with DynamoDB

**Installation**

	npm install aws-dynamodb

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
			created_at: new Date().getTime()
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

**Update Item** ( does not create the item if item does not exist )

	// update multiple attributes in a HASH table
	DynamoDB
		.table('users')
		.where('email','test@test.com')
		.update({
			password: 'qwert', 
			firstname: 'Smith'
		}, function( err, data ) {
			console.log( err, data )
		})
	
	// update 1 attribute in a HASH-RANGE table
	DynamoDB
		.table('messages')
		.where('to','user1@test.com')
		.where('date',1375538399)
		.update({
			seen: "yes"
		}, function( err, data ) {
			console.log( err, data )
		})

**Query**
( only possible on HASH and RANGE tables) 

	// base query, return 10 records
	DynamoDB
		.table('statistics')
		.where('domain','mydomain.com')
		.limit(10)
		.query(function(err, data ) {
			console.log(err,data)
		})

	// only return specified fields and limit to 10 results
	DynamoDB
		.table('statistics')
		.select('unique_visitors','unique_pageviews')
		.where('domain','mydomain.com')
		.where('day','GE','2013-11-01')
		.query(function( err, data ) {
			console.log( err, data )
		})
	
#Tables referenced in the samples

Table **users** with HASH key only 

	email `hash` | password | created_at
	--- | --- | ---
	**test@test.com** | test123 | *1375538399*


Table **messages** with HASH and RANGE (int) key

to `hash` | date `range` | from | subject | message_body 
--- | --- | --- | --- | ---
**user1@test.com** | **1375538399** | user2@test.com | Hello User1 | Goodbye User1
**user2@test.com** | **1384167887** | somebody@otherdomain.com | Foo | Bar


Table **statistics** with HASH and RANGE (string) key

site `hash` | day `range` | visitors | unique_visitors | pageviews | unique_pageviews
--- | --- | --- | --- | --- | ---
**mydomain.com** | **2013-11-01 21:00:00** | 100 | 50 | 200 | 150
**mydomain.com** | **2013-11-01 23:00:00** | 90 | 40 | 100 | 95

