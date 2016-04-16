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
		this.ReturnConsumedCapacity = 'TOTAL'
		this.ReturnValues = DynamoDB.NONE
		this.ConsumedCapacity = null
		this.ProjectionExpression = null
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
	Request.prototype.projectionExpression = function(expression) {
		this.ProjectionExpression = expression;
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

		var $thisQuery = {
			TableName: this.tableName,
			Key: this.whereKey,
			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.ReturnConsumedCapacity
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
			ReturnConsumedCapacity: this.ReturnConsumedCapacity
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
			ReturnConsumedCapacity: this.ReturnConsumedCapacity
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
		return this.compare( 'CONTAINS' )
	}
	Request.prototype.not_contains = function( $value ) {
		return this.compare( 'NOT_CONTAINS' )
	}
	Request.prototype.in = function( $value ) {
		return this.compare( 'IN' )
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

DynamoDB.Raw = function(data) {
	this.data = data
}
DynamoDB.Raw.prototype.getRawData = function() {
	return this.data
}
module.exports = function ( $config ) {
	return new DynamoDB($config)
}
