
describe('replace()', function () {
	it('.where(hash).eq(wrongtype ) - should fail', function(done) {
		DynamoDB
			.table($tableName)
			.replace({
				hash: 1,
				range: 1,
				key: 'value'
			}, function(err, data) {
				if (err)
					return done()

				throw {error: 'should fail'}
			})
	})

	it('should fail if we try to replace GSI index range key with the wrong type', function(done) {
		DynamoDB
			.table($tableName)
			.replace({
				hash: 'hash',
				range: 1,
				gsi_range: 1
			}, function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
	})
	it('should fail if we try to replace an inexistent item', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq()
			.where('range').eq(1)
			.replace({
				hash: 'hash999',
				range: 1,
			}, function(err, data) {
				if (err)
					done()
				else
					throw {error: 'should fail'}
			})
	})



	it('.replace()', function(done) {
		// insert
		DynamoDB.table($tableName).insert({hash: 'hash1',range:1, old_number: 1, old_array: [1,2,3], string: 'aaa', 'ignore': 'me', 'delete': 'me'}, function(err) {
			if (err)
				throw err

			DynamoDB
				.table($tableName)
				.replace({
					hash: 'hash1',
					range: 1,
					gsi_range: 'b',
					string: 'newstring',
					null: null,
					old_array: [ 1, 'a', null, { k1: 'v1', k2: 'v2', k3: 'v3' }, [] ],
					object: { key1: 'value1', key2: 22 },
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

								assert.deepEqual(data, {
									hash: 'hash1',
									range: 1,
									old_array: [ 1, 'a', null, { k3: 'v3', k1: 'v1', k2: 'v2' }, [] ],
									string: 'newstring',

									null: null,
									gsi_range: 'b',
									object: { key2: 22, key1: 'value1' },
								})
								done()
							})
				})
		})
	})
	it('test ALL_OLD  on replace existing item', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.ALL_OLD)
			.replace({
				hash: 'hash1',
				range: 1,
				string: 'aaa',
			}, function(err, data ) {
				if (err) throw err

				assert.deepEqual(data, { hash: 'hash1',
					null: null,
					range: 1,
					gsi_range: 'b',
					object: { key2: 22, key1: 'value1' },
					old_array: [ 1, 'a', null, { k3: 'v3', k1: 'v1', k2: 'v2' }, [] ],
					string: 'newstring'
				})
				done()
			})
	})
	it('.replace().then()', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.ALL_OLD)
			.replace({
				hash: 'hash1',
				range: 1,
				key: 'promise1'
			})
			.then(function(data) {
				done()
			})
	})
	it('.replace() - unhandled', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.ALL_OLD)
			.replace({
				hash: 'hash1',
				range: 1,
				key: 'promise2'
			})
		setTimeout(function() {
			done()
		},5000)
	})
	it('.replace().catch()', function(done) {
		DynamoDB
			.table($tableName)
			.replace({
				hash: 'promise',
				range: 1,
			})
			.catch(function(err) {
				done()
			})
	})
	it('.replace().then(,errorHandler)', function(done) {
		DynamoDB
			.table($tableName)
			.replace({
				hash: 'promise',
				range: 1,
			})
			.then( null, function(err) {
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
