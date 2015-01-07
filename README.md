#aws-dynamodb
=================

Wrapper around aws-sdk for nodejs to simplify working with DynamoDB

#Installation

	npm install aws-dynamodb

#Initialization

	var $credentials = {
		"accessKeyId": "XXXXXXXXXXXXXXXX", 
		"secretAccessKey": "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", 
		"region": "eu-west-1"
	}

	var DynamoDB = require('aws-dynamodb')($credentials)

#Usage

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

**Query** (only possible on HASH and RANGE tables)

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
		->where('day','GE','2013-11-01')
		->limit(10)
		->query()