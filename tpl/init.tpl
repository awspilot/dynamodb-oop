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