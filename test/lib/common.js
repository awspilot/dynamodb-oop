fs = require('fs')
async = require('async')
assert = require('assert')
yaml = require('js-yaml')
$tableName = 'test_hash_range'

var dynalite = require('dynalite'),
dynaliteServer = dynalite({ createTableMs: 50, db: require('memdown')})
dynaliteServer.listen(4567, function(err) {
	if (err) throw err
})

var AWS = require('aws-sdk')
DynamoDB = require('../../lib/dynamodb')( new AWS.DynamoDB({endpoint: 'http://localhost:4567', "accessKeyId": "akid", "secretAccessKey": "secret", "region": "us-east-1" }))

DynamoDB.on('error', function(op, error, payload ) {
	//console.log(op,error,JSON.stringify(payload))
})
DynamoDB.on('beforeRequest', function(op, payload ) {
	//console.log("--------------------------------")
	//console.log(op,payload)
})

query_handler = function( idx, yml ) {
	return function(done) {
		if (yml.Tests.query[idx].log === true)
			global.DDBSQL = true
		else
			global.DDBSQL = false

		DynamoDB.query( yml.Tests.query[idx].query, function(err, data ) {
			if (yml.Tests.query[idx].shouldFail) {
				if (err) {
					if (!(yml.Tests.query[idx].validations || []).length)
						return done()

					yml.Tests.query[idx].validations.forEach(function(el) {
						assert.deepEqual(eval( el.key ), eval( el.value ))
					})
					done()
				}
			} else {
				if (err)
					throw err

				if (yml.Tests.query[idx].log === true)
					console.log("result=", JSON.stringify(data, null, "\t"))

				if (yml.Tests.query[idx].results)
					assert.equal(data.length, yml.Tests.query[idx].results)

				if (yml.Tests.query[idx].validations) {
					yml.Tests.query[idx].validations.forEach(function(el) {
						assert.deepEqual(eval( el.key ), eval( el.value ))
					})
				}
				done()
			}
		})
	}
}

before_test = function(data) {
	return function(done) {
		async.each(data, function(q, cb ) {
			DynamoDB.query(q, {}, cb )
		}, function(err) {
			if (err)
				throw err

			done()
		})
	}
}

run_test = function(test_name, yml_file ) {
	
	describe(test_name, function () {
		var yml = yaml.safeLoad(fs.readFileSync(yml_file, 'utf8'))
		console.log("yml=", yml )
		before(before_test(yml.Prepare.Data))
		// beforeEach

		yml.Tests.query.forEach(function(v,k) {
			it(yml.Tests.query[k].title || yml.Tests.query[k].query, query_handler(k, yml ) )
			
		})
	})
}