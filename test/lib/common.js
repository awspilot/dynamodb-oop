
async = require('async')
assert = require('assert')
DynamoDB = require('../../lib/dynamodb')()
DynamoDB.on('error', function(op, error, payload ) {
	//console.log(op,error,payload)
})
DynamoDB.on('beforeRequest', function(op, payload ) {
	//console.log("--------------------------------")
	//console.log(op,payload)
})
$tableName = 'test_hash_range'
