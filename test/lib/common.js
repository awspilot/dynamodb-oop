
async = require('async')
assert = require('assert')
$tableName = 'test_hash_range'

var dynalite = require('dynalite'),
dynaliteServer = dynalite({ createTableMs: 50, db: require('memdown')})
dynaliteServer.listen(4567, function(err) {
	if (err) throw err
})

var AWS = require('aws-sdk')
DynamoDB = require('../../lib/dynamodb')( new AWS.DynamoDB({endpoint: 'http://localhost:4567', "accessKeyId": "akid", "secretAccessKey": "secret", "region": "us-east-1" }))

DynamoDB.on('error', function(op, error, payload ) {
	//console.log(op,error,JSON.stringify(payload))
})
DynamoDB.on('beforeRequest', function(op, payload ) {
	//console.log("--------------------------------")
	//console.log(op,payload)
})
