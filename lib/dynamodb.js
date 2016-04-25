'use strict';

// @todo: nice handling of throtteling https://github.com/aws/aws-sdk-js/issues/402

	var util = require('./util')
	var AWS = require('aws-sdk')
	var filterOperators = {
		EQ: '=',
		NE: '<>',
		LT: '<',
		LE: '<=',
		GT: '>',
		GE: '>=',

		BETWEEN: 'BETWEEN',
		IN: 'IN',

		NOT_NULL: 'attribute_exists',
		NULL:     'attribute_not_exists',

		BEGINS_WITH: 'begins_with',
		CONTAINS: 'contains',
		NOT_CONTAINS: 'not_contains',

	 }

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
	DynamoDB.prototype.SS = function(data) {
		if (Array.isArray(data))
			return new util.Raw({'SS': data })
		throw new Error('SS: argument should be a array')
	}
	DynamoDB.prototype.stringSet = DynamoDB.prototype.SS


	DynamoDB.prototype.N = function(data) {
		if (typeof data === "number" || typeof data === "string")
			return new util.Raw({'N': data.toString() })
		throw new Error('N: argument should be a number or string that converts to a number')
	}
	DynamoDB.prototype.number = DynamoDB.prototype.N


	DynamoDB.prototype.S = function(data) {
		if (typeof data === "string")
			return new util.Raw({'S': data })

		throw new Error('S: argument should be a string')
	}
	DynamoDB.prototype.string = DynamoDB.prototype.S

	DynamoDB.prototype.NS = function(data) {
		if (Array.isArray(data)) {
			var $to_ret = []
			return new util.Raw({'NS': data.map(function(el,idx) { return el.toString() }) })
		}
		throw new Error('NS: argument should be an Array')
	}
	DynamoDB.prototype.numberSet = DynamoDB.prototype.NS


	DynamoDB.prototype.L = function(data) {
		if (Array.isArray(data)) {
			var $to_ret = []
			for (var i in data) {
				$to_ret[i] = util.anormalizeValue( data[i] )
			}
			return new util.Raw({'L': $to_ret })
		}
		throw new Error('L: argument should be an Array')
	}
	DynamoDB.prototype.list = DynamoDB.prototype.L



	DynamoDB.prototype.add = function(data, datatype ) {
		// if datatype is defined then force it
		if (typeof datatype == "string") {
			switch (datatype) {
				case 'N':  return this.add(this.N(data));break
				case 'NS': return this.add(this.NS(data));break
				case 'SS': return this.add(this.SS(data));break
				case 'L':  return this.add(this.L(data));break

				// unsupported by AWS
				case 'B':
				case 'BOOL':
				case 'NULL':
				case 'S':
					throw new Error('ADD action is not supported for the type: ' + datatype );
					break

				// unsupported by aws-dynamodb
				case 'BS':
				case 'M':
				default:
					 throw new Error('ADD action is not supported by aws-dynamodb for type: ' + datatype );
					 break
			}
			return
		}

		// check if it is instance of Raw
		if ((typeof data === "object") && (data instanceof util.Raw )) {
			return new DynamoDB.Raw({
				Action: 'ADD',
				Value: data.data
			})
		}

		// autodetect

		// number or undefined: increment number, eg add(5), add()
		if ((typeof data === "number") || (typeof data === "undefined"))
			return this.add(this.N(data || 1));

		if (Array.isArray(data))
			return this.add(this.L(data));

		// further autodetection
		throw new Error('ADD action is not supported by aws-dynamodb for type: ' + typeof data );
	}

	DynamoDB.prototype.del = function(data, datatype) {
		// if datatype is defined then force it
		if (typeof datatype == "string") {
			switch (datatype) {
				case 'NS': return this.del(this.NS(data));break
				case 'SS': return this.del(this.SS(data));break

				// unsupported by AWS
				case 'S':
				case 'N':
				case 'L':
					throw new Error('DELETE action with value is not supported for the type: ' + datatype );
					break

				// unsupported by aws-dynamodb
				case 'B':
				case 'BOOL':
				case 'NULL':
				case 'BS':
				case 'M':
				default:
					 throw new Error('DELETE action is not supported by aws-dynamodb for type: ' + datatype );
					 break
			}
			return
		}

		// check if it is instance of Raw
		if ((typeof data === "object") && (data instanceof util.Raw )) {
			return new DynamoDB.Raw({
				Action: 'DELETE',
				Value: data.data
			})
		}

		// autodetect

		if (!arguments.length)
			return new DynamoDB.Raw({ Action: 'DELETE'})

		throw new Error('DELETE action is not supported by aws-dynamodb for type: ' + typeof data );
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

	// select
	DynamoDB.prototype.ALL = 1
	DynamoDB.prototype.ALL_ATTRIBUTES = 1
	DynamoDB.prototype.PROJECTED = 2
	DynamoDB.prototype.ALL_PROJECTED_ATTRIBUTES = 2
	DynamoDB.prototype.COUNT = 3

	// ReturnValues
	DynamoDB.prototype.NONE = 'NONE'
	DynamoDB.prototype.ALL_OLD = 'ALL_OLD'
	DynamoDB.prototype.UPDATED_OLD = 'UPDATED_OLD'
	DynamoDB.prototype.ALL_NEW = 'ALL_NEW'
	DynamoDB.prototype.UPDATED_NEW = 'UPDATED_NEW'

	// ReturnConsumedCapacity
	//DynamoDB.prototype.NONE = 'NONE'
	DynamoDB.prototype.TOTAL = 'TOTAL'
	DynamoDB.prototype.INDEXES = 'INDEXES'

	function Request( $client, $events ) {
		this.events = $events
		this.client = $client

		this.Select = null

		this.AttributesToGet = [] // deprecated in favor of ProjectionExpression
		this.ProjectionExpression = undefined
		this.ExpressionAttributeNames = undefined
		this.ExpressionAttributeValues = undefined
		this.FilterExpression = undefined

		this.pendingKey = null
		this.pendingFilter = null
		this.pendingIf = null
		this.whereKey = {}
		this.whereOther = {}
		this.whereFilter = {}
		this.whereFilterExpression = []  // same as whereFilter, except we can support same attribute compared multiple times
		this.ifFilter = {}
		this.limit_value = null
		this.IndexName = null
		this.ScanIndexForward = true
		this.LastEvaluatedKey = null
		this.ExclusiveStartKey = null
		this.ConsistentRead = false
		this.ReturnConsumedCapacity = 'TOTAL'
		this.ReturnValues = DynamoDB.NONE
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
	Request.prototype.return = function(rv) {
		this.ReturnValues = rv
		return this
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

	Request.prototype.return_consumed_capacity = function( $value ) { this.ReturnConsumedCapacity = $value; return this }
	Request.prototype.ReturnConsumedCapacity = Request.prototype.return_consumed_capacity

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

			this.describeTable(this.tableName, function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				for (var i in data.Table.KeySchema ) {
					this.if(data.Table.KeySchema[i].AttributeName).not_exists()
				}

				var $thisQuery = {
					TableName: this.tableName,
					Item: util.anormalizeItem(item),
					Expected: util.buildExpected( this.ifFilter ),
					ReturnConsumedCapacity: this.ReturnConsumedCapacity,
					ReturnValues: this.ReturnValues
				}

				this.routeCall('putItem', $thisQuery , function(err,data) {
					if (err)
						return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

					typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeItem(data.Attributes || {}), data ])
				})
			})
	}

	Request.prototype.replace = function(item, callback) {

		this.describeTable(this.tableName, function(err,data) {
			if (err)
				return callback(err, false)

			for (var i in data.Table.KeySchema ) {
				this.if(data.Table.KeySchema[i].AttributeName).eq(item[ data.Table.KeySchema[i].AttributeName ])
			}

			var $thisQuery = {
				TableName: this.tableName,
				Item: util.anormalizeItem(item),
				Expected: util.buildExpected( this.ifFilter ),
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}

			this.routeCall('putItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeItem(data.Attributes || {}), data ])
			})
		})
	}

	Request.prototype.update = function($attrz, callback, $action ) {

		this.describeTable(this.tableName, function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback(err, false)

			for (var i in data.Table.KeySchema ) {
				this.if(data.Table.KeySchema[i].AttributeName).eq(util.normalizeItem({key: this.whereKey[ data.Table.KeySchema[i].AttributeName ]}).key )
			}

			var $to_update = {}
			for (var $k in $attrz) {
				if ($attrz.hasOwnProperty($k)) {
					if ($attrz[$k] === undefined ) {
						$to_update[$k] = {
							Action: $action ? $action : 'DELETE',
						}
					} else if ($attrz[$k] instanceof DynamoDB.Raw) {
						$to_update[$k] = $attrz[$k].getRawData()
					} else {
						$to_update[$k] = {
							Action: $action ? $action : 'PUT',
							Value: util.anormalizeValue($attrz[$k])
						}
					}
				}
			}
			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				AttributeUpdates : $to_update,
				Expected: util.buildExpected( this.ifFilter ),
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}

			this.routeCall('updateItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeItem(data.Attributes || {}), data ])
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
			for (var $k in $attrz) {
				if ($attrz.hasOwnProperty($k)) {
					if ($attrz[$k] === undefined ) {
						$to_update[$k] = {
							Action: $action ? $action : 'DELETE',
						}
					} else if ($attrz[$k] instanceof DynamoDB.Raw) {
						$to_update[$k] = $attrz[$k].getRawData()
					} else {
						$to_update[$k] = {
							Action: $action ? $action : 'PUT',
							Value: util.anormalizeValue($attrz[$k])
						}
					}
				}
			}
			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				AttributeUpdates : $to_update,
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}
			this.routeCall('updateItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeItem(data.Attributes || {}), data ])
			})
		})
	}

	Request.prototype.insert_or_replace = function( item, callback ) {

		var $thisQuery = {
			TableName: this.tableName,
			Item: util.anormalizeItem(item),
			ReturnConsumedCapacity: this.ReturnConsumedCapacity,
			ReturnValues: this.ReturnValues
		}
		this.routeCall('putItem', $thisQuery , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeItem(data.Attributes || {}), data ])
		})
	}

	Request.prototype.delete = function($attrz, callback ) {

		if (typeof $attrz == 'function') {
			// delete entire item, $attrz is actually the callback

			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}
			this.routeCall('deleteItem', $thisQuery , function(err,data) {
				if (err)
					return $attrz.apply( this, [ err, false ] )

				$attrz.apply( this, [ err, util.normalizeItem(data.Attributes || {}), data ])
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
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}
			this.routeCall('updateItem', $thisQuery , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeItem(data.Attributes || {}), data ])
			})
		}
	}

	Request.prototype.get = function(callback) {

		this.buildProjectionExpression() // this will set ProjectionExpression and ExpressionAttributeNames
		var $thisQuery = {
			TableName: this.tableName,
			Key: this.whereKey,
			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.ReturnConsumedCapacity,

			ProjectionExpression: this.ProjectionExpression,
			ExpressionAttributeNames: this.ExpressionAttributeNames,
		}

		this.routeCall('getItem', $thisQuery , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeItem(data.Item), data ])
		})
	}

	Request.prototype.query = function(callback) {
		this.buildProjectionExpression() // this will set ProjectionExpression and ExpressionAttributeNames
		this.buildFilterExpression()
		var $thisQuery = {
			TableName: this.tableName,
			KeyConditions: this.anormalizeQuery(),
			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.ReturnConsumedCapacity,

			"Select": this.Select !== null ? this.Select : undefined,
			//AttributesToGet: this.AttributesToGet.length ? this.AttributesToGet : undefined

			ProjectionExpression: this.ProjectionExpression,
			ExpressionAttributeNames: this.ExpressionAttributeNames,

			FilterExpression: this.FilterExpression,

			ExpressionAttributeValues: this.ExpressionAttributeValues,
		}
		if (this.limit_value !== null)
			$thisQuery['Limit'] = this.limit_value;

		if (this.ScanIndexForward !== true) {
				$thisQuery['ScanIndexForward'] = false;
		}
		if ( this.IndexName !== null )
			$thisQuery['IndexName'] = this.IndexName;

		if ( this.ExclusiveStartKey !== null )
			$thisQuery['ExclusiveStartKey'] = this.ExclusiveStartKey;

		this.routeCall('query', $thisQuery , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey

			typeof callback !== "function" ? null : callback.apply( this, [ err, util.normalizeList(data.Items), data ])
		})

		return this
	}

	Request.prototype.scan = function( callback ) {
		this.buildProjectionExpression() // this will set ProjectionExpression and ExpressionAttributeNames
		this.buildFilterExpression()
		var $thisQuery = {
			TableName: this.tableName,
			"Select": this.Select !== null ? this.Select : undefined,

			ProjectionExpression: this.ProjectionExpression,
			ExpressionAttributeNames: this.ExpressionAttributeNames,

			FilterExpression: this.FilterExpression,

			ExpressionAttributeValues: this.ExpressionAttributeValues,

			ReturnConsumedCapacity: this.ReturnConsumedCapacity
		}

		if (this.limit_value !== null)
			$thisQuery['Limit'] = this.limit_value;


		if ( this.ExclusiveStartKey !== null )
			$thisQuery['ExclusiveStartKey'] = this.ExclusiveStartKey;

		if ( this.IndexName !== null )
			$thisQuery['IndexName'] = this.IndexName;

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
			this.whereFilter[this.pendingFilter] = {
				operator: $comparison,
				type: util.anormalizeType($value),
				value: $value,
				value2: $value2
			}
			this.whereFilterExpression.push({
				attribute: this.pendingFilter,
				operator: $comparison,
				type: util.anormalizeType($value),
				value: $value,
				value2: $value2
			})
			this.pendingFilter = null
			return this
		}

		if (this.pendingIf !== null) {
			if ($comparison == 'EQ') {
				this.ifFilter[this.pendingIf] = new util.Raw({ Exists: true, Value: util.anormalizeValue($value) })
			} else {
				this.ifFilter[this.pendingIf] = { operator: $comparison, type: util.anormalizeType($value), value: $value, value2: $value2 }
			}
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
		return this.compare( 'CONTAINS', $value )
	}
	Request.prototype.not_contains = function( $value ) {
		return this.compare( 'NOT_CONTAINS', $value )
	}
	Request.prototype.in = function( $value ) {
		return this.compare( 'IN', $value )
	}

	// Expected only
	Request.prototype.exists = function( ) {
		if (this.pendingIf !== null) {
			this.ifFilter[this.pendingIf] = new util.Raw({ Exists: true })

			this.pendingIf = null
			return this
		}
		return this
	}
	Request.prototype.not_exists = function( ) {
		if (this.pendingIf !== null) {
			this.ifFilter[this.pendingIf] = new util.Raw({ Exists: false })
			this.pendingIf = null
			return this
		}
		return this
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

	Request.prototype.registerExpressionAttributeName = function(item) {
		var $this = this

		if ($this.ExpressionAttributeNames === undefined)
			$this.ExpressionAttributeNames = {}

		return item.split('.').map(function(attName) {

			var attSpecialName = '#' + attName

			if (attName.indexOf('[') !== -1) {
				attSpecialName = attName.split('[').map(function(v) {
					if (v[v.length-1] == ']')
						return v

					$this.ExpressionAttributeNames[ '#'+v ] = v
					return '#' + v
				}).join('[')
			} else {
				if (attSpecialName[0] === '#')
					$this.ExpressionAttributeNames[ attSpecialName ] = attName
			}

			return attSpecialName
		}).join('.')
	}
	Request.prototype.registerExpressionAttributeValue = function(name, value) {
		if (this.ExpressionAttributeValues === undefined)
			this.ExpressionAttributeValues = {}

		var attNameValue = ':' + name.split('.').join('_').split('[').join('_idx_').split(']').join('')

		var attNameValueVersion = 1;
		while (this.ExpressionAttributeValues.hasOwnProperty(attNameValue+'_v'+attNameValueVersion)) attNameValueVersion++

		this.ExpressionAttributeValues[attNameValue+'_v'+attNameValueVersion] = util.anormalizeValue( value )

		return attNameValue+'_v'+attNameValueVersion
	}

	Request.prototype.buildProjectionExpression = function(idx) {
		if (!this.AttributesToGet.length)
			return

		idx = idx || 'att'

		var $this = this

		this.ProjectionExpression = this.AttributesToGet.map(function(item) {
			return $this.registerExpressionAttributeName(item)
		}).join(', ')
	}

	Request.prototype.buildFilterExpression = function(idx) {
		var $this = this

		if (!this.whereFilterExpression.length)
			return

		var ret = []
		this.FilterExpression = this.whereFilterExpression.map(function(whereFilter) {
			var key = whereFilter.attribute

			switch (filterOperators[whereFilter.operator]) {
				case '=':
				case '<>':
				case '<':
				case '<=':
				case '>':
				case '>=':
					return $this.registerExpressionAttributeName(whereFilter.attribute) + ' ' +
						filterOperators[whereFilter.operator] + ' ' +
						$this.registerExpressionAttributeValue(whereFilter.attribute, whereFilter.value)
					break

				case  'BETWEEN':
					return $this.registerExpressionAttributeName(whereFilter.attribute) + ' BETWEEN ' +
						$this.registerExpressionAttributeValue(whereFilter.attribute+'_1', whereFilter.value) +
						' AND ' +
						$this.registerExpressionAttributeValue(whereFilter.attribute+'_2', whereFilter.value2)
					break;

				case 'IN':
					return $this.registerExpressionAttributeName(whereFilter.attribute) + ' IN (' +
							whereFilter.value.map(function(v, idx) {
								return $this.registerExpressionAttributeValue(whereFilter.attribute+'_' + idx, v)
							}).join(',')  +
						' )'
					break;


				case 'attribute_exists':
					return 'attribute_exists(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ')'
					break;

				case 'attribute_not_exists':
					return 'attribute_not_exists(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ')'
					break;

				case 'begins_with':
					return 'begins_with(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ', ' + $this.registerExpressionAttributeValue(whereFilter.attribute, whereFilter.value) + ')'
					break;

				case 'contains':
					return 'contains(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ', ' + $this.registerExpressionAttributeValue(whereFilter.attribute, whereFilter.value) + ')'
					break;

				case 'not_contains':
					return 'NOT contains(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ', ' + $this.registerExpressionAttributeValue(whereFilter.attribute, whereFilter.value) + ')'
					break;
				//attribute_type (path, type)
				//size (path)
			}
		}).map(function(v) { return '( ' + v + ' )'}).join(" AND \n")
	}
DynamoDB.Raw = function(data) {
	this.data = data
}
DynamoDB.Raw.prototype.getRawData = function() {
	return this.data
}
module.exports = function ( $config ) {
	return new DynamoDB($config)
}
