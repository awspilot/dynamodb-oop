require('./lib/common')

describe('scan', function () {
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
})

	// @todo: gsi scan
