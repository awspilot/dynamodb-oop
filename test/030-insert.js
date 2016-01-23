
require('./lib/common')

describe('insert', function () {
	it('should fail if missing RANGE', function(done) {
		DynamoDB
			.table($tableName)
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
			.table($tableName)
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
			.table($tableName)
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
			.table($tableName)
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
					.table($tableName)
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

	it('should NOT fail when missing callback', function(done) {
		DynamoDB
			.table($tableName)
			.insert({
				hash: 'hash1',
				range: 99,
				number: 99,
				null: null
			})
		setTimeout(function() {
			done()
		},5000)
	})

	it('should insert when item does not exist', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('hash1')
			.where('range').eq(1)
			.delete(function( err, data ) {
				DynamoDB
					.table($tableName)
					.insert({
						hash: 'hash1',
						range: 1,
						number: 1,
						delete_me: 'aaa',
						gsi_range: 'a',
						array: [1,2,3],
						object: {aaa:1,bbb:2, ccc:3, ddd: {ddd1: 1}, eee: [1,'eee1']},
						string_set: DynamoDB.stringSet(['aaa','bbb','ccc']),
						number_set: DynamoDB.numberSet([111,222,333]),
					}, function(err, data) {
						if (err)
							throw err

						DynamoDB
							.table($tableName)
							.where('hash').eq('hash1')
							.where('range').eq(1)
							.get(function(err, item) {
								if (err)
									throw err

								item.number_set.sort()
								assert.deepEqual(item, {
									hash: 'hash1',
									range: 1,
									number: 1,
									delete_me: 'aaa',
									gsi_range: 'a',
									array: [1,2,3],
									object: {aaa:1,bbb:2, ccc:3, ddd: {ddd1: 1}, eee: [1,'eee1']},
									string_set: ['aaa','bbb','ccc'],
									number_set: [ 111, 222, 333 ],
								}, {strict: true })
								done()
							})
					})
			})
	})

	it('should fail when item already exists', function(done) {
		DynamoDB
			.table($tableName)
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

	// future tests
	//it('should fail .if(hash).eq().if(range).eq()', function(done) {
	//	DynamoDB
	//		table($tableName)
	//		.if('hash').eq('hash1')
	//		.if('range').eq(1)
	//		.insert({
	//			hash: 'hash1',
	//			range: 1
	//		}, function(err, data) {
	//			console.log(err,data)
	//			//if (err)
	//				done()
	//			//else
	//			//	throw err
	//		})
	//})
})
