
var util = require('@awspilot/dynamodb-util')

	//util.config.empty_string_replace_as = o.empty_string_replace_as;

	util.config.stringset_parse_as_set = true;
	util.config.numberset_parse_as_set = true;
	util.config.binaryset_parse_as_set = true;

	function Transact( $client, config ) {

		this.pending = {}
		this.TransactItems = []



		this.events = config.events // global events
		this.describeTables = config.describeTables
		this.return_explain = config.return_explain
		this.local_events = {}
		this.client = $client


	}
	Transact.prototype.reset = function() {
		this.pending = {}
	}
	Transact.prototype.table = function($tableName) {
		this.pending.tableName = $tableName;
		return this;
	}


	Transact.prototype.insert_or_replace = function( item ) {

		var $this = this

		var $thisQuery = {
			Put: {
				TableName: this.pending.tableName,
				Item: util.anormalizeItem(item),
				// ReturnValuesOnConditionCheckFailure: ALL_OLD | NONE
			},
			// ReturnValuesOnConditionCheckFailure: ALL_OLD | NONE
		}
		this.TransactItems.push($thisQuery)
		this.reset()
		//console.log("insert_or_replace", JSON.stringify($thisQuery, null ,"\t") )
		return this;
	}


	Transact.prototype.write = function( callback ) {



		var $this = this

		var $thisQuery = {
			TransactItems: this.TransactItems,
			// ClientRequestToken: 'STRING_VALUE',
			ReturnConsumedCapacity: 'TOTAL', // INDEXES | TOTAL | NONE,
			ReturnItemCollectionMetrics: 'SIZE', // SIZE | NONE
		}

		console.log(".transactWriteItems()", JSON.stringify($thisQuery, null ,"\t") )


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
