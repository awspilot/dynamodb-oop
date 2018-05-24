<a name="initialization"></a>
<h1>Init</h1>
<div class="code">
var $credentials = {
    "accessKeyId": "XXXXXXXXXXXXXXXX",
    "secretAccessKey": "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
    "region": "eu-west-1"
}
var DynamoDB = require('@awspilot/dynamodb')($credentials)

// Alternatively, use an existing instance of AWS.DynamoDB.
var AWS = require('aws-sdk');
var $db = new AWS.DynamoDB();
var DynamoDB = require('@awspilot/dynamodb')($db);
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
<div class="code">
	DynamoDB
		.table()
		.method(parameters)
		.then( callback_if_success, callback_if_failed )
		.catch( callback_if_failed )
</div>