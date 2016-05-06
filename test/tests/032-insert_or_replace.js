
require('./lib/common')

describe('insert_or_replace()', function () {
	it('should insert new item', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
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
	it('should replace existing item', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
				hash: 'hash1',
				range: 1,
				a: 'a'
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
						assert.deepEqual(data, {hash: 'hash1', range: 1, a: 'a'})
						done()
					})
			})
	})
	it('test ALL_OLD  on replace for existing item', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.ALL_OLD)
			.insert_or_replace({
				hash: 'hash1',
				range: 1,
				something: 'somevalue',
			}, function(err, data ) {
				if (err) throw err

				assert.deepEqual(data, {hash: 'hash1', range: 1, a: 'a'})
				done()
			})
	})
	it('removing all items...', function(done) {
		DynamoDB
			.table($tableName)
			.scan(function(err, data) {
				if (err)
					throw err
				else {
					async.each(data, function(item,cb) {
						DynamoDB.table($tableName).where('hash').eq(item.hash).where('range').eq(item.range).delete(function(err) { cb(err) })
					}, function(err) {
						if (err)
							throw err
						else
							done()
					})
				}
			})
	})
})
