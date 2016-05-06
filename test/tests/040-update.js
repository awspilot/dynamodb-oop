
require('./lib/common')

describe('update', function () {

	it('should fail if wrong type for HASH', function(done) {
		DynamoDB
			.table($tableName)
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
			.table($tableName)
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
			.table($tableName)
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
	it('should fail if we try to update GSI index range key with the wrong type', function(done) {
		DynamoDB
			.table($tableName)
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
	it('should fail if we try to update an inexistent item', function(done) {
		DynamoDB
			.table($tableName)
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
	it('should update existing item', function(done) {
		// insert
		DynamoDB.table($tableName).insert({hash: 'hash1',range:1, old_number: 1, old_array: [1,2,3], string: 'aaa', 'ignore': 'me', 'delete': 'me'}, function(err) {
			if (err)
				throw err

			DynamoDB
				.table($tableName)
				.where('hash').eq('hash1')
				.where('range').eq(1)
				.update({
					gsi_range: 'b',
					string: 'newstring',
					old_number: DynamoDB.add(9),
					null: null,
					old_array: DynamoDB.add([ 1, 'a', null, { k1: 'v1', k2: 'v2', k3: 'v3' }, [] ]),
					object: { key1: 'value1', key2: 22 },
					delete: DynamoDB.del()
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
									old_number: 10,
									old_array: [ 1,2,3, 1, 'a', null, { k3: 'v3', k1: 'v1', k2: 'v2' }, [] ],
									string: 'newstring',
									ignore: 'me',

									null: null,
									gsi_range: 'b',
									object: { key2: 22, key1: 'value1' },
								})
								done()
							})
				})
		})
	})
	it('test UPDATED_OLD  on update existing item', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.return(DynamoDB.UPDATED_OLD)
			.update({
				old_number: DynamoDB.add(20),
			}, function(err, data ) {
				if (err) throw err
				assert.deepEqual(data, { old_number: 10 })
				done()
			})
	})
	it('removing all items...', function(done) {
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
