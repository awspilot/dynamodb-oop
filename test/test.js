
var expect = require('chai').expect
var DynamoDB = require('aws-dynamodb')()
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
					if (err)
						throw err
					
					if (data.TableStatus === 'DELETING')
						process.stdout.write('.')
				})
		}, 1000)
	})
})


describe('client.createTable', function () {
	it('should create the table', function(done) {
		DynamoDB
			.client
			.createTable({
				TableName: $tableName,
				ProvisionedThroughput: {
					ReadCapacityUnits: 1,
					WriteCapacityUnits: 1
				},
				KeySchema: [
					{
						AttributeName: "hash",
						KeyType: "HASH"
					},
					{
						AttributeName: "range",
						KeyType: "RANGE"
					}
				],
				AttributeDefinitions: [
					{
						AttributeName: "hash",
						AttributeType: "S"
					},
					{
						AttributeName: "range",
						AttributeType: "N"
					},
					{
						AttributeName: "gsi_range",
						AttributeType: "S"
					},
				],
				"GlobalSecondaryIndexes": [
					{
						IndexName: "gsi_index",
						KeySchema: [
							{
								AttributeName: "hash",
								KeyType: "HASH"
							},
							{
								AttributeName: "gsi_range",
								KeyType: "RANGE"
							}
						],

						Projection: {
						//	"NonKeyAttributes": [
						//		"string"
						//	],
							ProjectionType: "ALL"
						},
						ProvisionedThroughput: {
							ReadCapacityUnits: 1,
							WriteCapacityUnits: 1
						}
					}
				],
				
				/*
				"LocalSecondaryIndexes": [
					{
						"IndexName": "string",
						"KeySchema": [
							{
								"AttributeName": "string",
								"KeyType": "string"
							}
						],
						"Projection": {
							"NonKeyAttributes": [
								"string"
							],
							"ProjectionType": "string"
						}
					}
				],
				*/
				
				
			}, function(err, data) {
				if (err) {
					throw err
				} else {
					if (data.TableDescription.TableStatus === 'CREATING' || data.TableDescription.TableStatus === 'ACTIVE' )
						done()
					else
						throw 'unknown table status after create: ' + data.TableDescription.TableStatus
				}
			})
	})

})


describe('waiting for table to become ACTIVE', function () {
	it('should be active within seconds', function(done) {
		var $existInterval = setInterval(function() {
			DynamoDB
				.client
				.describeTable({
					TableName: $tableName
				}, function(err, data) {
					if (err) {
						throw err
					} else {
						//process.stdout.write(".");
						//console.log(data.Table)
						if (data.Table.TableStatus === 'ACTIVE') {
							clearInterval($existInterval)
							done()
						} 
					}
				})
		}, 1000)
	})
})

describe('describeTable', function () {
    it('should throw error on inexistent table', function(done) { 
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
				TableName: $tableName
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
			table($tableName)
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
			table($tableName)
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
			table($tableName)
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
			table($tableName)
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
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.delete(function( err, data ) {
				DynamoDB
					table($tableName)
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
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.delete(function( err, data ) {
				
				DynamoDB
					table($tableName)
					.insert({
						hash: 'hash1',
						range: 1,
						gsi_range: 'a'
					}, function(err, data) {
						if (err)
							throw err
						else
							DynamoDB
								table($tableName)
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
			table($tableName)
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











describe('update', function () {
	// if missing hash and/or range will fail becauseof exist constrain	

	
    it('should fail if wrong type for HASH', function(done) { 
		DynamoDB
			table($tableName)
			.where('hash').eq(1)
			.where('range').eq(1)
			.update({
				key: 'value'
			}, function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
    })
    it('should fail if wrong type for RANGE', function(done) { 
		DynamoDB
			table($tableName)
			.where('hash').eq('hash')
			.where('range').eq('range')
			.update({
				key: 'value'
			}, function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
    })
    it('should fail if wrong type for RANGE', function(done) { 
		DynamoDB
			table($tableName)
			.where('hash').eq('hash')
			.where('range').eq('range')
			.update({
				key: 'value'
			}, function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
    })
	
    it('should fail if we try to update the RANGE key', function(done) { 
		DynamoDB
			table($tableName)
			.where('hash').eq('hash')
			.where('range').eq(1)
			.update({
				range: 2
			}, function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
    })	

    it('should fail if we try to update an inexistent item', function(done) { 
		DynamoDB
			table($tableName)
			.where('hash').eq('hash999')
			.where('range').eq(1)
			.update({
				key: 'value'
			}, function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
    })	

	// @todo: also try update gsi index with wrong type
    it('should fail if we try to update GSI index range key with the wrong type', function(done) { 
		DynamoDB
			table($tableName)
			.where('hash').eq('hash')
			.where('range').eq(1)
			.update({
				gsi_range: 1
			}, function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
    })	
	
	it('should update', function(done) { 
		DynamoDB
			table($tableName)
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.update({
				gsi_range: 'b',
				string: 'string',
				number: 1,
				null: null,
				mixed_array: [ 1, 'a', null, { k1: 'v1', k2: 'v2', k3: 'v3' }, [] ],
				object: { key1: 'value1', key2: 22 }
			}, function(err, data) {
				if (err)
					throw err
				else
					DynamoDB
						.table($tableName)
						.where('hash').eq('hash1')
						.where('range').eq(1)
						.consistentRead()
						.get(function( err, data ) {
							if (err)
								throw err
							else {
								if (data.string !== 'string' ) throw { error: 'unexpected value'}
								if (data.number !== 1 ) throw { error: 'unexpected value'}
								if (data.null !== null ) throw { error: 'unexpected value'}
								// @todo: check all values
								done()
							}
						})
					
				 
			})
    })

	it('should delete attributes when passing undefined', function(done) { 
		DynamoDB
			table($tableName)
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.update({
				string: undefined,
				number: undefined,
				null: undefined,
				mixed_array: [1,'a', null, { k1: 'v99', k2: undefined }, [] ],
				object: { key: undefined }
			}, function(err, data) {
				if (err)
					throw err
				else
					DynamoDB
						.table($tableName)
						.where('hash').eq('hash1')
						.where('range').eq(1)
						.consistentRead()
						.get(function( err, data ) {
							if (err)
								throw err
							else {
								if (data.hasOwnProperty('string')) throw { error: 'unexpected value'}
								if (data.hasOwnProperty('number')) throw { error: 'unexpected value'}
								if (data.hasOwnProperty('null')) throw { error: 'unexpected value'}
								// @todo: check the values
								done()
							}
						})
			})
    })
	
	
	
    //it('should fail if we try to update GSI index range key with the wrong type', function(done) { 
	//	DynamoDB
	//		table($tableName)
	//		.where('hash').eq('hash')
	//		.where('range').eq(1)
	//		.update({
	//			gsi_range: 1
	//		}, function(err, data) {
	//			if (err)
	//				done()
	//			else
	//				throw {error: 'should fail'}
	//		})
    //})	

	
	/*
    it('should fail if HASH is wrong type', function(done) { 
		DynamoDB
			table($tableName)
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
			table($tableName)
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
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.delete(function( err, data ) {
				DynamoDB
					table($tableName)
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
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.delete(function( err, data ) {
				
				DynamoDB
					table($tableName)
					.insert({
						hash: 'hash1',
						range: 1,
						gsi_range: 'a'
					}, function(err, data) {
						if (err)
							throw err
						else
							DynamoDB
								table($tableName)
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
			table($tableName)
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
	*/
})
















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
			.table($tableName)
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
					if (err)
						throw err
					
					if (data.TableStatus === 'DELETING')
						process.stdout.write('.')
				})
		}, 1000)
	})
})


// @todo: update, replace, query, query lsi, query gsi, delete item, delete item attributes, create table
