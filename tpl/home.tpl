<div class="content">

<h1>@Awspilot's DynamoDB</h1>

<span class="octicon octicon-link">Speak fluent DynamoDB, write code with fashion, I Promise() 😃</span>

<p style='color: #666666;'>

	<br>

	<a href='https://travis-ci.org/awspilot/dynamodb-oop' target="_blank"><img src='https://travis-ci.org/awspilot/dynamodb-oop.svg?branch=master'/></a>
	<a href='https://badge.fury.io/js/%40awspilot%2Fdynamodb' target="_blank"><img src='https://badge.fury.io/js/%40awspilot%2Fdynamodb.svg' /></a>

	<a href='https://www.npmjs.com/package/@awspilot/dynamodb' target="_blank"><img src='https://img.shields.io/npm/dm/@awspilot/dynamodb.svg?maxAge=2592000' /></a>
	<a href='https://www.npmjs.com/package/@awspilot/dynamodb' target="_blank"><img src='https://img.shields.io/npm/dy/@awspilot/dynamodb.svg?maxAge=2592000' /></a>
	<a href='https://www.npmjs.com/package/@awspilot/dynamodb' target="_blank"><img src='https://img.shields.io/npm/dt/@awspilot/dynamodb.svg?maxAge=2592000' /></a>

	<a href='https://github.com/awspilot/dynamodb-oop' target="_blank"><img src='https://img.shields.io/github/license/awspilot/dynamodb-oop.svg' /></a>


	<a href='https://david-dm.org/awspilot/dynamodb-oop' target="_blank"><img src='https://david-dm.org/awspilot/dynamodb-oop.svg' /></a>

</p>

<p>
	@awspilot/dynamodb is a NodeJS and Browser utility to access Amazon DynamoDB databases<br>

	Main library goals are:<br>
	<li> Compatible with all NodeJS versions ( no ES6+ )
	<li> Backword compatible with all previous versions
	<li> Lightweight ( depends only on aws-sdk and promise )
	<li> Good readability of the code

</p>



<h1>Install in NodeJS</h1>

<div class="code bash">

	npm install @awspilot/dynamodb

	// check for new versions
	npm outdated

	// upgrade if necessary
	npm update @awspilot/dynamodb

</div>

<h1>Install in Browser</h1>

<p>
	Please use <a href="https://rawgit.com/ ">rawgit</a> CDN, to get the latest version paste the url:<br>
	https://github.com/awspilot/dynamodb-oop/blob/master/dist/dynamodbjs.js
</p>
<div class="code html">

	&lt;!DOCTYPE html>
	&lt;html>
		&lt;head>
			&lt;script src="https://sdk.amazonaws.com/js/aws-sdk-2.247.1.min.js">&lt;/script>
			&lt;script src="https://rawgit.com/awspilot/dynamodb-oop/master/dist/dynamodbjs.js">&lt;/script>
		&lt;/head>
		&lt;body>
		&lt;/body>
	&lt;/html>

</div>

<br><br>

<h1>Include in NodeJS</h1>
<div class="code">

	var credentials = {
		"accessKeyId": "XXXXXXXXXXXXXXXX",
		"secretAccessKey": "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
		"region": "eu-west-1"
	}

	const DynamodbFactory = require('@awspilot/dynamodb')
	var DynamoDB = new DynamodbFactory(credentials)


	// Alternatively, use an existing instance of AWS.DynamoDB.
	var AWS = require('aws-sdk');
	var $db = new AWS.DynamoDB();
	const DynamodbFactory = require('@awspilot/dynamodb')
	var DynamoDB = new DynamodbFactory($db);

</div>




<h1>Include in Browser</h1>
<div class="code">

	var credentials = {
		"accessKeyId": "XXXXXXXXXXXXXXXX",
		"secretAccessKey": "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
		"region": "eu-west-1"
	}

	var dynamo = new AWS.DynamoDB( credentials ) // aws-sdk
	var DynamoDB = new window['@awspilot/dynamodb'](dynamo)

</div>


<h1>Response</h1>
<p>If a callback function is supplied, the response will be returned as callback(error, data)</p>
<p>If no callback function is supplied, <a href="https://www.npmjs.com/package/promise" target="_blank">Promise</a> will be returned </p>

<div class="code">

	DynamoDB
		.table()
		.method(parameters, function( err, response ) {

		})

</div>

<br><br>

<div class="code">

	DynamoDB
		.table()
		.method(parameters)
		.then( callback_if_success, callback_if_failed )
		.catch( callback_if_failed )

</div>

<br>

<a name="capacity"></a>
<h1>Consumed Capacity</h1>
<p> TOTAL consumed capacity is returned by default </p>
<div class="code">

	DynamoDB
		.table($tableName)
		.operation(parameters, function callback() {
			console.log(this.ConsumedCapacity)
		})

	// you can override it using
	DynamoDB
		.table($tableName)
		.return_consumed_capacity('INDEXES') // 'TOTAL' | 'INDEXES' | NONE
		.operation(parameters, function (err,data) {
			console.log(this.ConsumedCapacity)
		})

</div>



<br><br>


<a name="errorfeed"></a>
<h1>Global error feed</h1>
<div class="code">

	// every call to Amazon DynamoDB that fails will
	// call this function before the operation's callback
	DynamoDB.on('error', function( operation, error, payload ) {
		// you could use this to log call fails to LogWatch or
		// insert into SQS and process it later
	})

</div>

<br>
<a name="rawcalls"></a>
<h1>Raw Calls to aws sdk</h1>
<br>
<div class="code">

	DynamoDB.client.listTables(function(err, data) {
		console.log(data.TableNames);
	});
	console.log( DynamoDB.client )

</div>
</div>
