
describe('.table().describe()', function () {
	it('should throw error on inexistent table', function(done) {
		DynamoDB
			.table('inexistent-table')
			.describe(function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
	it('should return a valid Object for createTabe', function(done) {
		DynamoDB
			.table($tableName)
			.describe( function(err, data) {
				if (err)
					throw err
				else {
					// create table based on 1st table
					data.TableName = 'copy-' + $tableName
					DynamoDB
						.client.createTable( data, function(err,data) {
							// failed to create an identic table
							if (err)
								throw err
							else
								done()
						} )
				}
			})
	})
	it('waiting for temporary table to become active', function(done) {
		var $existInterval = setInterval(function() {
			DynamoDB
				.client
				.describeTable({
					TableName: 'copy-' + $tableName
				}, function(err, data) {
					if (err) {
						clearInterval($existInterval)
						throw err
					} else {
						if (data.Table.TableStatus === 'ACTIVE') {
							clearInterval($existInterval)
							done()
						}
					}
				})
		}, 3000)
	})
	it('deleting copy of temporary table from previous test', function(done) {
		DynamoDB
			.client
			.describeTable({
				TableName: 'copy-' + $tableName
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
							TableName: 'copy-' + $tableName
						}, function(err, data) {
							if (err)
								throw 'delete failed'
							else
								done()
						})
				}
			})
	});
	it('waiting for temporary table to delete', function(done) {
		var $existInterval = setInterval(function() {
			DynamoDB
				.client
				.describeTable({
					TableName: 'copy-' + $tableName
				}, function(err, data) {

					if (err && err.code === 'ResourceNotFoundException') {
						clearInterval($existInterval)
						return done()
					}
					if (err) {
						throw err
						return
					}
					if (data.TableStatus === 'DELETING')
						process.stdout.write('.')
				})
		}, 3000)
	})
})
