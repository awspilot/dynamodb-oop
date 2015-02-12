var AWS = require('aws-sdk')
var $db
var $lastQuery = null;

module.exports = function config ( $config ) {
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

	return this
}

function DynamoDB() {
	var $this = this
	this.select = []
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
	

	this.table = function($tableName) {
		this.table = $tableName;
		return this;
	}
	
	this.select = function() {
		this.select = []

		for (var i = 0; i < arguments.length; i++)
			this.select.push(arguments[i])

		return this;
	}

	this.addSelect = function($field) {
		this.select.push($field)
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
	this.order_by = function( $IndexName ) {
		this.IndexName = $IndexName
		return this
	}
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
		$db.describeTable({
			TableName: this.table
		},function(err,data) {
			if (err)
				return callback(err, false)
				
			var $expected = {}
			for (var i in data.Table.KeySchema ) {
				$expected[data.Table.KeySchema[i].AttributeName ] = { Exists: false }
			}

			$db.putItem({
				TableName: $this.table,
				Item: $this.anormalizeItem(item),
				Expected: $expected
			}, function(err,data) {
				if (err)
					return callback(err, false)

				callback( err, data )
			})
		})
	}


	this.replace = function(item, callback) {
		$db.describeTable({
			TableName: this.table
		},function(err,data) {
			if (err)
				return callback(err, false)
				
			var $expected = {}
			for (var i in data.Table.KeySchema ) {
				$expected[ data.Table.KeySchema[i].AttributeName ] = { 
					Exists: true, 
					Value:   $this.anormalizeValue( item[ data.Table.KeySchema[i].AttributeName ] )
				}
			}

			$db.putItem({
				TableName: $this.table,
				Item: $this.anormalizeItem(item),
				Expected: $expected
			}, function(err,data) {
				if (err)
					return callback(err, false)

				callback( err, data )
			})
		})
	}	

	this.update = function($attrz, callback, $action ) {
		$db.describeTable({
			TableName: this.table
		},function(err,data) {
			if (err)
				return callback(err, false)
				
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
			var thisQuery = {
				TableName: $this.table,
				Key: $this.whereKey,
				AttributeUpdates : $to_update,
				Expected: $expected
			}

			$lastQuery = thisQuery
			$db.updateItem( thisQuery, function(err,data) {
				if (err)
					return callback(err, false)

				callback( err, data )
			})
		})
	}	
	
	this.increment = function($attrz, callback ) {
		this.update($attrz, callback, 'ADD' )		
	}	
	
	this.insert_or_update = function( $attrz, callback ) {
		$db.describeTable({
			TableName: this.table
		},function(err,data) {
			if (err)
				return callback(err, false)
		
			// extract the hash/range keys
			for (var i in data.Table.KeySchema ) {			
				$this.where(data.Table.KeySchema[i].AttributeName,$attrz[data.Table.KeySchema[i].AttributeName])
				delete $attrz[data.Table.KeySchema[i].AttributeName]
			}
			$to_update = {}
			for (var $k in $attrz) {
				if ($attrz.hasOwnProperty($k)) {
					$to_update[$k] = { 
						Action: 'PUT',
						Value: $this.anormalizeValue($attrz[$k])
					}
				}
			}
			$db.updateItem({
				TableName: $this.table,
				Key: $this.whereKey,
				AttributeUpdates : $to_update
			}, function(err,data) {
				if (err)
					return callback(err, false)

				callback( err, data )
			})
		})
	}
	
	this.insert_or_replace = function( item, callback ) {
		$db.putItem({
			TableName: $this.table,
			Item: $this.anormalizeItem(item)
		}, function(err,data) {
			if (err)
				return callback(err, false)

			callback( err, data )
		})
	}

	this.delete = function($attrz, callback ) {
		if (typeof $attrz == 'function') {
			// delete entire item, $attrz is actually the callback
			$db.deleteItem({
				TableName: this.table,
				Key: this.whereKey
			}, function(err,data) {
				if (err)
					return $attrz(err, false)

				$attrz( err, data )
			})
		} else {
			// delete attributes
			$to_delete = {};
			for (var $i = 0; $i < $attrz.length;$i++) {
				$to_delete[$attrz[$i]] = {
					Action: 'DELETE'
				}
			}
			$db.updateItem({
				TableName: this.table,
				Key: this.whereKey,
				AttributeUpdates : $to_delete
			}, function(err,data) {
				if (err)
					return callback(err, false)

				callback( err, data )
			})
		}
	}

	this.get = function(callback) {
		var thisQuery = {
			TableName: this.table,
			Key: this.whereKey,
			ConsistentRead: this.ConsistentRead
		}

		if (this.select.length)
			thisQuery['AttributesToGet'] = this.select;

		$db.getItem( thisQuery, function(err,data) {
			if (err)
				return callback(err, false)

			callback(err, $this.normalizeItem(data.Item))
		})
	}
	
	this.query = function(callback) {

		var thisQuery = {
			TableName: this.table,
			KeyConditions: $this.anormalizeQuery(),
			ConsistentRead: this.ConsistentRead
		}
		if (this.limit_value !== null)
			thisQuery['Limit'] = this.limit_value;

		if (this.ScanIndexForward !== true) {
				thisQuery['ScanIndexForward'] = false;
		}
		if ( this.IndexName !== null )
			thisQuery['IndexName'] = this.IndexName;

		if (this.select.length)
			thisQuery['AttributesToGet'] = this.select;

		if ( this.ExclusiveStartKey !== null )
			thisQuery['ExclusiveStartKey'] = this.ExclusiveStartKey;

		if (Object.keys(this.whereFilter).length > 0)
			thisQuery['QueryFilter'] = this.QueryFilter()

		$lastQuery = thisQuery
		$db.query( thisQuery , function(err,data) {
			if (err)
				return callback(err, false)

			$this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey
			callback(err, $this.normalizeList(data.Items))
		})
		
		return this
	}

	this.scan = function( callback ) {
		var thisQuery = {
			TableName: this.table
		}
		
		if (this.limit_value !== null)
			thisQuery['Limit'] = this.limit_value;

		if (this.select.length)
			thisQuery['AttributesToGet'] = this.select;
			
		$lastQuery = thisQuery
		$db.scan( thisQuery , function(err,data) {
			if (err)
				return callback(err, false)

			$this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey
			callback(err, $this.normalizeList(data.Items))
		})
	}
	
	// comparison functions
	this.eq = function( $value ) {
		if (this.pendingFilter !== null) {
			return this.compare( $value, 'EQ' )
			return this
		}
	
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

		if ($value.constructor === Array) {
			var to_ret = {'L': [] }
			for (var i in $value) {
				if ($value.hasOwnProperty(i)) {
					to_ret.L[i] = this.anormalizeValue($value[i] )
				}
			}
			return to_ret
		}

		if (typeof $value == 'object') {
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

		if ($value.constructor === Array)
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

