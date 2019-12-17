describe('.transact()', function () {

	it('.transact().table( <NONEXISTENT> )', function(done) {

		DynamoDB
			.transact()
			.table('nonexistent').insert_or_replace({hash: 'h1', range: 1, number: 1})
			.write(function( err, data ) {
				//console.log(err)
				if (err)
					return done()

				throw 'should have failed on inexistent table';

			})
	})



	it('.transact().insert()', function(done) {

		DynamoDB
			.transact()
			.table($tableName).insert({hash: 'insert', range: 1, number: 1})
			.table($tableName).insert({hash: 'insert', range: 2, bool: true})
			.table($tableName).insert({hash: 'insert', range: 3, null: null})
			.write(function( err, data ) {
				if (err)
					throw err;

				//console.log(err,data)


				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert', range: 1,})
					.get({hash: 'insert', range: 2,})
					.get({hash: 'insert', range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
							"range": 1,
							"number": 1,
							"hash": "insert"
						})
						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
							"bool": true,
							"range": 2,
							"hash": "insert"
						})

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 3 })[0] , {
							"null": null,
							"range": 3,
							"hash": "insert"
						})

						done()

					})

			})
	})



	it('.transact().insert_or_replace()', function(done) {

		DynamoDB
			.transact()
			.table($tableName).insert_or_replace({hash: 'insert_or_replace', range: 1, number: 1})
			.table($tableName).insert_or_replace({hash: 'insert_or_replace', range: 2, bool: true})
			.table($tableName).insert_or_replace({hash: 'insert', range: 3,  bool: true})
			.write(function( err, data ) {
				//console.log(err,data)
				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert_or_replace', range: 1,})
					.get({hash: 'insert_or_replace', range: 2,})
					.get({hash: 'insert', range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
							"range": 1,
							"number": 1,
							"hash": "insert_or_replace"
						})
						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
							"bool": true,
							"range": 2,
							"hash": "insert_or_replace"
						})

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 3 })[0] , {
							"bool": true,
							"range": 3,
							"hash": "insert"
						})

						done()

					})



			})
	})


	it('.transact().if().insert_or_replace()', function(done) {

		DynamoDB
			.transact()
			.table($tableName)
				.if('number').eq(1)
				.if('number').ge(1)
				.if('number').gt(0.9)
				.if('number').le(1)
				.if('number').lt(1.1)
				//.if('number').ne('z')
				.if('number').ne(null)
				.if('number').between(0.9,1.1)
				.if('number').not().between(2,7)
				.if('number').in( [ 0.9,1,1.1, "a", "Z" ] )
				.if('number').not().in( [ 0.9,1.1, "a", "Z" ] )
				.if('hash').contains('_or_')
				.if('hash').not().contains('range')
				.if('hash').begins_with('insert_or')
				.if('hash').not().begins_with('somestring')
				.insert_or_replace({hash: 'insert_or_replace', range: 1, number: 1})
			// .table($tableName).insert_or_replace({hash: 'insert_or_replace', range: 2, bool: true})
			// .table($tableName).insert_or_replace({hash: 'insert', range: 3,  bool: true})
			.write(function( err, data ) {
				//console.log(err,data)
				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert_or_replace', range: 1,})
					// .get({hash: 'insert_or_replace', range: 2,})
					// .get({hash: 'insert', range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
							"range": 1,
							"number": 1,
							"hash": "insert_or_replace"
						})
						// assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
						// 	"bool": true,
						// 	"range": 2,
						// 	"hash": "insert_or_replace"
						// })
						//
						// assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 3 })[0] , {
						// 	"bool": true,
						// 	"range": 3,
						// 	"hash": "insert"
						// })

						done()

					})



			})
	})




	it('.transact().replace()', function(done) {

		DynamoDB
			.transact()
			.table($tableName).replace({hash: 'insert', range: 1, status: 'replaced' })
			.table($tableName).replace({hash: 'insert', range: 2, status: 'replaced' })
			.table($tableName).replace({hash: 'insert', range: 3, status: 'replaced', insert_number: 99 })
			.write(function( err, data ) {
				// console.log(err,data)

				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert', range: 1,})
					.get({hash: 'insert', range: 2,})
					.get({hash: 'insert', range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
							hash: "insert",
							range: 1,
							status: 'replaced'

						})
						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
							hash: "insert",
							range: 2,
							status: 'replaced'


						})

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 3 })[0] , {
							hash: "insert",
							range: 3,
							status: 'replaced',
							insert_number: 99
						})

						done()

					})

			})
	})


	it('.transact().if().replace()', function(done) {

		DynamoDB
			.transact()
			.table($tableName)
				.if('status').eq('replaced')
				.if('range').eq(1)
				.if('range').ge(1)
				.if('range').gt(0.9)
				.if('range').le(1)
				.if('range').lt(1.1)
				//.if('number').ne('z')
				.if('range').ne(null)
				.if('range').between(0.9,1.1)
				.if('range').not().between(2,7)
				.if('range').in( [ 0.9,1,1.1, "a", "Z" ] )
				.if('range').not().in( [ 0.9,1.1, "a", "Z" ] )
				.if('hash').contains('ins')
				.if('hash').not().contains('Z')
				.if('hash').begins_with('ins')
				.if('hash').not().begins_with('nsert')
				.replace({hash: 'insert', range: 1, status: 'replaced' })

			//.table($tableName).replace({hash: 'insert', range: 2, status: 'replaced' })
			//.table($tableName).replace({hash: 'insert', range: 3, status: 'replaced', insert_number: 99 })
			.write(function( err, data ) {
				// console.log(err,data)

				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert', range: 1,})
					// .get({hash: 'insert', range: 2,})
					// .get({hash: 'insert', range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
							hash: "insert",
							range: 1,
							status: 'replaced'
						})
						// assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
						// 	hash: "insert",
						// 	range: 2,
						// 	status: 'replaced'
						//
						//
						// })
						//
						// assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 3 })[0] , {
						// 	hash: "insert",
						// 	range: 3,
						// 	status: 'replaced',
						// 	insert_number: 99
						// })

						done()

					})

			})
	})


	it('.transact().if().insert_or_update()', function(done) {

		DynamoDB
			.transact()
			.table($tableName)
					.insert_or_update({hash: 'insert_or_update', range: 1, status: 'inserted', list: [1], map: { b: true } })
			.table($tableName)
					.insert_or_update({hash: 'insert_or_update', range: 2, status: 'inserted', list: [2], map: { b: true } })
			.table($tableName)

					.if('inexisintg_attribute').not().exists()
					.if('status').exists()
					// .if('status').eq('replaced')
					.if('range').eq(3)
					.if('range').ge(3)
					.if('range').gt(2.9)
					.if('range').le(4)
					.if('range').lt(3.1)
					// .if('number').ne('z')
					.if('range').ne(null)
					.if('range').between(2.9,3.1)
					.if('range').not().between(4,7)
					.if('range').in( [ 0.9,3,1.1, "a", "Z" ] )
					.if('range').not().in( [ 0.9,1.1, "a", "Z" ] )
					.if('hash').contains('ins')
					.if('hash').not().contains('Z')
					.if('hash').begins_with('ins')
					.if('hash').not().begins_with('nsert')
					.insert_or_update({hash: 'insert',           range: 3, status: 'updated' , list: [3], map: { b: true } })
			.write(function( err, data ) {

				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert_or_update', range: 1,})
					.get({hash: 'insert_or_update', range: 2,})
					.get({hash: 'insert',           range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
							hash: "insert_or_update",
							range: 1,
							list: [1],
							map: {b: true},
							status: "inserted"
						})
						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
							hash: "insert_or_update",
							range: 2,
							list: [2],
							map: {b: true},
							status: "inserted"
						})

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 3 })[0] , {
							hash: "insert",
							range: 3,
							list: [3],
							map: {b: true},
							status: "updated",
							insert_number: 99
						})

						done()

					})

			})
	})

	it('.transact().if().update()', function(done) {

		DynamoDB
			.transact()
			.table($tableName)
				.where('hash').eq('insert_or_update')
				.where('range').eq(1)

					.if('inexisintg_attribute').not().exists()
					.if('status').exists()
					.if('status').eq('inserted')
					.if('range').eq(1)
					.if('range').ge(1)
					.if('range').gt(0.9)
					.if('range').le(1)
					.if('range').lt(1.1)
					.if('range').ne(null)
					.if('range').between(0.9,1.1)
					.if('range').not().between(2,7)
					.if('range').in( [ 0.9,1,1.1, "a", "Z" ] )
					.if('range').not().in( [ 0.9,1.1, "a", "Z" ] )
					.if('hash').contains('ins')
					.if('hash').not().contains('Z')
					.if('hash').begins_with('ins')
					.if('hash').not().begins_with('update')

				.update({ status: 'updated', })
			.table($tableName)
				.where('hash').eq('insert_or_update')
				.where('range').eq(2)
				.update({ status: 'updated', })

			.write(function( err, data ) {

				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert_or_update', range: 1,})
					.get({hash: 'insert_or_update', range: 2,})
					//.get({hash: 'insert',           range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
							hash: "insert_or_update",
							range: 1,
							list: [1],
							map: {b: true},
							status: "updated"
						})
						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
							hash: "insert_or_update",
							range: 2,
							list: [2],
							map: {b: true},
							status: "updated"
						})

						done()

					})

			})
	})


	it('.transact().delete()', function(done) {

		DynamoDB
			.transact()
			.table($tableName)
				.where('hash').eq('insert_or_update')
				.where('range').eq(1)

					.if('inexisintg_attribute').not().exists()
					.if('status').exists()
					.if('status').eq('updated')
					.if('range').eq(1)
					.if('range').ge(1)
					.if('range').gt(0.9)
					.if('range').le(1)
					.if('range').lt(1.1)
					.if('range').ne(null)
					.if('range').between(0.9,1.1)
					.if('range').not().between(2,7)
					.if('range').in( [ 0.9,1,1.1, "a", "Z" ] )
					.if('range').not().in( [ 0.9,1.1, "a", "Z" ] )
					.if('hash').contains('ins')
					.if('hash').not().contains('Z')
					.if('hash').begins_with('ins')
					.if('hash').not().begins_with('update')

				.delete()
			.write(function( err, data ) {


				if (err)
					throw err;

				DynamoDB
					.table($tableName)
					.where('hash').eq('insert_or_update')
					.where('range').eq(1)
					.consistent_read()
					.get(function( err, data ) {
						if (err)
							throw err;

						// console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data, {})


						done()

					})

			})
	})


	it('.transact().if().insert_or_replace()', function(done) {

		DynamoDB
			.transact()
			//.table($tableName).insert_or_replace({hash: 'insert_or_replace', range: 1, number: 1})
			//.table($tableName).insert_or_replace({hash: 'insert_or_replace', range: 2, bool: true})
			.table($tableName)
				.if('status').eq("updated")
				.insert_or_replace({hash: 'insert', range: 3,  bool: true})
			.write(function( err, data ) {
				//console.log(err,data)
				if (err)
					throw err;

				done()
			})
	})


	it('.transact().if().replace()', function(done) {

		DynamoDB
			.transact()
			.table($tableName).if('status').eq('replaced').replace({hash: 'insert', range: 1, status: 'if_replaced' })
			//.table($tableName).replace({hash: 'insert', range: 2, status: 'replaced' })
			//.table($tableName).replace({hash: 'insert', range: 3, status: 'replaced', insert_number: 99 })
			.write(function( err, data ) {
				// console.log(err,data)

				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert', range: 1,})
					.get({hash: 'insert', range: 2,})
					.get({hash: 'insert', range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
							hash: "insert",
							range: 1,
							status: 'if_replaced'
						})
						// assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
						// 	hash: "insert",
						// 	range: 2,
						// 	status: 'replaced'
						//
						//
						// })
						//
						// assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 3 })[0] , {
						// 	hash: "insert",
						// 	range: 3,
						// 	status: 'replaced',
						// 	insert_number: 99
						// })

						done()

					})

			})
	})

	it('.transact().if().insert_or_update()', function(done) {

		DynamoDB
			.transact()
			.table($tableName)
				//.if('status').eq('updated')
				//.insert_or_update({hash: 'insert_or_update', range: 1, status: 'if_insert_or_update', list: [1], map: { b: true } })

			.table($tableName)
				.if('status').eq('updated')
				.insert_or_update({hash: 'insert_or_update', range: 2, status: 'if_insert_or_update', list: [2], map: { b: true } })

			//.table($tableName).insert_or_update({hash: 'insert',           range: 3, status: 'updated' , list: [3], map: { b: true } })
			.write(function( err, data ) {

				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert_or_update', range: 1,})
					.get({hash: 'insert_or_update', range: 2,})
					.get({hash: 'insert',           range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						// console.log(JSON.stringify(data,null,"\t"))

				// 		assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
				// 			hash: "insert_or_update",
				// 			range: 1,
				// 			list: [1],
				// 			map: {b: true},
				// 			status: "inserted"
				// 		})
				// 		assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
				// 			hash: "insert_or_update",
				// 			range: 2,
				// 			list: [2],
				// 			map: {b: true},
				// 			status: "inserted"
				// 		})
				//
				// 		assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 3 })[0] , {
				// 			hash: "insert",
				// 			range: 3,
				// 			list: [3],
				// 			map: {b: true},
				// 			status: "updated",
				// 			insert_number: 99
				// 		})

						done()

					})

			})
	})


	it('.transact().if().update()', function(done) {

		DynamoDB
			.transact()
			// .table($tableName)
			// 	.where('hash').eq('insert_or_update')
			// 	.where('range').eq(1)
			// 	.update({ status: 'updated', })
			.table($tableName)
				.if('status').eq('if_insert_or_update')
				.where('hash').eq('insert_or_update')
				.where('range').eq(2)
				.update({ status: 'if_updated', })

			.write(function( err, data ) {

				if (err)
					throw err;

				DynamoDB
					.batch()
					.table($tableName)
					.get({hash: 'insert_or_update', range: 1,})
					.get({hash: 'insert_or_update', range: 2,})
					//.get({hash: 'insert',           range: 3,})
					.consistent_read()
					.read(function( err, data ) {
						if (err)
							throw err;

						//console.log(JSON.stringify(data,null,"\t"))

				// 		assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 1 })[0] , {
				// 			hash: "insert_or_update",
				// 			range: 1,
				// 			list: [1],
				// 			map: {b: true},
				// 			status: "updated"
				// 		})
						assert.deepEqual( data[$tableName].filter(function(d) {return d.range === 2 })[0] , {
							hash: "insert_or_update",
							range: 2,
							list: [2],
							map: {b: true},
							status: "if_updated"
						})

						done()

					})

			})
	})


	it('.transact().if().delete()', function(done) {

		DynamoDB
			.transact()
			.table($tableName)
				.if('status').eq('if_updated')
				.where('hash').eq('insert_or_update')
				.where('range').eq(2)
				.delete()
			.write(function( err, data ) {


				if (err)
					throw err;

				DynamoDB
					.table($tableName)
					.where('hash').eq('insert_or_update')
					.where('range').eq(2)
					.consistent_read()
					.get(function( err, data ) {
						if (err)
							throw err;

						// console.log(JSON.stringify(data,null,"\t"))

						assert.deepEqual( data, {})


						done()

					})

			})
	})

})
