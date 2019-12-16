
var util = require('@awspilot/dynamodb-util')

	//util.config.empty_string_replace_as = o.empty_string_replace_as;

	util.config.stringset_parse_as_set = true;
	util.config.numberset_parse_as_set = true;
	util.config.binaryset_parse_as_set = true;

	function Transact( $client, config ) {

		this.err = null;
		this.reset()
		this.TransactItems = []



		this.events = config.events // global events
		this.describeTables = config.describeTables
		this.return_explain = config.return_explain
		this.local_events = {}
		this.client = $client


	}
	Transact.prototype.reset = function() {
		this.pending = {
			if: null,
			ExpressionAttributeNames: {},
			ExpressionAttributeValues: {},
			ConditionExpression: [],
		}
	}
	Transact.prototype.table = function($tableName) {
		this.reset()
		this.pending.tableName = $tableName;
		return this;
	}
	Transact.prototype.debug = function() {
		console.log("pending=",JSON.stringify(this.pending,null,"\t"))
		return this;
	}
	Transact.prototype.where = function( key ) {
		this.pending.where = key;
		return this;
	}
	Transact.prototype.eq = function( value ) {
		if (this.pending.where) {
			if (!this.pending.hasOwnProperty('wheres'))
				this.pending.wheres = {}

			this.pending.wheres[this.pending.where] = value
			delete this.pending.where;
		}

		if (this.pending.if !== null) {

			this.pending.ExpressionAttributeNames [ '#if_'+ this.pending.if ] = this.pending.if;
			this.pending.ExpressionAttributeValues[ ':if_'+ this.pending.if ] = util.stringify(value)
			this.pending.ConditionExpression.push(
				"( #if_" + this.pending.if + " = :if_" + this.pending.if  + ")"
			)
			this.pending.if = null;

			// if ($comparison == 'EQ') {
			// 	this.ifFilter[this.pendingIf] = new DynamodbFactory.util.Raw({ Exists: true, Value: DynamodbFactory.util.stringify($value) })
			// } else {
			// 	this.ifFilter[this.pendingIf] = { operator: $comparison, type: DynamodbFactory.util.anormalizeType($value), value: $value, value2: $value2 }
			// }
			//
			// this.ifConditionExpression.push({
			// 	attribute: this.pendingIf,
			// 	operator: $comparison,
			// 	type: DynamodbFactory.util.anormalizeType($value),
			// 	value: $value,
			// 	value2: $value2
			// })
			//
			// this.pendingIf = null
			return this
		}

		return this;
	}

	Transact.prototype.if = function( key ) {
		this.pending.if = key;
		return this;
	}



	Transact.prototype.insert = function(item) {
		if (this.err)
			return this;

		var $this = this

		if (!this.describeTables.hasOwnProperty(this.pending.tableName)) {
			this.err = { errorMessage: "transact() needs to know table schema, please use .schema() to define it"}
			return this;
		}

		var describeTable = this.describeTables[this.pending.tableName]

		for (var i in describeTable.KeySchema ) {
			this.pending.ExpressionAttributeNames[ '#'+describeTable.KeySchema[i].AttributeName ] = describeTable.KeySchema[i].AttributeName
			this.pending.ConditionExpression.push(
				"attribute_not_exists( #" + describeTable.KeySchema[i].AttributeName + ")"
			)
		}

		var $thisQuery = {
			Put: {
				TableName: this.pending.tableName,
				Item: util.anormalizeItem(item),
				ConditionExpression: this.pending.ConditionExpression.join(' AND '),
				ExpressionAttributeNames: this.pending.ExpressionAttributeNames,
			},
		}

		//console.log("insert()", JSON.stringify($thisQuery, null, "\t"))

		this.TransactItems.push($thisQuery)
		this.reset()


		return this;
	}

	Transact.prototype.insert_or_replace = function( item ) {
		if (this.err)
			return this;

		var $this = this

		var $thisQuery = {
			Put: {
				TableName: this.pending.tableName,
				Item: util.anormalizeItem(item),
				// ReturnValuesOnConditionCheckFailure: ALL_OLD | NONE
			},
			// ReturnValuesOnConditionCheckFailure: ALL_OLD | NONE
		}
		if (Object.keys(this.pending.ExpressionAttributeNames).length)
			$thisQuery.Put.ExpressionAttributeNames = this.pending.ExpressionAttributeNames;
		if (Object.keys(this.pending.ExpressionAttributeValues).length)
			$thisQuery.Put.ExpressionAttributeValues = this.pending.ExpressionAttributeValues;
		if (this.pending.ConditionExpression.length)
			$thisQuery.Put.ConditionExpression = this.pending.ConditionExpression.join(' AND ');

		this.TransactItems.push($thisQuery)
		//console.log("pending=", this.pending )
		this.reset()
		//console.log("insert_or_replace", JSON.stringify($thisQuery, null ,"\t") )
		return this;
	}

	Transact.prototype.replace = function( item ) {
		if (this.err)
			return this;

		var $this = this

		if (!this.describeTables.hasOwnProperty(this.pending.tableName)) {
			this.err = { errorMessage: "transact() needs to know table schema, please use .schema() to define it"}
			return this;
		}

		var describeTable = this.describeTables[this.pending.tableName]

		for (var i in describeTable.KeySchema ) {
			this.pending.ExpressionAttributeNames[ '#'+describeTable.KeySchema[i].AttributeName ] = describeTable.KeySchema[i].AttributeName
			this.pending.ExpressionAttributeValues[ ':'+describeTable.KeySchema[i].AttributeName ] = util.anormalizeItem(item)[[describeTable.KeySchema[i].AttributeName]]
			this.pending.ConditionExpression.push(
				"( #" + describeTable.KeySchema[i].AttributeName + " = :" + describeTable.KeySchema[i].AttributeName + ")"
			)
		}

		var $thisQuery = {
			Put: {
				TableName: this.pending.tableName,
				Item: util.anormalizeItem(item),
				ConditionExpression: this.pending.ConditionExpression.join(' AND '),
				ExpressionAttributeNames: this.pending.ExpressionAttributeNames,
				ExpressionAttributeValues: this.pending.ExpressionAttributeValues,
			},
		}

		//console.log("insert()", JSON.stringify($thisQuery, null, "\t"))

		this.TransactItems.push($thisQuery)
		this.reset()
		return this;
	}


	Transact.prototype.insert_or_update = function( item ) {
		if (this.err)
			return this;

		var $this = this

		if (!this.describeTables.hasOwnProperty(this.pending.tableName)) {
			this.err = { errorMessage: "transact() needs to know table schema, please use .schema() to define it"}
			return this;
		}

		var describeTable = this.describeTables[this.pending.tableName]

		var item_copy = util.clone( item )

		var Key = {}
		var UpdateExpression = []

		for (var i in describeTable.KeySchema ) {
			Key[describeTable.KeySchema[i].AttributeName] = util.anormalizeItem(item)[[describeTable.KeySchema[i].AttributeName]];
			delete item_copy[describeTable.KeySchema[i].AttributeName]
		}

		Object.keys(item_copy).map(function(k) {
			$this.pending.ExpressionAttributeNames[ '#'+ k ] = k
			$this.pending.ExpressionAttributeValues[ ':'+k ] = util.anormalizeItem(item)[k]
			UpdateExpression.push(
				"#" + k + " = :" + k
			)

		})

		var $thisQuery = {
			Update: {
				TableName: this.pending.tableName,
				Key: Key,
				UpdateExpression: "SET " + UpdateExpression.join(' , '),
				// Item: util.anormalizeItem(item),
				// ConditionExpression: ConditionExpression.join(' AND '),
				ExpressionAttributeNames: this.pending.ExpressionAttributeNames,
				ExpressionAttributeValues: this.pending.ExpressionAttributeValues,
			},
		}

		if (this.pending.ConditionExpression.length)
			$thisQuery.Update.ConditionExpression = this.pending.ConditionExpression.join(' AND ');

		//console.log("insert_or_update()", JSON.stringify($thisQuery, null, "\t"))

		this.TransactItems.push($thisQuery)
		this.reset()
		return this;
	}


	Transact.prototype.update = function( item ) {
		if (this.err)
			return this;

		var $this = this

		var item_copy = util.clone( item )

		var Key = {}
		var UpdateExpression = []

		Object.keys(this.pending.wheres || {}).map(function(k) {
			Key[k] = util.stringify($this.pending.wheres[k])
			$this.pending.ExpressionAttributeNames[ '#'+k ] = k
			$this.pending.ConditionExpression.push(
				"attribute_exists( #" + k + ")"
			)

		})

		Object.keys(item_copy).map(function(k) {
			$this.pending.ExpressionAttributeNames[ '#update_'+ k ] = k
			$this.pending.ExpressionAttributeValues[ ':update_'+k ] = util.anormalizeItem(item)[k]
			UpdateExpression.push(
				"#update_" + k + " = :update_" + k
			)

		})

		var $thisQuery = {
			Update: {
				TableName: this.pending.tableName,
				Key: Key,
				UpdateExpression: "SET " + UpdateExpression.join(' , '),
				// Item: util.anormalizeItem(item),
				ConditionExpression: this.pending.ConditionExpression.join(' AND '),
				ExpressionAttributeNames: this.pending.ExpressionAttributeNames,
				ExpressionAttributeValues: this.pending.ExpressionAttributeValues,
			},
		}

		// console.log("update()", JSON.stringify($thisQuery, null, "\t"))

		this.TransactItems.push($thisQuery)
		this.reset()
		return this;
	}


	Transact.prototype.delete = function(callback ) {
		var $this = this

		var Key = {}
		Object.keys(this.pending.wheres || {}).map(function(k) {
			Key[k] = util.stringify($this.pending.wheres[k])
		})

		var $thisQuery = {
			Delete: {
				TableName: this.pending.tableName,
				Key: Key,
			},
		}

		if (Object.keys(this.pending.ExpressionAttributeNames).length)
			$thisQuery.Delete.ExpressionAttributeNames = this.pending.ExpressionAttributeNames;
		if (Object.keys(this.pending.ExpressionAttributeValues).length)
			$thisQuery.Delete.ExpressionAttributeValues = this.pending.ExpressionAttributeValues;
		if (this.pending.ConditionExpression.length)
			$thisQuery.Delete.ConditionExpression = this.pending.ConditionExpression.join(' AND ');

		// console.log("update()", JSON.stringify($thisQuery, null, "\t"))

		this.TransactItems.push($thisQuery)
		this.reset()
		return this;
	}

	Transact.prototype.write = function( callback ) {
		var $this=this;
		if (this.err) {
			if (typeof callback !== "function") {
				return new Promise(function(fullfill, reject) {
					return reject(this.err)
				})
			}
			return callback.apply( $this, [ this.err ])
		}


		var $this = this

		var $thisQuery = {
			TransactItems: this.TransactItems,
			// ClientRequestToken: 'STRING_VALUE',
			ReturnConsumedCapacity: 'TOTAL', // INDEXES | TOTAL | NONE,
			ReturnItemCollectionMetrics: 'SIZE', // SIZE | NONE
		}

		//console.log(".transactWriteItems()", JSON.stringify($thisQuery, null ,"\t") )


		if (typeof this.local_events['beforeRequest'] === "function" )
			this.local_events['beforeRequest']('transactWriteItems', $thisQuery)

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {
				$this.routeCall('transactWriteItems', $thisQuery , true, function(err,data) {
					if (err)
						return reject(err)

					fullfill(data.Attributes)
				})
			})
		}

		this.routeCall('transactWriteItems', $thisQuery , true , function(err,data) {

			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
		})
	}



	Transact.prototype.routeCall = function(method, params, reset ,callback ) {
		var $this = this
		this.events.beforeRequest.apply( this, [ method, params ])

		if ( this.return_explain ) {
			if ( reset === true )
				$this.reset()

			var explain;
			switch (method) {

			}


			callback.apply( $this, [ null, explain ] )
			return
		}


		this.client[method]( params, function( err, data ) {

			if (err)
				$this.events.error.apply( $this, [ method, err , params ] )

			if ((data || {}).hasOwnProperty('ConsumedCapacity') )
				$this.ConsumedCapacity = data.ConsumedCapacity

			if ( reset === true )
				$this.reset()

			callback.apply( $this, [ err, data ] )
		})
	}

module.exports = Transact;
