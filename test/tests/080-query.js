require('./lib/common')

describe('query', function () {
	it('prepare data for query', function(done) {
		async.parallel([
			function(cb) {
				DynamoDB
					.table($tableName)
					.insert({
						hash: 'query',
						range: 1,
						number: 1,
						string: "one two three",
						array: [1,2,3,4],
						object: {aaa:1,bbb:2, ccc:3, ddd: {ddd1: 1}, eee: [1,'eee1']},
						string_set: DynamoDB.stringSet(['aaa','bbb','ccc','ddd1']),
						number_set: DynamoDB.numberSet([111,222,333]),
					}, function(err, data) {cb(err)})
			},
			function(cb) {
				DynamoDB
					.table($tableName)
					.insert({
						hash: 'query',
						range: 2,
						number: 2,
						string: "one two three four",
						array: [1,2,3,4],
						object: {aaa:1,bbb:2, ccc:3, ddd: {ddd1: 1}, eee: [1,'eee2']},
						string_set: DynamoDB.stringSet(['aaa','bbb','ccc']),
						number_set: DynamoDB.numberSet([111,222,333]),
					}, function(err, data) {cb(err)})
			},
			function(cb) {
				DynamoDB
					.table($tableName)
					.insert({
						hash: 'query',
						range: 99,
						number: 3,
						string: "three four five",
						array: [1,2,3,4],
						object: {aaa:1,bbb:2, ccc:3, ddd: {ddd1: 1}, eee: [1,'eee1']},
						string_set: DynamoDB.stringSet(['aaa','bbb','ccc','ddd3']),
						number_set: DynamoDB.numberSet([111,222,333]),
					}, function(err, data) {cb(err)})
			}
		], function(err) {
			if (err)
				throw err

			done()
		})
	})
	it('should fail when table name is wrong', function(done) {
		DynamoDB
			.table('inexistent-table')
			.query( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
	it('should fail when no .where() is specified', function(done) {
		DynamoDB
			.table($tableName)
			.query( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
	it('should fail when HASH has wrong type', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq(5)
			.query( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
	it('should fail when querying without HASH .eq()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').gt('aaa')
			.query( function(err, data) {
				if (err)
					done()
				else
					throw err
			})
	})
	it('.where(RANGE).le()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.where('range').le(99)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 3)
					throw "expected 3 got " + data.length

				done()
			})
	})
	it('.where(RANGE).lt()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.where('range').lt(99)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw "expected 2 got " + data.length

				done()
			})
	})
	it('.where(RANGE).ge()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.where('range').ge(2)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw "expected 2 got " + data.length

				done()
			})
	})
	it('.where(RANGE).gt()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.where('range').gt(2)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 1)
					throw "expected 1 got " + data.length

				done()
			})
	})
	it('.where(RANGE).between()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.where('range').between(2,99)
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw "expected 2 got " + data.length

				done()
			})
	})
	it('.select().where().having().query()', function(done) {
		DynamoDB
			.table($tableName)
			.select('number','object.ccc','object.ddd', 'object.eee','string_set[0]', 'number_set[0]','array[0]','array[1]','array[2]')
			.where('hash').eq('query')
			.having('object.ccc').eq(3)
			//.having('number').eq(1)
			.having('number').ne(99)
			.having('array[1]').between(0,2)
			.having('array[2]').in([3,4,'a'])
			.having('object.eee').not_null()
			.having('object.fff').null()
			.having('object.eee[1]').begins_with('eee')
			.having('object.eee[1]').contains('eee')
			.having('string_set').contains('aaa')
			.having('string_set').not_contains('ddd1')
			.query( function(err, data) {
				if (err)
					throw err

				// @todo: check returned value
				done()
			})
	})

	// having in string
	it('.select().where().having(string).contains().not_contains().query()', function(done) {
		DynamoDB
			.table($tableName)
			.select('number','string')
			.where('hash').eq('query')
			.having('string').contains('one')
			.having('string').contains('two')
			.having('string').not_contains('four')
			.query( function(err, data) {
				if (err)
					throw err

				console.log(JSON.stringify(data))
				done()
			})
	})

	// having in stringset
	it('.select().where().having(stringset).contains().not_contains().query()', function(done) {
		DynamoDB
			.table($tableName)
			.select('string_set')
			.where('hash').eq('query')
			.having('string_set').contains('aaa')
			.having('string_set').contains('bbb')
			.having('string_set').not_contains('ddd1')
			.query( function(err, data) {
				if (err)
					throw err

				console.log(JSON.stringify(data))
				done()
			})
	})
})
