return
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

describe('scan', function () {
    it('should fail when table name is wrong', function(done) {
		DynamoDB
			.table('inexistent-table')
			.scan( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})

    it('should return 2 items', function(done) {
		DynamoDB
			.table($tableName)
			.scan( function(err, data) {
				if (err)
					throw err
				else {
					if (data.length !== 3)
						throw 'should be length: 3'
					else
						done()
				}

			})
	})
    //it('.having(atribute).gt()', function(done) {
	//	DynamoDB
	//		.table('domains')
	//		.having('quota_used').gt(0)
	//		.scan( function(err, data) {
	//			console.log("err:", err )
	//			console.log("domains:",data.length)
	//			done()
	//			//if (err)
	//			//	throw err
	//			//else {
	//			//	if (data.length !== 3)
	//			//		throw 'should be length: 3'
	//			//	else
	//			//		done()
	//			//}
	//
	//		})
	//})

})


describe('GSI scan', function () {
    it('should fail when index name is wrong', function(done) {
		DynamoDB
			.table('inexistent-table')
			.index('gsi_index')
			.scan( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})

    it('should return 1 item', function(done) {
		DynamoDB
			.table($tableName)
			.index('gsi_index')
			.scan( function(err, data) {
				if (err)
					throw err
				else {
					if (data.length !== 1)
						throw 'should be length: 1 but is ' + data.length
					else
						done()
				}

			})
	})
})
