
describe('update()', function () {

	// dynalite: "ADD action is not supported for the type L", UpdateExpression
	it('should update existing item', function(done) {
		// insert
		DynamoDB
			.table($tableName)
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
			.insert_or_replace({
				hash: 'test-update',
				range:1,
				old_number: 1,
				//old_array: [1,2,3],
				string: 'aaa',
				'ignore': 'me',
				'delete': 'me'
			}, function(err) {
				if (err)
					throw err

				DynamoDB
					.table($tableName)
					.where('hash').eq('test-update')
					.where('range').eq(1)
					//.on('beforeRequest', function(op, payload) {
					//	console.log(op, JSON.stringify(payload,null,"\t"))
					//})
					.return(DynamoDB.ALL_NEW)
					.update({
						gsi_range: 'b',
						string: 'newstring',
						old_number: DynamoDB.add(9),
						null: null,
						//old_array: DynamoDB.add([ 1, 'a', null, { k1: 'v1', k2: 'v2', k3: 'v3' }, [] ]),
						object: { key1: 'value1', key2: 22 },
						delete: DynamoDB.del()
					}, function(err, data) {
						if (err)
							throw err

						assert.deepEqual(data, {
							hash: 'test-update',
							range: 1,
							old_number: 10,
							//old_array: [ 1,2,3, 1, 'a', null, { k3: 'v3', k1: 'v1', k2: 'v2' }, [] ],
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


	it('test UPDATED_OLD on update existing item', function(done) {

		DynamoDB
			.table($tableName)
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
			.insert_or_replace({
				hash: 'test-updated-old',
				range: 1,
				number: 10,
				number2: 10,
			}, function(err) {
				if (err) throw err

				DynamoDB
					.table($tableName)
					.where('hash').eq('test-updated-old')
					.where('range').eq(1)
					.return(DynamoDB.UPDATED_OLD)
					//.on('beforeRequest', function(op, payload) {
					//	console.log(op, JSON.stringify(payload,null,"\t"))
					//})
					.update({
						number: DynamoDB.add(20),
						number2: 30,
					}, function(err, data ) {

						if (err) throw err
						assert.deepEqual(data, { number: 10, number2: 10 })
						done()
					})
			})
	})


	it('.update().then()', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.UPDATED_OLD)
			.where('hash').eq('test-updated-old')
			.where('range').eq(1)
			.update({
				number: 1,
			})
			.then(function(data) {
				done()
			})
	})
	it('.update() - unhandled', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq(1)
			.where('range_unexistent').eq(1)
			.update({})
		setTimeout(function() {
			done()
		},5000)
	})
	it('.update().catch()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq(1)
			.where('range_unexistent').eq(1)
			.update({})
			.catch(function(err) {
				done()
			})
	})

	it('cleanup...', function(done) {
		DynamoDB
			.table($tableName)
			.scan(function(err, data) {
				if (err)
					throw err

				async.each(data, function(item,cb) {
					DynamoDB.table($tableName).where('hash').eq(item.hash).where('range').eq(item.range).delete(function(err) { cb(err) })
				}, function(err) {
					if (err)
						throw err

					done()
				})
			})
	})
})
