describe('batch().read()', function () {


	it('.get().get().read()', function(done) {

		DynamoDB
			.batch()
			.table($tableName)
			.get({hash: 'batch-write2', range: 1,})
			.get({hash: 'batch-write2', range: 2,})
			.get({hash: 'batch-write2', range: 3,})
			.get({hash: 'batch-write2', range: 4,})
			.get({hash: 'batch-write2', range: 5,})
			.get({hash: 'batch-write2', range: 6,})
			.get({hash: 'batch-write2', range: 7,})
			.get({hash: 'batch-write2', range: 8,})
			.get({hash: 'batch-write2', range: 9,})
			.get({hash: 'batch-write2', range: 10,})
			.consistent_read()
			.read(function( err, data ) {
				if (err)
					throw err;

				//console.log(JSON.stringify(data,null,"\t"))
				assert.deepEqual(data[$tableName].length, 10 )

				done()


			})
	})

})
