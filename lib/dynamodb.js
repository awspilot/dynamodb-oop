'use strict';

// @todo: nice handling of throtteling https://github.com/aws/aws-sdk-js/issues/402

	var util = require('./util')
	var AWS = require('aws-sdk')

	function DynamoDB ( $config ) {
		this.events = {
			error: function() {},
			beforeRequest: function() {}
		}
		if ($config instanceof AWS.DynamoDB) {
			this.client = $config
			$config = null
		} else {
			if ($config && $config.hasOwnProperty('accessKeyId')) {
			$config.credentials = {
					accessKeyId: $config.accessKeyId,
					secretAccessKey: $config.secretAccessKey || null
				}
				delete $config.accessKeyId
				delete $config.secretAccessKey
			}

			if ($config)
				this.client = new AWS.DynamoDB($config)
			else
				this.client = new AWS.DynamoDB()

		}
	}
	DynamoDB.prototype.table = function($tableName) {
		return new Request( this.client, this.events ).table($tableName)
	}

	DynamoDB.prototype.getClient = function() {
		return this.client
	}

	DynamoDB.prototype.on = function( event, handler ) {
		this.events[event] = handler
	}
	DynamoDB.ALL = 1
	DynamoDB.ALL_ATTRIBUTES = 1
	DynamoDB.PROJECTED = 2
	DynamoDB.ALL_PROJECTED_ATTRIBUTES = 2
	DynamoDB.COUNT = 3

	function Request( $client, $events ) {
		this.events = $events
		this.client = $client

		this.Select = null
		this.AttributesToGet = []
		this.pendingKey = null
		this.pendingFilter = null
		this.pendingIf = null
		this.whereKey = {}
		this.whereOther = {}
		this.whereFilter = {}
		this.ifFilter = {}
		this.limit_value = null
		this.IndexName = null
		this.ScanIndexForward = true
		this.LastEvaluatedKey = null
		this.ExclusiveStartKey = null
		this.ConsistentRead = false
		this.returnConsumedCapacity = 'INDEXES' // TOTAL | INDEXES | NONE
		this.ConsumedCapacity = null
	}



	Request.prototype.routeCall = function(method, params, callback ) {
		var $this = this
		this.events.beforeRequest.apply( this, [ method, params ])

		this.client[method]( params, function( err, data ) {
			if (err)
				$this.events.error.apply( $this, [ method, err , params ] )

			if ((data || {}).hasOwnProperty('ConsumedCapacity') )
				$this.ConsumedCapacity = data.ConsumedCapacity

			callback.apply( $this, [ err, data ] )
		})
	}
	Request.prototype.describeTable = function( table, callback ) {
		this.routeCall('describeTable', { TableName: table }, function(err,data) {
			return callback.apply( this, [ err, data ] )
		})
	}

	Request.prototype.describe = function( callback ) {
		this.routeCall('describeTable', { TableName: this.tableName }, function(err,raw) {
			if (err)
				return callback.apply( this, [ err ] )

			if (!raw.hasOwnProperty('Table'))
				return callback.apply( this, [ { errorMessage: "Invalid data. No Table Property in describeTable"} ] )

			var info = raw.Table
			delete info.TableStatus
			delete info.TableArn
			delete info.TableSizeBytes
			delete info.ItemCount
			delete info.CreationDateTime
			delete info.ProvisionedThroughput.NumberOfDecreasesToday
			delete info.ProvisionedThroughput.LastIncreaseDateTime
			delete info.ProvisionedThroughput.LastDecreaseDateTime
			if (info.hasOwnProperty('GlobalSecondaryIndexes')) {
				for (var i in info.GlobalSecondaryIndexes) {
					delete info.GlobalSecondaryIndexes[i].IndexSizeBytes
					delete info.GlobalSecondaryIndexes[i].IndexStatus
					delete info.GlobalSecondaryIndexes[i].ItemCount
					delete info.GlobalSecondaryIndexes[i].IndexArn
					delete info.GlobalSecondaryIndexes[i].ProvisionedThroughput.NumberOfDecreasesToday
				}
			}
			if (info.hasOwnProperty('LocalSecondaryIndexes')) {
				for (var i in info.LocalSecondaryIndexes) {
					delete info.LocalSecondaryIndexes[i].IndexSizeBytes
					delete info.LocalSecondaryIndexes[i].ItemCount
					delete info.LocalSecondaryIndexes[i].IndexArn
				}
			}
			return callback.apply( this, [ err, info, raw ] )
		})
	}

	Request.prototype.table = function($tableName) {
		this.tableName = $tableName;
		return this;
	}

	Request.prototype.select = function() {

		if (arguments.length === 1 && arguments[0] === DynamoDB.ALL_ATTRIBUTES ) {
			this.Select = 'ALL_ATTRIBUTES'
			return this
		}

		if (arguments.length === 1 && arguments[0] === DynamoDB.ALL_PROJECTED_ATTRIBUTES ) {
			this.Select = 'ALL_PROJECTED_ATTRIBUTES'
			return this
		}

		if (arguments.length === 1 && arguments[0] === 3 ) {
			this.Select = 'COUNT'
			return this
		}

		this.AttributesToGet = []

		for (var i = 0; i < arguments.length; i++)
			this.AttributesToGet.push(arguments[i])

		return this;
	}

	Request.prototype.addSelect = function($field) {
		this.AttributesToGet.push($field)
		return this
	}

	Request.prototype.consistentRead = function( $value ) {
		if ($value === undefined ) {
			this.ConsistentRead = true
			return this
		}

		if ($value)
			this.ConsistentRead = true
		else
			this.ConsistentRead = false

		return this
	}
	Request.prototype.consistent_read = Request.prototype.consistentRead
	Request.prototype.descending = function( ) {
		this.ScanIndexForward = false
		return this
	}
	Request.prototype.desc = Request.prototype.descending
	Request.prototype.index = function( $IndexName ) {
		this.IndexName = $IndexName
		return this
	}
	Request.prototype.order_by = Request.prototype.index

	Request.prototype.where = function($key,$value1,$value2) {
		if ($value1 === undefined ) {
			this.pendingKey = $key
			return this
		}

		if ($value2 === undefined) {
			this.whereKey[$key] = {'S' : $value1};

			if (typeof $value1 == "number")
				this.whereKey[$key] = {'N' : ($value1).toString() };

		} else {
			this.whereOther[$key] = {
				type: 'S',
				value: $value2,
				operator: $value1
			};
		}

		return this;
	}

	Request.prototype.insert = function(item, callback) {

		if (Object.keys(this.ifFilter).length > 0) {
			// use if(), ignore key condition
			var $thisQuery = {
				TableName: this.tableName,
				Item: util.anormalizeItem(item),
				Expected: util.buildExpected( this.ifFilter ),
				ReturnConsumedCapacity: this.returnConsumedCapacity
			}
			this.routeCall('putItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
			})

		} else {
			// deprecated, to be removed in 0.2.x, will use if() instead

			this.describeTable(this.tableName, function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )


				var $expected = {}
				for (var i in data.Table.KeySchema ) {
					$expected[data.Table.KeySchema[i].AttributeName ] = { Exists: false }
				}

				var $thisQuery = {
					TableName: this.tableName,
					Item: util.anormalizeItem(item),
					Expected: $expected,
					ReturnConsumedCapacity: this.returnConsumedCapacity
				}
				this.routeCall('putItem', $thisQuery , function(err,data) {
					if (err)
						return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

					typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
				})
			})

		}
	}

	Request.prototype.replace = function(item, callback) {

		this.describeTable(this.tableName, function(err,data) {
			if (err)
				return callback(err, false)

			var $expected = {}
			for (var i in data.Table.KeySchema ) {
				$expected[ data.Table.KeySchema[i].AttributeName ] = {
					Exists: true,
					Value:   util.anormalizeValue( item[ data.Table.KeySchema[i].AttributeName ] )
				}
			}

			var $thisQuery = {
				TableName: this.tableName,
				Item: util.anormalizeItem(item),
				Expected: $expected,
				ReturnConsumedCapacity: this.returnConsumedCapacity
			}
			this.routeCall('putItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
			})
		})
	}

	Request.prototype.update = function($attrz, callback, $action ) {

		this.describeTable(this.tableName, function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback(err, false)

			var $expected = {}
			for (var i in data.Table.KeySchema )
				$expected[ data.Table.KeySchema[i].AttributeName ] = {
					Exists: true,
					Value: this.whereKey[ data.Table.KeySchema[i].AttributeName ]
				}

			var $to_update = {}
			var $a
			for (var $k in $attrz) {
				if ($attrz.hasOwnProperty($k)) {
					if ( typeof $action === 'object' ) {
						$a = $action[$k];
					} else {
						$a = $action;
					}

					if ($attrz[$k] === undefined ) {
						$to_update[$k] = {
							Action: $a ? $a : 'DELETE',
						}
					} else {
						$to_update[$k] = {
							Action: $a ? $a : 'PUT',
							Value: util.anormalizeValue($attrz[$k])
						}
					}
				}
			}
			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				AttributeUpdates : $to_update,
				Expected: $expected,
				ReturnConsumedCapacity: this.returnConsumedCapacity
			}

			this.routeCall('updateItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
			})
		})
	}

	Request.prototype.increment = function($attrz, callback ) {
		this.update($attrz, callback, 'ADD' )
	}
	Request.prototype.insert_or_increment = function( $attrz, callback ) {
		this.insert_or_update( JSON.parse(JSON.stringify($attrz)), callback, 'ADD' )
	}

	Request.prototype.insert_or_update = function( $attrz, callback, $action ) {

		this.describeTable(this.tableName, function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			// extract the hash/range keys
			for (var i in data.Table.KeySchema ) {
				this.where(data.Table.KeySchema[i].AttributeName).eq( $attrz[data.Table.KeySchema[i].AttributeName])
				delete $attrz[data.Table.KeySchema[i].AttributeName]
			}
			var $to_update = {}
			var $a
			for (var $k in $attrz) {
				if ($attrz.hasOwnProperty($k)) {
					if ( typeof $action === 'object' ) {
						$a = $action[$k];
					} else {
						$a = $action;
					}

					if ($attrz[$k] === undefined ) {
						$to_update[$k] = {
							Action: $a ? $a : 'DELETE',
						}
					} else {
						$to_update[$k] = {
							Action: $a ? $a : 'PUT',
							Value: util.anormalizeValue($attrz[$k])
						}
					}
				}
			}
			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				AttributeUpdates : $to_update,
				ReturnConsumedCapacity: this.returnConsumedCapacity
			}
			this.routeCall('updateItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
			})
		})
	}

	Request.prototype.insert_or_replace = function( item, callback ) {

		var $thisQuery = {
			TableName: this.tableName,
			Item: util.anormalizeItem(item),
			ReturnConsumedCapacity: this.returnConsumedCapacity
		}
		this.routeCall('putItem', $thisQuery , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
		})
	}

	Request.prototype.delete = function($attrz, callback ) {

		if (typeof $attrz == 'function') {
			// delete entire item, $attrz is actually the callback

			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				ReturnConsumedCapacity: this.returnConsumedCapacity
			}
			this.routeCall('deleteItem', $thisQuery , function(err,data) {
				if (err)
					return $attrz.apply( this, [ err, false ] )

				$attrz.apply( this, [ err, data, data ])
			})
		} else {
			// delete attributes
			var $to_delete = {};
			for (var $i = 0; $i < $attrz.length;$i++) {
				$to_delete[$attrz[$i]] = {
					Action: 'DELETE'
				}
			}
			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				AttributeUpdates : $to_delete,
				ReturnConsumedCapacity: this.returnConsumedCapacity
			}
			this.routeCall('updateItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
			})
		}
	}

	Request.prototype.get = function(callback) {

		var $thisQuery = {
			TableName: this.tableName,
			Key: this.whereKey,
			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.returnConsumedCapacity
		}

		if (this.AttributesToGet.length)
			$thisQuery['AttributesToGet'] = this.AttributesToGet;

		this.routeCall('getItem', $thisQuery , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeItem(data.Item), data ])
		})
	}

	Request.prototype.query = function(callback) {

		var $thisQuery = {
			TableName: this.tableName,
			KeyConditions: this.anormalizeQuery(),
			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.returnConsumedCapacity
		}
		if (this.limit_value !== null)
			$thisQuery['Limit'] = this.limit_value;

		if (this.ScanIndexForward !== true) {
				$thisQuery['ScanIndexForward'] = false;
		}
		if ( this.IndexName !== null )
			$thisQuery['IndexName'] = this.IndexName;

		if ( this.Select !== null )
			$thisQuery['Select'] = this.Select
		else if (this.AttributesToGet.length)
			$thisQuery['AttributesToGet'] = this.AttributesToGet;

		if ( this.ExclusiveStartKey !== null )
			$thisQuery['ExclusiveStartKey'] = this.ExclusiveStartKey;

		if (Object.keys(this.whereFilter).length > 0)
			$thisQuery['QueryFilter'] = this.QueryFilter()

		this.routeCall('query', $thisQuery , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey

			typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeList(data.Items), data ])
		})

		return this
	}

	Request.prototype.scan = function( callback ) {

		var $thisQuery = {
			TableName: this.tableName,
			ReturnConsumedCapacity: this.returnConsumedCapacity
		}

		if (this.limit_value !== null)
			$thisQuery['Limit'] = this.limit_value;

		if (this.AttributesToGet.length)
			$thisQuery['AttributesToGet'] = this.AttributesToGet;

		if ( this.ExclusiveStartKey !== null )
			$thisQuery['ExclusiveStartKey'] = this.ExclusiveStartKey;

		if ( this.IndexName !== null )
			$thisQuery['IndexName'] = this.IndexName;

		if (Object.keys(this.whereFilter).length > 0)
			$thisQuery['ScanFilter'] = this.QueryFilter()

		this.routeCall('scan', $thisQuery , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey

			typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeList(data.Items), data ])

		})
	}

	Request.prototype.resume = function( from ) {
		this.ExclusiveStartKey = from
		return this
	}
	Request.prototype.compare = function( $comparison, $value , $value2 ) {
		if (this.pendingFilter !== null) {
			this.whereFilter[this.pendingFilter] = { operator: $comparison, type: util.anormalizeType($value), value: $value, value2: $value2 }
			this.pendingFilter = null
			return this
		}

		if (this.pendingIf !== null) {
			this.ifFilter[this.pendingIf] = { operator: $comparison, type: util.anormalizeType($value), value: $value, value2: $value2 }
			this.pendingIf = null
			return this
		}

		this.whereOther[this.pendingKey] = { operator: $comparison, type: util.anormalizeType($value), value: $value, value2: $value2 }
		this.pendingKey = null
		return this
	}

	Request.prototype.filter = function($key) {
		this.pendingFilter = $key
		return this
	}
	// alias
	Request.prototype.having = Request.prototype.filter

	Request.prototype.if = function($key) {
		this.pendingIf = $key
		return this
	}

	Request.prototype.limit = function($limit) {
		this.limit_value = $limit;
		return this;
	}

	// comparison functions
	Request.prototype.eq = function( $value ) {
		if (this.pendingFilter !== null)
			return this.compare( 'EQ', $value )

		if (this.pendingIf !== null)
			return this.compare( 'EQ', $value )

		this.whereKey[this.pendingKey] = util.anormalizeValue( $value )

		this.pendingKey = null

		return this
	}
	Request.prototype.le = function( $value ) {
		return this.compare( 'LE', $value )
	}
	Request.prototype.lt = function( $value ) {
		return this.compare( 'LT', $value )
	}
	Request.prototype.ge = function( $value ) {
		return this.compare( 'GE', $value )
	}
	Request.prototype.gt = function( $value ) {
		return this.compare( 'GT', $value )
	}
	Request.prototype.begins_with = function( $value ) {
		return this.compare( 'BEGINS_WITH', $value )
	}
	Request.prototype.between = function( $value1, $value2 ) {
		return this.compare( 'BETWEEN', $value1, $value2 )
	}

	// QueryFilter only
	Request.prototype.ne = function( $value ) {
		return this.compare( 'NE', $value )
	}
	Request.prototype.not_null = function( ) {
		return this.compare( 'NOT_NULL' )
	}
	Request.prototype.defined = Request.prototype.not_null
	Request.prototype.null = function( $value ) {
		return this.compare( 'NULL' )
	}
	Request.prototype.undefined = Request.prototype.null
	Request.prototype.contains = function( $value ) {
		return this.compare( 'CONTAINS' )
	}
	Request.prototype.not_contains = function( $value ) {
		return this.compare( 'NOT_CONTAINS' )
	}
	Request.prototype.in = function( $value ) {
		return this.compare( 'IN' )
	}

	// helper functions ...
	Request.prototype.anormalizeQuery = function() {
		var anormal = {}
		for (var key in this.whereKey) {
			if (this.whereKey.hasOwnProperty(key)) {
					anormal[key] = {
						ComparisonOperator: 'EQ',
						AttributeValueList: [ this.whereKey[key] ]
					}
			}
		}
		for (var key in this.whereOther) {
			if (this.whereOther.hasOwnProperty(key)) {
					var whereVal = {}

					if (this.whereOther[key].hasOwnProperty('value2') && this.whereOther[key].value2 !== undefined ) {
						anormal[key] = {
							ComparisonOperator: this.whereOther[key].operator,
							AttributeValueList: [ util.anormalizeValue( this.whereOther[key].value ), util.anormalizeValue( this.whereOther[key].value2 ) ]
						}
					} else {
						anormal[key] = {
							ComparisonOperator: this.whereOther[key].operator,
							AttributeValueList: [ util.anormalizeValue( this.whereOther[key].value ) ]
						}
					}
			}
		}
		return anormal;
	}
	Request.prototype.QueryFilter = function() {
		var anormal = {}

		for (var key in this.whereFilter) {
			if (this.whereFilter.hasOwnProperty(key)) {
					var whereVal = {}

					if (this.whereFilter[key].hasOwnProperty('value2') && this.whereFilter[key].value2 !== undefined ) {
						anormal[key] = {
							ComparisonOperator: this.whereFilter[key].operator,
							AttributeValueList: [ util.anormalizeValue( this.whereFilter[key].value ), util.anormalizeValue( this.whereFilter[key].value2 ) ]
						}
					} else {
						anormal[key] = {
							ComparisonOperator: this.whereFilter[key].operator,
							AttributeValueList: [ util.anormalizeValue( this.whereFilter[key].value ) ]
						}
					}
			}
		}

		return anormal
	}


module.exports = function ( $config ) {
	return new DynamoDB($config)
}
