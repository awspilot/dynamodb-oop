
require('./lib/common')

describe('insert_or_update()', function () {
	it('should insert new item', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_update({
				hash: 'hash1',
				range: 1,
				number: 5,
				array: [0,null,{},"string"],
				delete_me_later: {}
			},function(err,data) {
				if (err) {
					throw err
					return
				}
				DynamoDB
					.table($tableName)
					.where('hash').eq('hash1')
					.where('range').eq(1)
					.get(function(err,data) {
						if (err) {
							throw err
							return
						}
						assert.deepEqual(data, {hash: 'hash1', range: 1, number: 5, array: [0,null,{},"string"], delete_me_later: {} })
						done()
					})
			})
	})

	it('should update existing item', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_update({
				hash: 'hash1',
				range: 1,
				a: 'a',
				number: DynamoDB.add(5),
				delete_me_later: DynamoDB.del(),
				array: DynamoDB.add( [ 'xxx','yyy' ] )
			}, function(err) {
				DynamoDB
					.table($tableName)
					.where('hash').eq('hash1')
					.where('range').eq(1)
					.get(function(err,data) {
						if (err) {
							throw err
							return
						}
						assert.deepEqual(data, {hash: 'hash1', range: 1, number: 10, array: [0,null,{},"string","xxx","yyy"], a: 'a'})
						done()
					})
			})
	})

	it('should return nothing by default', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.NONE)
			.insert_or_update({
				hash: 'hash1',
				range: 1,
				something: 'somevalue',
			}, function(err, data ) {
				if (err) throw err

				assert.deepEqual(data, {})
				done()
			})
	})
})
