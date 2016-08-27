
describe('client.createTable()', function () {
	it('deleting test table if exists', function(done) {
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
	it('waiting for table to delete (within 25 seconds)', function(done) {
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
	it('creating the table', function(done) {
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
					{
						AttributeName: "account-id",
						AttributeType: "S"
					},
					{
						AttributeName: "account.id",
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
					},
					{
						IndexName: "byAccount-Id",
						KeySchema: [
							{
								AttributeName: "account-id",
								KeyType: "HASH"
							}
						],

						Projection: {
							ProjectionType: "ALL"
						},
						ProvisionedThroughput: {
							ReadCapacityUnits: 1,
							WriteCapacityUnits: 1
						}
					},
					{
						IndexName: "byAccount.Id",
						KeySchema: [
							{
								AttributeName: "account.id",
								KeyType: "HASH"
							}
						],

						Projection: {
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
	it('waiting for table to become ACTIVE', function(done) {
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
		}, 3000)
	})

})
