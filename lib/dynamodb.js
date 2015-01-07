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
	this.whereKey = {}
	this.whereOther = {}
	this.limit_value = null;
	this.index = null;
	this.direction = null;
	this.LastEvaluatedKey = null;
	this.ExclusiveStartKey = null;
	
	

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
	
	this.where = function($key,$value1,$value2) {
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
				else 
					callback( err, data )
			})
		})
	}

	this.query = function(callback) {
		
		var thisQuery = {
			TableName: this.table,
			KeyConditions: $this.anormalizeQuery()
		}
		if (this.limit_value !== null)
			thisQuery['Limit'] = this.limit_value;

		if (this.direction !== null) {
			if (this.direction == 'DESC')
				thisQuery['ScanIndexForward'] = false;
		}
		if ( this.index !== null )
			thisQuery['IndexName'] = this.index;

		if (this.select.length)
			thisQuery['AttributesToGet'] = this.select;

		if ( this.ExclusiveStartKey !== null )
			thisQuery['ExclusiveStartKey'] = this.ExclusiveStartKey;

		$lastQuery = thisQuery
		$db.query( thisQuery , function(err,data) {
			if (err)
				return callback(err, false)

			$this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey
			callback(err, $this.normalizeList(data.Items))
		})
		
		return this
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
					whereVal[this.whereOther[key].type] = this.whereOther[key].value;
					var type = 
					anormal[key] = {
						ComparisonOperator: this.whereOther[key].operator,
						AttributeValueList: [ whereVal ]	
					}
			}
		}
		return anormal;
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
					if (typeof item[key] == 'number') {
						anormal[key] = {'N' : item[key].toString() }
					}
					if (typeof item[key] == 'string') {
						anormal[key] = {'S' : item[key] }
					}
			}
		}
		return anormal;
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
			}
		}
		return normal;
	}
}

