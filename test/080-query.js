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

describe('query', function () {
    it('should fail when table name is wrong', function(done) {
		DynamoDB
			.table('inexistent-table')
			.query( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
    it('should fail when no .where() is specified', function(done) {
		DynamoDB
			.table($tableName)
			.query( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
    it('should fail when HASH has wrong type', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq(5)
			.query( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
    it('should fail when querying without HASH .eq()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').gt('aaa')
			.query( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})

    it('.where(RANGE).le()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').le(99)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 3)
					throw err

				done()
			})
	})
    it('.where(RANGE).lt()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').lt(99)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw err

				done()
			})
	})
    it('.where(RANGE).ge()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').ge(2)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw err

				done()
			})
	})
    it('.where(RANGE).gt()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').gt(2)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 1)
					throw err

				done()
			})
	})
    it('.where(RANGE).between()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').between(2,99)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw err

				done()
			})
	})

	/* @todo: test begin with for RANGE type NUMBER
    it('.where(RANGE).begins_with()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').begins_with(9)
			.query( function(err, data) {
				if (err)
					console.log(err)

				if (data.length !== 2)
					throw err

				done()
			})
	})
	*/


	it('.having(atribute).le()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.having('number').le(2)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw { errorMessage: 'results should be 2 but is ' + data.length }

				done()
			})
	})
    it('.having(atribute).lt()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.having('number').lt(99)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw err

				done()
			})
	})
    it('.having(atribute).ge()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.having('number').ge(2)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw err

				done()
			})
	})
    it('.having(atribute).gt()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.having('number').gt(2)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 1)
					throw err

				done()
			})
	})
    it('.having(atribute).between()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.having('number').between(2,99)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw err

				done()
			})
	})
    it('.having(attribute).ne()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.having('number').ne(99)
			.query( function(err, data) {
				if (err)
					console.log(err)

				if (data.length !== 2)
					throw err

				done()
			})
	})


	it('.having(attribute).defined()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.having('null').defined()
			.query( function(err, data) {
				if (err)
					console.log(err)

				if (data.length !== 1)
					throw err

				done()
			})
	})

	it('.having(attribute).undefined()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.having('null').undefined()
			.query( function(err, data) {
				if (err)
					console.log(err)

				if (data.length !== 2)
					throw err

				done()
			})
	})
	// @todo: contains, not_contains, in (for type SET )

})
