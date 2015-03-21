
var expect = require('chai').expect
var DynamoDB = require('aws-dynamodb')()

describe('describeTable', function () {
    it('should throw error on inexistent table', function(done) { // added "done" as parameter
		DynamoDB
			.client
			.describeTable({
				TableName: 'inexistent-table'
			}, function(err, data) {
				if (err)
					done()
				else
					throw err
			})
    });

    it('should return table data', function(done) { 
		DynamoDB
			.client
			.describeTable({
				TableName: 'hash_range'
			}, function(err, data) {
				if (err)
					throw err
				else {
					expect(data).to.have.property('Table')
					expect(data.Table).to.have.property('KeySchema')
					done()
				}
			})
    })
})

describe('insert', function () {
    it('should fail if missing RANGE', function(done) { 
		DynamoDB
			table('hash_range')
			.insert({
				hash: 'hash1'
			}, function(err, data) {
				if (err)
					done()
				else
					throw err
			})
    })
    it('should fail if missing HASH', function(done) { 
		DynamoDB
			table('hash_range')
			.insert({
				range: 1
			}, function(err, data) {
				if (err)
					done()
				else
					throw err
			})
    })
    it('should fail if HASH is wrong type', function(done) { 
		DynamoDB
			table('hash_range')
			.insert({
				hash: 1,
				range: 1
			}, function(err, data) {
				if (err)
					done()
				else
					throw err
			})
    })
    it('should fail if RANGE is wrong type', function(done) { 
		DynamoDB
			table('hash_range')
			.insert({
				hash: 'hash1',
				range: 'xxx'
			}, function(err, data) {
				if (err)
					done()
				else
					throw err
			})
    })
	
    it('should fail if GSI RANGE is wrong type', function(done) { 
		DynamoDB
			.table('hash_range')
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.delete(function( err, data ) {
				DynamoDB
					table('hash_range')
					.insert({
						hash: 'hash1',
						range: 1,
						gsi_range: 1
					}, function(err, data) {
						if (err)
							done()
						else
							throw err
					})
			})
    })	
	
    it('should insert when item does not exist', function(done) { 
		DynamoDB
			.table('hash_range')
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.delete(function( err, data ) {
				
				DynamoDB
					table('hash_range')
					.insert({
						hash: 'hash1',
						range: 1,
						gsi_range: 'a'
					}, function(err, data) {
						if (err)
							throw err
						else
							DynamoDB
								table('hash_range')
								.insert({
									hash: 'hash1',
									range: 2
								}, function(err, data) {
									// is ok if it fails since this would be a duplicate when executing 2nd time
									// we just want this item present in the database
									done()
								})
						
					})
					

			})
    })
	
    it('should fail when item already exists', function(done) { 	
		DynamoDB
			table('hash_range')
			.insert({
				hash: 'hash1',
				range: 1
			}, function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})

})



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
			.table('hash_range')
			.scan( function(err, data) {
				if (err)
					throw err
				else {
					if (data.length !== 2)
						throw 'should be length: 2'
					else
						done()
				}
					
			})
	})	
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
			.table('hash_range')
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


// @todo: update, scan, replace, query, query lsi, query gsi, delete item, delete item attributes, create table
