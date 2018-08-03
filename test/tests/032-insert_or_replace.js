
describe('insert_or_replace( new_item )', function () {
	it('should insert new item', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.ALL_OLD)
			.insert_or_replace({
				hash: 'hash1',
				range: 1,
				number: 5,
				boolean: false,
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
						assert.deepEqual(data, {hash: 'hash1', range: 1, number: 5, boolean: false, array: [0,null,{},"string"], delete_me_later: {} })
						done()
					})
			})
	})
	it('.insert_or_replace( existing_item )', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.ALL_OLD)
			//.return_consumed_capacity('INDEXES')
			.insert_or_replace({
				hash: 'hash1',
				range: 1,
				boolean: false,
				a: 'a'
			}, function(err, data) {
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
						assert.deepEqual(data, {hash: 'hash1', range: 1, boolean: false, a: 'a'})
						done()
					})
			})
	})
	it('.return(DynamoDB.ALL_OLD).insert_or_replace()', function(done) {
		DynamoDB
			.table($tableName)
			.return(DynamoDB.ALL_OLD)
			.insert_or_replace({
				hash: 'hash1',
				range: 1,
				something: 'somevalue',
			}, function(err, data ) {
				if (err) throw err

				assert.deepEqual(data, {hash: 'hash1', range: 1, boolean: false, a: 'a'})
				done()
			})
	})







	it('.insert_or_replace() - test new Set( <ARRAY_OF_NUMBERS> )', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
				hash: 'test-replace-set-ns',
				range: 1,
				number_set: new Set([ 111, 222, 333 ]),
			}, function(err, data) {
				if (err)
					throw err

				DynamoDB
					.table($tableName)
					.where('hash').eq('test-replace-set-ns')
					.where('range').eq(1)
					.get(function(err, item) {
						if (err)
							throw err

						item.number_set.sort()
						assert.deepEqual(item, {
							hash: 'test-replace-set-ns',
							range: 1,
							number_set: [ 111, 222, 333 ],
						}, {strict: true })
						done()
					})
			})
	})

	it('.insert_or_replace() - test new Set( <ARRAY_OF_STRINGS> )', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
				hash: 'test-replace-set-ss',
				range: 1,
				string_set: new Set([ 'aaa', 'bbb', 'ccc' ]),
			}, function(err, data ) {
				if (err)
					throw err


				DynamoDB
					.table($tableName)
					.where('hash').eq('test-replace-set-ss')
					.where('range').eq(1)
					.get(function(err, item, raw ) {
						if (err)
							throw err

						item.string_set.sort()
						assert.deepEqual(item, {
							hash: 'test-replace-set-ss',
							range: 1,
							string_set: [ 'aaa', 'bbb', 'ccc'  ],
						}, {strict: true })
						done()
					})
			})
	})

	it('.insert_or_replace() - test new Set( <MIXED> )', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
				hash: 'test-replace-set-mixed',
				range: 1,
				set1: new Set(),
				set2: new Set(['a', 1, {} ]),
			}, function(err, data ) {
				if (err)
					throw err


				DynamoDB
					.table($tableName)
					.where('hash').eq('test-replace-set-mixed')
					.where('range').eq(1)
					.get(function(err, item, raw ) {
						if (err)
							throw err

						assert.deepEqual(Array.isArray(item.set1), true )
						assert.deepEqual(Array.isArray(item.set2), true )

						done()
					})
			})
	})





	it('insert_or_replace() insert new item with empty string', function(done) {
		var $obj = {
			hash: 'insert_or_replace_empty_string',
			range: 1,
			empty_string: '',
		}
		DynamoDB
			.table($tableName)
			.insert_or_replace($obj, function(err, data) {
				if (err)
					throw err

				DynamoDB
					.table($tableName)
					.where('hash').eq('insert_or_replace_empty_string')
					.where('range').eq(1)
					.get(function(err, item) {
						if (err)
							throw err

						assert.deepEqual(item.empty_string, '', {strict: true } )
						done()
					})
			})
	})
	it('insert_or_replace() replace existing item with empty string attribute', function(done) {
		var $obj = {
			hash: 'insert_or_replace_empty_string',
			range: 1,
			empty_string2: '',
		}
		DynamoDB
			.table($tableName)
			.insert_or_replace($obj, function(err, data) {
				if (err)
					throw err

				DynamoDB
					.table($tableName)
					.where('hash').eq('insert_or_replace_empty_string')
					.where('range').eq(1)
					.get(function(err, item) {
						if (err)
							throw err

						assert.deepEqual(item.empty_string2, $obj.empty_string2, {strict: true } )
						assert.deepEqual(item.hasOwnProperty('empty_string'), false )
						done()
					})
			})
	})













	it('.insert_or_replace().then()', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
				hash: 'promise',
				range: 1,
			})
			.then(function(data) {
				done()
			})
	})
	it('.insert_or_replace() - unhandled', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
				hash: 1,
				range: 1,
			})
		setTimeout(function() {
			done()
		},5000)
	})
	it('.insert_or_replace().catch()', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
				hash: 1,
				range: 1,
			})
			.catch(function(err) {
				done()
			})
	})
	it('.insert_or_replace().then(,errorHandler)', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_replace({
				hash: 1,
				range: 1,
			})
			.then( null, function(err) {
				done()
			})
	})

	it('cleanup...', function(done) {
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
