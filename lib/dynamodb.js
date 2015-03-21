// @todo: nice handling of throtteling https://github.com/aws/aws-sdk-js/issues/402

var AWS = require('aws-sdk')
var $db
var $lastQuery = null;
var $events = {
	error: function() {
		
	}
}
module.exports = function config ( $config ) {
	this.ALL = 1
	this.ALL_ATTRIBUTES = 1
	this.PROJECTED = 2
	this.ALL_PROJECTED_ATTRIBUTES = 2
	this.COUNT = 3	

	if ($config)
		AWS.config.update($config)

	this.client = $db = new AWS.DynamoDB()

	this.table = function( $tableName ) {
		var $ddb = new DynamoDB()
		
		$ddb.table($tableName)
		return $ddb
	}
	this.getClient = function() {
		return this.client
	}
	
	this.getLastQuery = function() {
		return $lastQuery
	}
	this.on = function( event, handler ) {
		$events[event] = handler
	}
	return this
}

function DynamoDB() {
	var $this = this
	this.Select = null
	this.AttributesToGet = []
	this.pendingKey = null
	this.pendingFilter = null
	this.whereKey = {}
	this.whereOther = {}
	this.whereFilter = {}
	this.limit_value = null
	this.IndexName = null
	this.ScanIndexForward = true
	this.LastEvaluatedKey = null
	this.ExclusiveStartKey = null
	this.ConsistentRead = false
	this.returnConsumedCapacity = 'INDEXES' // TOTAL | INDEXES | NONE
	this.ConsumedCapacity = null

	this.table = function($tableName) {
		this.table = $tableName;
		return this;
	}
	
	this.select = function() {

		if (arguments.length === 1 && arguments[0] === 1 ) {
			this.Select = 'ALL_ATTRIBUTES'
			return this
		}
		
		if (arguments.length === 1 && arguments[0] === 2 ) {
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

	this.addSelect = function($field) {
		this.AttributesToGet.push($field)
		return this
	}	
	
	this.consistentRead = function( $value ) {
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
	
	this.descending = function( ) {
		this.ScanIndexForward = false
		return this
	}
	this.index = function( $IndexName ) {
		this.IndexName = $IndexName
		return this
	}
	this.order_by = this.index

	this.where = function($key,$value1,$value2) {
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
	this.filter = function($key) {
		this.pendingFilter = $key
		return this
	}
	// alias
	this.having = this.filter

	this.limit = function($limit) {
		this.limit_value = $limit;
		return this;
	}

	this.insert = function(item, callback) {
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
				$expected[data.Table.KeySchema[i].AttributeName ] = { Exists: false }
			}

			var $thisQuery = {
				TableName: $this.table,
				Item: $this.anormalizeItem(item),
				Expected: $expected,
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
		})
	}


	this.replace = function(item, callback) {
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
					Value:   $this.anormalizeValue( item[ data.Table.KeySchema[i].AttributeName ] )
				}
			}

			var $thisQuery = {
				TableName: $this.table,
				Item: $this.anormalizeItem(item),
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

	this.update = function($attrz, callback, $action ) {
		$lastQuery = {
			TableName: this.table
		}
		$db.describeTable( $lastQuery,function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'describeTable', err , $lastQuery ] )
				return callback(err, false)
			}
			var $expected = {}
			for (var i in data.Table.KeySchema )
				$expected[ data.Table.KeySchema[i].AttributeName ] = { 
					Exists: true,
					Value: $this.whereKey[ data.Table.KeySchema[i].AttributeName ]
				}

			$to_update = {}
			for (var $k in $attrz) {
				if ($attrz.hasOwnProperty($k)) {
					$to_update[$k] = { 
						Action: $action ? $action : 'PUT',
						Value: $this.anormalizeValue($attrz[$k])
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
					return callback.apply( $this, [ err, false ] )
				}
				$this.ConsumedCapacity = data.ConsumedCapacity

				callback.apply( $this, [ err, data ])
			})
		})
	}	
	
	this.increment = function($attrz, callback ) {
		this.update($attrz, callback, 'ADD' )		
	}	
	this.insert_or_increment = function( $attrz, callback ) {
		this.insert_or_update( JSON.parse(JSON.stringify($attrz)), callback, 'ADD' )	
	}
	this.insert_or_update = function( $attrz, callback, $action ) {
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
					$to_update[$k] = { 
						Action: $action ? $action : 'PUT',
						Value: $this.anormalizeValue($attrz[$k])
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
	
	this.insert_or_replace = function( item, callback ) {
		var $thisQuery = {
			TableName: $this.table,
			Item: $this.anormalizeItem(item),
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

	this.delete = function($attrz, callback ) {
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

	this.get = function(callback) {
		var $thisQuery = {
			TableName: this.table,
			Key: this.whereKey,
			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.returnConsumedCapacity
		}

		if (this.AttributesToGet.length)
			thisQuery['AttributesToGet'] = this.AttributesToGet;

		$db.getItem( $thisQuery, function(err,data) {
			if (err) {
				$events.error.apply( $this, [ 'getItem', err , $thisQuery ] )
				return callback.apply( $this, [ err, false ] )
			}
			$this.ConsumedCapacity = data.ConsumedCapacity

			callback.apply( $this, [ err, $this.normalizeItem(data.Item) ])
		})
	}
	
	this.query = function(callback) {

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

			callback.apply( $this, [ err, $this.normalizeList(data.Items) ])
		})
		
		return this
	}

	this.scan = function( callback ) {
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

			callback.apply( $this, [ err, $this.normalizeList(data.Items) ])

		})
	}
	
	this.resume = function( from ) {
		this.ExclusiveStartKey = from
		return this
	}
	// comparison functions
	this.eq = function( $value ) {
		if (this.pendingFilter !== null)
			return this.compare( $value, 'EQ' )
	
		this.whereKey[this.pendingKey] = this.anormalizeValue( $value )

		this.pendingKey = null

		return this
	}

	this.compare = function( $value, $comparison, $value2 ) {
		if (this.pendingFilter !== null) {
			this.whereFilter[this.pendingFilter] = { operator: $comparison, type: this.anormalizeType($value), value: $value, value2: $value2 }
			this.pendingFilter = null
		
		} else {
			this.whereOther[this.pendingKey] = { operator: $comparison, type: this.anormalizeType($value), value: $value, value2: $value2 }
			this.pendingKey = null
		}
		return this
	}	
	this.le = function( $value ) {
		return this.compare( $value, 'LE' )
	}
	this.lt = function( $value ) {
		return this.compare( $value, 'LT' )
	}
	this.ge = function( $value ) {
		return this.compare( $value, 'GE' )
	}
	this.gt = function( $value ) {
		return this.compare( $value, 'GT' )
	}	
	this.begins_with = function( $value ) {
		return this.compare( $value, 'BEGINS_WITH')
	}
	this.between = function( $value1, $value2 ) {
		return this.compare( $value1, 'BETWEEN', $value2 )
	}
	
	// helper functions ...
	this.anormalizeQuery = function() {
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
							AttributeValueList: [ this.anormalizeValue( this.whereOther[key].value ), this.anormalizeValue( this.whereOther[key].value2 ) ]	
						}
					} else {
						anormal[key] = {
							ComparisonOperator: this.whereOther[key].operator,
							AttributeValueList: [ this.anormalizeValue( this.whereOther[key].value ) ]	
						}
					}
			}
		}
		return anormal;
	}

	this.QueryFilter = function() {
		var anormal = {}
		
		for (var key in this.whereFilter) {
			if (this.whereFilter.hasOwnProperty(key)) {
					var whereVal = {}
					
					if (this.whereFilter[key].hasOwnProperty('value2') && this.whereFilter[key].value2 !== undefined ) {
						anormal[key] = {
							ComparisonOperator: this.whereFilter[key].operator,
							AttributeValueList: [ this.anormalizeValue( this.whereFilter[key].value ), this.anormalizeValue( this.whereFilter[key].value2 ) ]	
						}
					} else {
						anormal[key] = {
							ComparisonOperator: this.whereFilter[key].operator,
							AttributeValueList: [ this.anormalizeValue( this.whereFilter[key].value ) ]	
						}
					}
			}
		}	
		
		return anormal
	}
	this.anormalizeList = function(list) {
		var $ret = []
		for (var $i in list) {
			$ret.push(this.anormalizeItem(list[$i]))
		}
		return $ret;
	}

	this.anormalizeItem = function(item) {
		var anormal = {}
		for (var key in item) {
			if (item.hasOwnProperty(key)) {
				anormal[key] = this.anormalizeValue(item[key])
			}
		}
		return anormal;
	}
	this.anormalizeValue = function( $value ) {
		if (typeof $value == 'boolean')
			return {'BOOL' : $value }

		if (typeof $value == 'number')
			return {'N' : $value.toString() }

		if (typeof $value == 'string')
			return {'S' : $value }

		if ($value === null) {
			return {'NULL' : true }
		}

		if (typeof $value == 'object') {

			if(Array.isArray($value) ) {
				var to_ret = {'L': [] }
				for (var i in $value) {
					if ($value.hasOwnProperty(i)) {
						to_ret.L[i] = this.anormalizeValue($value[i] )
					}
				}
				return to_ret
			}

			var to_ret = {'M': {} }
			for (var i in $value) {
				if ($value.hasOwnProperty(i)) {
					to_ret.M[i] = this.anormalizeValue($value[i] )
				}
			}
			return to_ret
		}
		// @todo: support other types
	}
	
	this.anormalizeType = function( $value ) {
		if (typeof $value == 'boolean')
			return 'BOOL'

		if (typeof $value == 'number')
			return 'N'

		if (typeof $value == 'string')
			return 'S'

		if (Array.isArray($value))
			return 'L'

		if ($value === null) {
			return 'NULL'
		}
		// @todo: support other types
	}
	
	this.normalizeList = function($items) {
		var $list = []
		for (var i in $items) {
			$list.push(this.normalizeItem($items[i]))
		}
		return $list;
	}
	this.normalizeItem = function($item) {
		var normal = {}
		for (var key in $item) {
			if ($item.hasOwnProperty(key)) {
				if ($item[key].hasOwnProperty('S'))
					normal[key] = $item[key]['S']
				
				if ($item[key].hasOwnProperty('N'))
					normal[key] = parseInt($item[key]['N'])
					
				if ($item[key].hasOwnProperty('BOOL'))
					normal[key] = $item[key]['BOOL']
					
				if ($item[key].hasOwnProperty('NULL'))
					normal[key] = null

				if ($item[key].hasOwnProperty('L')){
					normal[key] = []
					for (var i in $item[key]['L'] ) {
						if ($item[key]['L'].hasOwnProperty(i)) {
							normal[key][i] = this.normalizeItem({
									key: $item[key]['L'][i]
							}).key
						}
					}
				}

				if ($item[key].hasOwnProperty('M')) {
					normal[key] = {}
					for (var i in $item[key]['M'] ) {
						if ($item[key]['M'].hasOwnProperty(i)) {
							normal[key][i] = this.normalizeItem({
									key: $item[key]['M'][i]
							}).key
						}
					}
				}
			}
		}
		return normal;
	}
}




