
describe('scan()', function () {
	it('should fail when table name is wrong', function(done) {
		DynamoDB
			.table('inexistent-table')
			.scan( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
	it('insert before scan', function(done) {
		async.parallel([
			function(cb) {
				DynamoDB
					.table($tableName)
					.insert({
						hash: 'scan1',
						range: 1,
						number: 1,
						delete_me: 'aaa',
						gsi_range: 'a',
						array: [1,2,3],
						object: {aaa:1,bbb:2, ccc:3, ddd: {ddd1: 1}, eee: [1,'eee1']},
						string_set: DynamoDB.stringSet(['aaa','bbb','ccc']),
						number_set: DynamoDB.numberSet([111,222,333]),
					}, function(err) {
						cb(err)
					})
			},

			function(cb) {
				DynamoDB
					.table($tableName)
					.insert({
						hash: 'scan2',
						range: 99,
						number: 3,
						string: "three four five",
						array: [1,2,3,4],
						object: {aaa:1,bbb:2, ccc:3, ddd: {ddd1: 1}, eee: [1,'eee1']},
						string_set: DynamoDB.stringSet(['aaa','bbb','ccc','ddd3']),
						number_set: DynamoDB.numberSet([111,222,333]),
					}, function(err) {
						cb(err)
					})
			}
		], function(err) {
			if (err) throw err

			done()
		})
	})
	it('.select().having().scan()', function(done) {
		DynamoDB
			.table($tableName)
			.select('number','object.ccc','object.ddd', 'object.eee','string_set[0]', 'number_set[0]','array[0]','array[1]','array[2]')
			.having('number').ne(99)
			//.having('number').eq(1)
			.having('array[1]').between(1,3)
			.having('array[2]').in([3,4,'a'])
			.having('object.eee').not_null()
			.having('object.fff').null()
			.having('object.eee[1]').begins_with('eee')
			.having('object.eee[1]').contains('eee')
			.having('string_set').contains('aaa')
			.having('string_set').not_contains('ddd1')
			.scan( function(err, data) {
				if (err)
					throw err

				// @todo: check returned data
				done()
			})
	})
	it('.scan().then()', function(done) {
		DynamoDB
			.table($tableName)
			.scan()
			.then( function(data) {
				done()
			})
	})
	it('.scan().then() - unhandled', function(done) {
		DynamoDB
			.table('inexistent_table')
			.scan()
		setTimeout(function() {
			done()
		},5000)
	})
	it('.scan().catch()', function(done) {
		DynamoDB
			.table('inexistent_table')
			.scan()
			.catch( function(err) {
				done()
			})
	})
	it('.scan().then(, errorHandler)', function(done) {
		DynamoDB
			.table('inexistent_table')
			.scan()
			.then(null, function(err) {
				done()
			})
	})
})

	// @todo: gsi scan
