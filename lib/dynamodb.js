
// @todo: nice handling of throtteling https://github.com/aws/aws-sdk-js/issues/402
var util = require('./util')
var AWS = require('aws-sdk')
var $db
var $lastQuery = null;
var $events = {
	error: function() {
		
	}
}

function DynamoDB ( $config ) {
	if ($config instanceof AWS.DynamoDB) {
		this.client = $db = $config
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
			this.client = $db = new AWS.DynamoDB($config)	
		else
			this.client = $db = new AWS.DynamoDB()

	}
	
	this.table = function( $tableName ) {
		var $ddb = new Request(this.client)
		
		$ddb.table($tableName)
		return $ddb
	}

	return this
}

	DynamoDB.prototype.getClient = function() {
		return this.client
	}
	
	DynamoDB.prototype.getLastQuery = function() {
		return $lastQuery
	}
	DynamoDB.prototype.on = function( event, handler ) {
		$events[event] = handler
	}
	DynamoDB.ALL = 1
	DynamoDB.ALL_ATTRIBUTES = 1
	DynamoDB.PROJECTED = 2
	DynamoDB.ALL_PROJECTED_ATTRIBUTES = 2
	DynamoDB.COUNT = 3	
	
	function Request($client) {
		
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

	Request.prototype.table = function($tableName) {
		this.table = $tableName;
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
		var $this = this
		var $thisQuery = {
			TableName: this.table
		}
		
		if (Object.keys(this.ifFilter).length > 0) {
			// use if(), ignore key condition
			var $thisQuery = {
				TableName: $this.table,
				Item: util.anormalizeItem(item),
				Expected: util.buildExpected( this.ifFilter ),
				ReturnConsumedCapacity: $this.returnConsumedCapacity
			}
			$db.putItem( $thisQuery, function(err,data) {
				if (err) {
					$events.error.apply( $this, [ 'putItem', err , $thisQuery ] )
					return callback.apply( $this, [ err, false ] )
				}

				$this.ConsumedCapacity = data.ConsumedCapacity
				
				typeof callback !== "function" ? null : callback.apply( $this, [ err, data ])
			})

		} else {
			// deprecated, to be removed in 0.2.x, will use if() instead
			$db.describeTable( $thisQuery,function(err,data) {
				if (err) {
					$events.error.apply( $this, [ 'describeTable', err , $thisQuery ] )
					return typeof callback !== "function" ? null : callback.apply( $this, [ err, false ] )
				}
					
				var $expected = {}
				for (var i in data.Table.KeySchema ) {
					$expected[data.Table.KeySchema[i].AttributeName ] = { Exists: false }
				}

				var $thisQuery = {
					TableName: $this.table,
					Item: util.anormalizeItem(item),
					Expected: $expected,
					ReturnConsumedCapacity: $this.returnConsumedCapacity
				}
				$db.putItem( $thisQuery, function(err,data) {
					if (err) {
						$events.error.apply( $this, [ 'putItem', err , $thisQuery ] )
						return callback.apply( $this, [ err, false ] )
					}

					$this.ConsumedCapacity = data.ConsumedCapacity
					
					typeof callback !== "function" ? null : callback.apply( $this, [ err, data ])
				})
			})
		
		}		
	}

	Request.prototype.replace = function(item, callback) {
		var $this = this
		var $thisQuery = {
			TableName: this.table
		}
		$db.describeTable( $thisQuery,function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'describeTable', err , $thisQuery ] )
				return callback(err, false)
			}
				
			var $expected = {}
			for (var i in data.Table.KeySchema ) {
				$expected[ data.Table.KeySchema[i].AttributeName ] = { 
					Exists: true, 
					Value:   util.anormalizeValue( item[ data.Table.KeySchema[i].AttributeName ] )
				}
			}

			var $thisQuery = {
				TableName: $this.table,
				Item: util.anormalizeItem(item),
				Expected: $expected,
				ReturnConsumedCapacity: $this.returnConsumedCapacity
			}
			$db.putItem($thisQuery, function(err,data) {
				if (err) {
					$events.error.apply( $this, [ 'putItem', err , $thisQuery ] )
					return callback.apply( $this, [ err, false ] )
				}

				$this.ConsumedCapacity = data.ConsumedCapacity

				callback.apply( $this, [ err, data ])
			})
		})
	}	

	Request.prototype.update = function($attrz, callback, $action ) {
		var $this = this
		$lastQuery = {
			TableName: this.table
		}
		$db.describeTable( $lastQuery,function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'describeTable', err , $lastQuery ] )
				return typeof callback !== "function" ? null : callback(err, false)
			}
			var $expected = {}
			for (var i in data.Table.KeySchema )
				$expected[ data.Table.KeySchema[i].AttributeName ] = { 
					Exists: true,
					Value: $this.whereKey[ data.Table.KeySchema[i].AttributeName ]
				}

			var $to_update = {}
			for (var $k in $attrz) {
				if ($attrz.hasOwnProperty($k)) {
					if ($attrz[$k] === undefined ) {
						$to_update[$k] = { 
							Action: $action ? $action : 'DELETE',
						}
					} else {
						$to_update[$k] = { 
							Action: $action ? $action : 'PUT',
							Value: util.anormalizeValue($attrz[$k])
						}
					}
				}
			}
			var $thisQuery = {
				TableName: $this.table,
				Key: $this.whereKey,
				AttributeUpdates : $to_update,
				Expected: $expected,
				ReturnConsumedCapacity: $this.returnConsumedCapacity
			}

			$db.updateItem( $thisQuery, function(err,data) {
				if (err) {
					$events.error.apply( $this, [ 'updateItem', err , $thisQuery ] )
					return typeof callback !== "function" ? null : callback.apply( $this, [ err, false ] )
				}
				$this.ConsumedCapacity = data.ConsumedCapacity

				typeof callback !== "function" ? null : callback.apply( $this, [ err, data ])
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
		var $this = this
		var $thisQuery = {
			TableName: this.table
		}
		$db.describeTable( $thisQuery,function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'describeTable', err , $thisQuery ] )
				return callback.apply( $this, [ err, false ] )
			}
			// extract the hash/range keys
			for (var i in data.Table.KeySchema ) {
				$this.where(data.Table.KeySchema[i].AttributeName).eq( $attrz[data.Table.KeySchema[i].AttributeName])
				delete $attrz[data.Table.KeySchema[i].AttributeName]
			}
			$to_update = {}
			for (var $k in $attrz) {
				if ($attrz.hasOwnProperty($k)) {
					if ($attrz[$k] === undefined ) {
						$to_update[$k] = { 
							Action: $action ? $action : 'DELETE',
						}
					} else {
						$to_update[$k] = { 
							Action: $action ? $action : 'PUT',
							Value: util.anormalizeValue($attrz[$k])
						}
					}
				}
			}
			var $thisQuery = {
				TableName: $this.table,
				Key: $this.whereKey,
				AttributeUpdates : $to_update,
				ReturnConsumedCapacity: $this.returnConsumedCapacity
			}
			$db.updateItem( $thisQuery , function(err,data) {
				if (err) {
					$events.error.apply( $this, [ 'updateItem', err , $thisQuery ] )
					return callback.apply( $this, [ err, false ] )
				}
				$this.ConsumedCapacity = data.ConsumedCapacity

				callback.apply( $this, [ err, data ])
			})
		})
	}

	Request.prototype.insert_or_replace = function( item, callback ) {
		var $this = this
		var $thisQuery = {
			TableName: $this.table,
			Item: util.anormalizeItem(item),
			ReturnConsumedCapacity: $this.returnConsumedCapacity
		}
		$db.putItem( $thisQuery, function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'putItem', err , $thisQuery ] )
				return callback.apply( $this, [ err, false ] )
			}
			$this.ConsumedCapacity = data.ConsumedCapacity

			callback.apply( $this, [ err, data ])
		})
	}

	Request.prototype.delete = function($attrz, callback ) {
		var $this = this
		if (typeof $attrz == 'function') {
			// delete entire item, $attrz is actually the callback
			
			var $thisQuery = {
				TableName: this.table,
				Key: this.whereKey,
				ReturnConsumedCapacity: this.returnConsumedCapacity
			}
			$db.deleteItem( $thisQuery, function(err,data) {
				if (err) {
					$events.error.apply( $this, [ 'deleteItem', err , $thisQuery ] )
					return $attrz.apply( $this, [ err, false ] )
				}
				$this.ConsumedCapacity = data.ConsumedCapacity

				$attrz.apply( $this, [ err, data ])
			})
		} else {
			// delete attributes
			$to_delete = {};
			for (var $i = 0; $i < $attrz.length;$i++) {
				$to_delete[$attrz[$i]] = {
					Action: 'DELETE'
				}
			}
			var $thisQuery = {
				TableName: this.table,
				Key: this.whereKey,
				AttributeUpdates : $to_delete,
				ReturnConsumedCapacity: this.returnConsumedCapacity
			}
			$db.updateItem($thisQuery, function(err,data) {
				if (err) {
					$events.error.apply( $this, [ 'updateItem', err , $thisQuery ] )
					return callback.apply( $this, [ err, false ] )
				}
				$this.ConsumedCapacity = data.ConsumedCapacity

				callback.apply( $this, [ err, data ])
			})
		}
	}

	Request.prototype.get = function(callback) {
		var $this = this
		var $thisQuery = {
			TableName: this.table,
			Key: this.whereKey,
			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.returnConsumedCapacity
		}

		if (this.AttributesToGet.length)
			$thisQuery['AttributesToGet'] = this.AttributesToGet;

		$db.getItem( $thisQuery, function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'getItem', err , $thisQuery ] )
				return callback.apply( $this, [ err, false ] )
			}
			$this.ConsumedCapacity = data.ConsumedCapacity

			callback.apply( $this, [ err, util.normalizeItem(data.Item) ])
		})
	}

	Request.prototype.query = function(callback) {
		var $this = this
		var $thisQuery = {
			TableName: this.table,
			KeyConditions: $this.anormalizeQuery(),
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

		$db.query( $thisQuery , function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'query', err , $thisQuery ] )
				return callback.apply( $this, [ err, false ] )
			}
			$this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey

			$this.ConsumedCapacity = data.ConsumedCapacity

			callback.apply( $this, [ err, util.normalizeList(data.Items) ])
		})
		
		return this
	}

	Request.prototype.scan = function( callback ) {
		var $this = this
		var $thisQuery = {
			TableName: this.table,
			ReturnConsumedCapacity: $this.returnConsumedCapacity
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

		$db.scan( $thisQuery , function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'scan', err , $thisQuery ] )
				return callback.apply( $this, [ err, false ] )
			}
			$this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey
			
			$this.ConsumedCapacity = data.ConsumedCapacity

			callback.apply( $this, [ err, util.normalizeList(data.Items) ])

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


module.exports = DynamoDB
