
var expect = require('chai').expect
var DynamoDB = require('../lib/dynamodb')()
DynamoDB.on('error', function(op, error, payload ) {
	//console.log(op,error,payload)
})
DynamoDB.on('beforeRequest', function(op, payload ) {
	//console.log("--------------------------------")
	//console.log(op,payload)
})
var $tableName = 'test_hash_range'

describe('client.deleteTable (test_hash_range)', function () {
    it('should not exist after deletion', function(done) {
		DynamoDB
			.client
			.describeTable({
				TableName: $tableName
			}, function(err, data) {
				if (err) {
					if (err.code === 'ResourceNotFoundException')
						done()
					else
						throw 'could not describe table'
				} else {
					DynamoDB
						.client
						.deleteTable({
							TableName: $tableName
						}, function(err, data) {
							if (err)
								throw 'delete failed'
							else
								done()
						})
				}
			})
    });
})
describe('waiting for table to delete', function () {
	it('should delete within 25 seconds', function(done) {
		var $existInterval = setInterval(function() {
			DynamoDB
				.client
				.describeTable({
					TableName: $tableName
				}, function(err, data) {

					if (err && err.code === 'ResourceNotFoundException') {
						clearInterval($existInterval)
						return done()
					}
					if (err) {
						clearInterval($existInterval)
						throw err
					}

					if (data.TableStatus === 'DELETING')
						process.stdout.write('.')
				})
		}, 1000)
	})
})
