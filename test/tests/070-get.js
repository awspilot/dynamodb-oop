
require('./lib/common')

describe('get()', function (done) {
	it('prepare for get()', function(done) {
		DynamoDB
			.table($tableName)
			.insert({
				hash: 'test-get',
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

				done()
			})
	})
	it('.get() item with select()', function(done) {
		DynamoDB
			.table($tableName)
			.select('range','delete_me','inexistent','object.ccc','object.ddd', 'string_set[0]', 'number_set[0]','array[0]')
			.where('hash').eq('test-get')
			.where('range').eq(1)
			.get( function(err, data) {
				if (err)
					throw err

				// @todo: incomplete
				//console.log(JSON.stringify(data))
				done()
			})
	})
})
