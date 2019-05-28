describe('batch().write()', function () {
	// it('prepare', function(done) {
	//
	// 	DynamoDB
	// 		.table($tableName)
	// 		.insert({
	// 			hash: 'batch-write1',
	// 			range: 1,
	// 			hello: 'world1',
	// 		}, function(err, data) {
	// 			if (err)
	// 				throw err
	//
	// 			done()
	//
	// 		})
	//
	//
	// })


	it('.batch().put().write()', function(done) {
		var item = {
			hash: 'batch-write1',
			range: 1,
			buffer: new Buffer("test", "utf-8"),
			boolean: true,
			null: null,
			array: [99.9,66.6,33.3,-1],
			object: {
				number: 1,
				string: 'string',
			},
			ns1: new Set([1.1,-1.1]),
			ns2: DynamoDB.numberSet([1.1,-1.1]),

			ss1: new Set(['aaa','bbb']),
			ss2: DynamoDB.stringSet(['aaa','bbb']),

			//bs1: new Set([new Buffer("aaa", "utf-8"),new Buffer("bbb", "utf-8")]),
			bs2: DynamoDB.binarySet([new Buffer("aaa", "utf-8"),new Buffer("bbb", "utf-8")]),

		}
		DynamoDB
			.batch()
			.table($tableName)
			.put(item)
			.write(function( err, data ) {
				if (err)
					throw err;

				DynamoDB
					.table($tableName)
					.where('hash').eq('batch-write1')
					.where('range').eq(1)
					.consistentRead()
					.get(function( err, data ) {
						if (err)
							throw err

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual(data.hash, item.hash )
						assert.deepEqual(data.range, item.range )
						assert.deepEqual(data.buffer.toString(), 'test' )
						assert.deepEqual(data.boolean, true )
						assert.deepEqual(data.null, null )
						assert.deepEqual(data.array, [99.9,66.6,33.3,-1] )
						assert.deepEqual(data.object, { number: 1, string: 'string', })

						// @todo: check ss1, ss2, ns1, ns2, bs1, bs2

						done()
					})

			})
	})




		it('.batch().put().write() - existing item', function(done) {
			var item = {
				hash: 'batch-write1',
				range: 1,
				hello: 'world2',
			}
			DynamoDB
				.batch()
				.table($tableName)
				.put(item)
				.write(function( err, data ) {
					if (err)
						throw err;

					DynamoDB
						.table($tableName)
						.where('hash').eq('batch-write1')
						.where('range').eq(1)
						.consistentRead()
						.get(function( err, data ) {
							if (err)
								throw err

							console.log(JSON.stringify(data,null,"\t"))

							assert.deepEqual(data.hello, 'world2' )
							//assert.deepEqual(data.hello, 'world2' )

							done()
						})

				})
		})









	it('.batch().del().write()', function(done) {
		var item = {
			hash: 'batch-write1',
			range: 1,
		}
		DynamoDB
			.batch()
			.table($tableName)
			.del(item)
			.write(function( err, data ) {
				if (err)
					throw err;

				DynamoDB
					.table($tableName)
					.where('hash').eq('batch-write1')
					.where('range').eq(1)
					.consistentRead()
					.get(function( err, data ) {
						if (err)
							throw err

						assert.deepEqual(data, {} )

						done()
					})

			})
	})

})
