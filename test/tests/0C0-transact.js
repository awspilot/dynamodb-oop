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


	it('.transact().replace()', function(done) {

		DynamoDB
			.transact()
			.table($tableName).replace({hash: 'insert', range: 1, status: 'replaced' })
			.table($tableName).replace({hash: 'insert', range: 2, status: 'replaced' })
			.table($tableName).replace({hash: 'insert', range: 3, status: 'replaced' })
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
							status: 'replaced'
						})

						done()

					})

			})
	})


})
