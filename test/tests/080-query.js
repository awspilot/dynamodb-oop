
describe('query()', function () {
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
	it('.where(RANGE).le()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.where('range').le(99)
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
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
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
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
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
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
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
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
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw "expected 2 got " + data.length

				done()
			})
	})
	/* No begins with for type N
	it('.where(RANGE).begins_with()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.where('range').begins_with(1)
			.on('beforeRequest', function(op, payload) {
				console.log(op, JSON.stringify(payload,null,"\t"))
			})
			.query( function(err, data) {
				if (err)
					throw err

				if (data.length !== 2)
					throw "expected 2 got " + data.length

				done()
			})
	})
	*/

	it('.select().where().having().query()', function(done) {
		DynamoDB
			.table($tableName)
			.select('hash','range','number','object.ccc','object.ddd', 'object.eee','string_set[0]', 'number_set[0]','array[0]','array[1]','array[2]')
			.where('hash').eq('query')
			.where('range').gt(0)
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
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
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
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
			.query( function(err, data) {
				if (err)
					throw err

				//console.log(JSON.stringify(data))
				// @todo: check returned value
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
			//.on('beforeRequest', function(op, payload) {
			//	console.log(op, JSON.stringify(payload,null,"\t"))
			//})
			.query( function(err, data) {
				if (err)
					throw err

				//console.log(JSON.stringify(data))
				// @todo: check returned value
				done()
			})
	})




	it('.query().then()', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.query()
			.then(function(data) {
				done()
			})
	})
	it('.query().then() - unhandled', function(done) {
		DynamoDB
			.table($tableName)
			.where('hash').eq('query')
			.where('range').le(99)
			.query()
		setTimeout(function() {
			done()
		},5000)
	})
	it('.query().then().catch()', function(done) {
		DynamoDB
			.table($tableName)
			.where('unexistent_hash').eq('query')
			.query()
			.catch(function(err) {
				done()
			})
	})
	it('.query().then(,errorHandler)', function(done) {
		DynamoDB
			.table($tableName)
			.where('unexistent_hash').eq('query')
			.query()
			.then(null,function(err) {
				done()
			})
	})

})
