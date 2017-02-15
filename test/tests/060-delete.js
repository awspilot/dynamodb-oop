
describe('delete()', function () {
	it('should fail if wrong type for HASH', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq(1)
			.where('range').eq(1)
			.delete(function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
	})
	it('should fail if wrong type for RANGE', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash')
			.where('range').eq('range')
			.delete(function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
	})
	it('should deleate existing item and return it', function(done) {
		// insert
		DynamoDB.table($tableName).return(DynamoDB.ALL_OLD).insert({hash: 'hash1',range:1, old_number: 1, old_array: [1,2,3], string: 'aaa', 'ignore': 'me', 'delete': 'me'}, function(err, item ) {
			if (err)
				throw err

			DynamoDB
				.table($tableName)
				.where('hash').eq('hash1')
				.where('range').eq(1)
				.return(DynamoDB.ALL_OLD)
				.delete(function(err, data ) {
					if (err) throw err

					assert.deepEqual(data, {hash: 'hash1',range:1, old_number: 1, old_array: [1,2,3], string: 'aaa', 'ignore': 'me', 'delete': 'me'})
					done()
				})
		})
	})
	it('.delete().then()', function(done) {
		DynamoDB.table($tableName).return(DynamoDB.ALL_OLD).insert({hash: 'promise',range:1, }).then(function() {
				DynamoDB
					.table($tableName)
					.where('hash').eq('promise')
					.where('range').eq(1)
					.delete()
					.then(function(data) {
						done()
					})
		})
	})
	it('.delete() - unhandled', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq(1)
			.where('range').eq(1)
			.delete()
		setTimeout(function() {
			done()
		},5000)
	})
	it('.delete().catch()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq(1)
			.where('range').eq(1)
			.delete()
			.catch(function(err) {
				done()
			})
	})
	it('.delete().then(,errorHandler)', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq(1)
			.where('range').eq(1)
			.delete()
			.then(null,function(err) {
				done()
			})
	})
	it('cleanup...', function(done) {
		DynamoDB
			.table($tableName)
			.scan(function(err, data) {
				if (err)
					throw err
				else {
					async.each(data, function(item,cb) {
						DynamoDB.table($tableName).where('hash').eq(item.hash).where('range').eq(item.range).delete(function(err) { cb(err) })
					}, function(err) {
						if (err)
							throw err
						else
							done()
					})
				}
			})
	})
})
