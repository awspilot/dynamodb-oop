
require('./lib/common')
return

describe('insert_or_update()', function () {
	it('should insert new item', function(done) {
		DynamoDB
			.table($tableName)
			.insert_or_update({
				hash: 'hash1',
				range: 1,
				number_a: 5,
				number_b: 7,
				number_c: 1,
				number_d: 1,
				number_e: 1,
				number_f: 1,
				number_deleteme: 1,

				array_a: [0,null,{},"string"],
				array_b: [0,null,{},"string"],
				array_c: [0,null,{},"string"],
				array_d: [0,null,{},"string"],
				array_e: [0,null,{},"string"],
				array_deleteme: [0,null,{},"string"],


				object: { property1: 'value1' },
				object_deleteme: { property1: 'value1' },

				delete_me_later: {},

				string_set_a: DynamoDB.stringSet(['sss','bbb','ccc']),
				string_set_b: DynamoDB.stringSet(['sss','bbb','ccc']),
				string_set_c: DynamoDB.stringSet(['sss','bbb','ccc']),
				string_set_d: DynamoDB.stringSet(['sss','bbb','ccc']),
				string_set_deleteme: DynamoDB.stringSet(['sss','bbb','ccc']),


				number_set_a: DynamoDB.numberSet([111,222,333]),
				number_set_b: DynamoDB.numberSet([111,222,333]),
				number_set_c: DynamoDB.numberSet([111,222,333]),
				number_set_d: DynamoDB.numberSet([111,222,333]),
				number_set_deleteme: DynamoDB.numberSet([111,222,333]),
			},function(err,data) {
				if (err) {
					throw err
					return
				}
				DynamoDB
					.table($tableName)
					.where('hash').eq('hash1')
					.where('range').eq(1)
					.get(function(err,item) {
						if (err) {
							throw err
							return
						}
						item.number_set_a.sort()
						item.number_set_b.sort()
						item.number_set_c.sort()
						item.number_set_d.sort()
						item.number_set_deleteme.sort()

						item.string_set_a.sort()
						item.string_set_b.sort()
						item.string_set_c.sort()
						item.string_set_d.sort()
						item.string_set_deleteme.sort()

						assert.deepEqual(item,{
							hash: 'hash1',
							range: 1,

							number_a: 5,
							number_b: 7,
							number_c: 1,
							number_d: 1,
							number_e: 1,
							number_f: 1,
							number_deleteme: 1,

							array_a: [0,null,{},"string"],
							array_b: [0,null,{},"string"],
							array_c: [0,null,{},"string"],
							array_d: [0,null,{},"string"],
							array_e: [0,null,{},"string"],
							array_deleteme: [0,null,{},"string"],

							object: { property1: 'value1' },
							object_deleteme: { property1: 'value1' },

							delete_me_later: {},

							string_set_a: ['bbb','ccc','sss'],
							string_set_b: ['bbb','ccc','sss'],
							string_set_c: ['bbb','ccc','sss'],
							string_set_d: ['bbb','ccc','sss'],
							string_set_deleteme: ['bbb','ccc','sss'],

							number_set_a: [111,222,333],
							number_set_b: [111,222,333],
							number_set_c: [111,222,333],
							number_set_d: [111,222,333],
							number_set_deleteme: [111,222,333],
						})
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
				a: 'a', // new item

				number_a: DynamoDB.add(5,'N'),
				number_b: DynamoDB.add(DynamoDB.number(3)),
				number_c: DynamoDB.add(5),
				number_d: DynamoDB.add(),
				number_deleteme: DynamoDB.del(),

				string_set_a: DynamoDB.add(['aaa','zzz'],'SS'),
				string_set_b: DynamoDB.add(DynamoDB.stringSet(['aaa','zzz'])),
				string_set_c: DynamoDB.del(['bbb','sss','xxx'],'SS'),
				string_set_d: DynamoDB.del(DynamoDB.stringSet(['bbb','sss','yyy'])),
				string_set_deleteme: DynamoDB.del(),

				number_set_a: DynamoDB.add([444,555],'NS'),
				number_set_b: DynamoDB.add(DynamoDB.numberSet([444,555])),
				number_set_c: DynamoDB.del([111,333],'NS'),
				number_set_d: DynamoDB.del(DynamoDB.numberSet([111,333])),
				number_set_deleteme: DynamoDB.del(),

				array_a: DynamoDB.add(['fff','ggg'],'L'),
				array_b: DynamoDB.add( DynamoDB.list(['fff','ggg'])),
				array_c: DynamoDB.add( ['fff','ggg'] ),
				array_deleteme: DynamoDB.del(),

				object_deleteme: DynamoDB.del(),

			}, function(err) {
				if (err) {
					console.log(err)
					process.exit()
				}


				DynamoDB
					.table($tableName)
					.where('hash').eq('hash1')
					.where('range').eq(1)
					.consistent_read()
					.get(function(err,item) {
						if (err) {
							throw err
							return
						}
						console.log(item)
						process.exit()
						assert.deepEqual(item, {
							hash: 'hash1',
							range: 1,
							a: 'a',
							delete_me_later: {},
							array: [ 0, null, {}, 'string' ],

							string_set_a: [ 'aaa', 'bbb', 'ccc', 'sss', 'zzz' ],
							number_set_b: [ 444, 222, 555, 333, 111 ],

							number: 10,

						})
						//done()
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
