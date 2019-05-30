
	var util = require('@awspilot/dynamodb-util')

	//util.config.empty_string_replace_as = o.empty_string_replace_as;

	util.config.stringset_parse_as_set = true;
	util.config.numberset_parse_as_set = true;
	util.config.binaryset_parse_as_set = true;


	function Batch( $client, config ) {

		this.events = config.events // global events
		this.describeTables = config.describeTables
		this.return_explain = config.return_explain
		this.local_events = {}
		this.client = $client

		this.current_table = undefined;
		this.err = undefined;
		this.payload = {
			RequestItems: {}
		}
	}


	Batch.prototype.routeCall = function(method, params, reset ,callback ) {
		var $this = this
		this.events.beforeRequest.apply( this, [ method, params ])

		this.client[method]( params, function( err, data ) {

			if (err)
				$this.events.error.apply( $this, [ method, err , params ] )

		// 	if ((data || {}).hasOwnProperty('ConsumedCapacity') )
		// 		$this.ConsumedCapacity = data.ConsumedCapacity

		// 	if ( reset === true )
		// 		$this.reset()

			callback.apply( $this, [ err, data ] )
		})
	}




	Batch.prototype.resume = function() {}
	Batch.prototype.table = function( tbl_name ) {
		if (this.err)
			return this;

		this.current_table = tbl_name
		return this;
	}


	Batch.prototype.item = function() {}


	Batch.prototype.put = function( item ) {
		if (this.err)
			return this;

		if (!this.current_table) {
			this.err = { code: 'INVALID_TABLE', message: 'use .table( tbl_name ) before .put()'}
			return this;
		}

		if (typeof item !== 'object') {
			this.err = { code: 'INVALID_ITEM', message: '.put( item ) - must pass in an Object'}
			return this;
		}

		if (!this.payload.RequestItems.hasOwnProperty( this.current_table ))
			this.payload.RequestItems[ this.current_table ] = []

		this.payload.RequestItems[ this.current_table ].push({
			PutRequest: {
				Item: util.stringify( item ).M
			}
		})

		return this;
	}

	Batch.prototype.delete = function( item ) {
		if (this.err)
			return this;

		if (!this.current_table) {
			this.err = { code: 'INVALID_TABLE', message: 'use .table( tbl_name ) before .delete()'}
			return this;
		}

		if (typeof item !== 'object') {
			this.err = { code: 'INVALID_ITEM', message: '.del( item ) must pass in an Object'}
			return this;
		}

		if (!this.payload.RequestItems.hasOwnProperty( this.current_table ))
			this.payload.RequestItems[ this.current_table ] = []

		this.payload.RequestItems[ this.current_table ].push({
			DeleteRequest: {
				Key: util.stringify( item ).M
			}
		})

		return this;
	}
	Batch.prototype.del = Batch.prototype.delete;




	Batch.prototype.get = function( item ) {
		if (this.err)
			return this;

		if (!this.current_table) {
			this.err = { code: 'INVALID_TABLE', message: 'use .table( tbl_name ) before .get()'}
			return this;
		}

		if (typeof item !== 'object') {
			this.err = { code: 'INVALID_ITEM', message: '.get( item ) - must pass in an Object'}
			return this;
		}

		if (!this.payload.RequestItems.hasOwnProperty( this.current_table ))
			this.payload.RequestItems[ this.current_table ] = {
				Keys: [],
				// ExpressionAttributeNames
				// ProjectionExpression: ""
				// AttributesToGet: []
				ConsistentRead: false,
			}

		this.payload.RequestItems[ this.current_table ].Keys.push( util.stringify( item ).M )

		return this;
	}



	Batch.prototype.consistent_read = function( $value ) {
		if (this.err)
			return this;

		if (!this.current_table) {
			this.err = { code: 'INVALID_TABLE', message: 'use .table( tbl_name ) before .consistent_read()'}
			return this;
		}

		if ( value === undefined ) {
			value = true
		} else {
			var value = JSON.parse(JSON.stringify($value))
		}

		if (!this.payload.RequestItems.hasOwnProperty( this.current_table )) {
			this.payload.RequestItems[ this.current_table ] = {
				Keys: [],
				// ExpressionAttributeNames
				// ProjectionExpression: ""
				// AttributesToGet: []
				ConsistentRead: value,
			}
		} else {
			this.payload.RequestItems[ this.current_table ].ConsistentRead = value
		}

		return this
	}





	Batch.prototype.read = function( cb ) {
		if (this.err)
			return cb(this.err);

		var $this = this

		var $thisQuery = this.payload;

		if (typeof this.local_events['beforeRequest'] === "function" )
			this.local_events['beforeRequest']('batchWriteItem', $thisQuery)

		// @todo: implement promise

		this.routeCall('batchGetItem', $thisQuery , true , function(err,data) {
			if (err)
				return typeof cb !== "function" ? null : cb.apply( this, [ err, false ] )

			var ret = {}

			Object.keys(data.Responses).map(function( tbl_name ) {
				if (!ret.hasOwnProperty(tbl_name))
					ret[tbl_name] = []

				ret[tbl_name] = util.parse({ L :
					(data.Responses[tbl_name] || []).map(function(item) { return {'M': item } })
				})

			})

			this.rawUnprocessedKeys = data.UnprocessedKeys;

			typeof cb !== "function" ? null : cb.apply( this, [ err, ret, data ])

		})

	}
	Batch.prototype.write = function( cb ) {

		if (this.err)
			return cb(this.err);

		var $this = this

		var $thisQuery = this.payload;

		if (typeof this.local_events['beforeRequest'] === "function" )
			this.local_events['beforeRequest']('batchWriteItem', $thisQuery)

		// @todo: implement promise

		//console.log(JSON.stringify($thisQuery, null, "\t"))

		this.routeCall('batchWriteItem', $thisQuery , true , function(err,data) {
			if (err)
				return typeof cb !== "function" ? null : cb.apply( this, [ err, false ] )

			typeof cb !== "function" ? null : cb.apply( this, [ err, data, data ])

		})


	}



module.exports = Batch;
