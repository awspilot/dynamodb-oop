
var keywords = [
	"abort","absolute","action","add","after","agent","aggregate","all","allocate","alter","analyze","and","any","archive","are","array",
	"as","asc","ascii","asensitive","assertion","asymmetric","at","atomic","attach","attribute","auth","authorization","authorize","auto",
	"avg","back","backup","base","batch","before","begin","between","bigint","binary","bit","blob","block","boolean","both","breadth",
	"bucket","bulk","by","byte","call","called","calling","capacity","cascade","cascaded","case","cast","catalog","char","character",
	"check","class","clob","close","cluster","clustered","clustering","clusters","coalesce","collate","collation","collection","column",
	"columns","combine","comment","commit","compact","compile","compress","condition","conflict","connect","connection","consistency",
	"consistent","constraint","constraints","constructor","consumed","continue","convert","copy","corresponding","count","counter",
	"create","cross","cube","current","cursor","cycle","data","database","date","datetime","day","deallocate","dec","decimal","declare",
	"default","deferrable","deferred","define","defined","definition","delete","delimited","depth","deref","desc","describe","descriptor",
	"detach","deterministic","diagnostics","directories","disable","disconnect","distinct","distribute","do","domain","double","drop","dump",
	"duration","dynamic","each","element","else","elseif","empty","enable","end","equal","equals","error","escape","escaped","eval","evaluate",
	"exceeded","except","exception","exceptions","exclusive","exec","execute","exists","exit","explain","explode","export","expression","extended",
	"external","extract","fail","false","family","fetch","fields","file","filter","filtering","final","finish","first","fixed","flattern","float",
	"for","force","foreign","format","forward","found","free","from","full","function","functions","general","generate","get","glob","global","go",
	"goto","grant","greater","group","grouping","handler","hash","have","having","heap","hidden","hold","hour","identified","identity","if","ignore",
	"immediate","import","in","including","inclusive","increment","incremental","index","indexed","indexes","indicator","infinite","initially","inline",
	"inner","innter","inout","input","insensitive","insert","instead","int","integer","intersect","interval","into","invalidate","is","isolation",
	"item","items","iterate","join","key","keys","lag","language","large","last","lateral","lead","leading","leave","left","length","less","level",
	"like","limit","limited","lines","list","load","local","localtime","localtimestamp","location","locator","lock","locks","log","loged","long",
	"loop","lower","map","match","materialized","max","maxlen","member","merge","method","metrics","min","minus","minute","missing","mod","mode",
	"modifies","modify","module","month","multi","multiset","name","names","national","natural","nchar","nclob","new","next","no","none","not",
	"null","nullif","number","numeric","object","of","offline","offset","old","on","online","only","opaque","open","operator","option","or","order",
	"ordinality","other","others","out","outer","output","over","overlaps","override","owner","pad","parallel","parameter","parameters","partial",
	"partition","partitioned","partitions","path","percent","percentile","permission","permissions","pipe","pipelined","plan","pool","position",
	"precision","prepare","preserve","primary","prior","private","privileges","procedure","processed","project","projection","property","provisioning",
	"public","put","query","quit","quorum","raise","random","range","rank","raw","read","reads","real","rebuild","record","recursive","reduce","ref",
	"reference","references","referencing","regexp","region","reindex","relative","release","remainder","rename","repeat","replace","request","reset",
	"resignal","resource","response","restore","restrict","result","return","returning","returns","reverse","revoke","right","role","roles","rollback",
	"rollup","routine","row","rows","rule","rules","sample","satisfies","save","savepoint","scan","schema","scope","scroll","search","second","section",
	"segment","segments","select","self","semi","sensitive","separate","sequence","serializable","session","set","sets","shard","share","shared","short",
	"show","signal","similar","size","skewed","smallint","snapshot","some","source","space","spaces","sparse","specific","specifictype","split","sql",
	"sqlcode","sqlerror","sqlexception","sqlstate","sqlwarning","start","state","static","status","storage","store","stored","stream","string","struct",
	"style","sub","submultiset","subpartition","substring","subtype","sum","super","symmetric","synonym","system","table","tablesample","temp","temporary",
	"terminated","text","than","then","throughput","time","timestamp","timezone","tinyint","to","token","total","touch","trailing","transaction","transform",
	"translate","translation","treat","trigger","trim","true","truncate","ttl","tuple","type","under","undo","union","unique","unit","unknown","unlogged",
	"unnest","unprocessed","unsigned","until","update","upper","url","usage","use","user","users","using","uuid","vacuum","value","valued","values","varchar",
	"variable","variance","varint","varying","view","views","virtual","void","wait","when","whenever","where","while","window","with","within","without","work",
	"wrapped","write","year","zone"
]



var _expr_attribute = function( attr ) {
	return attr
		.split('.').join("_dot_")
		.split('-').join("_minus_")
}

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

			var _name = this._namefy( this.pending.if.attr, '#ifeq_' )
			var _vname = this._valuefy( this.pending.if.attr, ':ifeq_',  value )
			this.pending.ConditionExpression.push(
				"( " + _name + " = " + _vname + " )"
			)
			this.pending.if = null;
			return this
		}

		return this;
	}

	Transact.prototype._namefy = function( name, prefix ) {
		var $this=this;
		if (
				( keywords.indexOf(name.toLowerCase()) === -1 ) &&
				( name.match(/^[a-zA-Z]+$/) !== null )
			)
			return name;


		var _att_names = []
		name.split('.').map(function( n, idx ) {

			// if its an array path, remove it and add it later
			// for (const match of "hello[1][12][14]".matchAll(/([^\[]*)\[([0-9]+)\]/gs)) { console.log(match) }
			if ( n.indexOf('[') === -1 ) {
				var _att_name = prefix +idx+ _expr_attribute(n)
				$this.pending.ExpressionAttributeNames [ _att_name ] = n;
				_att_names.push(_att_name)
			} else {
				var _arr_path = n.slice(n.indexOf('['))
				n = n.slice(0,n.indexOf('['))
				var _att_name = prefix +idx+ _expr_attribute(n)
				$this.pending.ExpressionAttributeNames [ _att_name ] = n;
				_att_names.push(_att_name + _arr_path )
			}

		})

		return _att_names.join('.');
	}
	Transact.prototype._valuefy = function( name, prefix, value ) {
		var _att_name = prefix + name
			.split('-').join('_minus_')
			.split('.').join("_dot_")
			.split('[').join("_sqp1_")
			.split(']').join("_sqp1_")

		this.pending.ExpressionAttributeValues[ _att_name ] = util.stringify(value)
		return _att_name;
	}


	Transact.prototype.if = function( attr ) {
		this.pending.if = {
			attr: attr,
		};
		return this;
	}
	Transact.prototype.not = function( ) {
		if (this.pending.if !== null)
			this.pending.if.not = true;

		return this;
	}
	Transact.prototype.exists = function( value ) {
		if (this.pending.if !== null) {

			if (this.pending.if.not === true) {
				var _name = this._namefy( this.pending.if.attr, '#ifnotexists_' )
				this.pending.ConditionExpression.push(
					"attribute_not_exists( " + _name + " )"
				)
			} else {
				var _name = this._namefy( this.pending.if.attr, '#ifexists_' )
				this.pending.ConditionExpression.push(
					"attribute_exists( " + _name + " )"
				)
			}
			this.pending.if = null;

			return this
		}
		return this;
	}
	Transact.prototype.ne = function( value ) {
		if (this.pending.if !== null) {

			var _name = this._namefy( this.pending.if.attr, '#ifne_' )
			var _vname = this._valuefy( this.pending.if.attr, ':ifne_',  value )
			this.pending.ConditionExpression.push(
				"( " + _name + " <>  " + _vname + " )"
			)
			this.pending.if = null;
			return this
		}
		return this;
	}
	Transact.prototype.ge = function( value ) {
		if (this.pending.if !== null) {

			var _name = this._namefy( this.pending.if.attr, '#ifge_' )
			var _vname = this._valuefy( this.pending.if.attr, ':ifge_',  value )
			this.pending.ConditionExpression.push(
				"( " + _name + " >= " + _vname + " )"
			)
			this.pending.if = null;
			return this
		}
		return this;
	}
	Transact.prototype.gt = function( value ) {
		if (this.pending.if !== null) {

			var _name = this._namefy( this.pending.if.attr, '#ifgt_' )
			var _vname = this._valuefy( this.pending.if.attr, ':ifgt_',  value )
			this.pending.ConditionExpression.push(
				"( " + _name + " > " + _vname + " )"
			)
			this.pending.if = null;
			return this
		}
		return this;
	}
	Transact.prototype.le = function( value ) {
		if (this.pending.if !== null) {

			var _name = this._namefy( this.pending.if.attr, '#ifle_' )
			var _vname = this._valuefy( this.pending.if.attr, ':ifle_',  value )
			this.pending.ConditionExpression.push(
				"( " + _name + " <= " + _vname + " )"
			)
			this.pending.if = null;
			return this
		}
		return this;
	}
	Transact.prototype.lt = function( value ) {
		if (this.pending.if !== null) {

			var _name = this._namefy( this.pending.if.attr, '#iflt_' )
			var _vname = this._valuefy( this.pending.if.attr, ':iflt_',  value )
			this.pending.ConditionExpression.push(
				"( " + _name + " < " + _vname + " )"
			)
			this.pending.if = null;
			return this
		}
		return this;
	}
	Transact.prototype.between = function( v1,v2 ) {
		if (this.pending.if !== null) {

			if (this.pending.if.not === true) {
				var _name = this._namefy( this.pending.if.attr, '#ifnotbtw_' )
				var _v1 = this._valuefy( this.pending.if.attr, ':ifnotbtwlo_',  v1 )
				var _v2 = this._valuefy( this.pending.if.attr, ':ifnotbtwhi_',  v2 )
				this.pending.ConditionExpression.push(
					"(NOT ( " + _name + " BETWEEN " + _v1 + " AND " + _v2 + " ))"
				)
			} else {
				var _name = this._namefy( this.pending.if.attr, '#ifbtw_' )
				var _v1 = this._valuefy( this.pending.if.attr, ':ifbtwlo_',  v1 )
				var _v2 = this._valuefy( this.pending.if.attr, ':ifbtwhi_',  v2 )
				this.pending.ConditionExpression.push(
					"( " + _name + " BETWEEN " + _v1 + " AND " + _v2 + " )"
				)
			}
			this.pending.if = null;

			return this
		}
		return this;
	}
	Transact.prototype.in = function( value ) {

		var $this=this;

		if (this.pending.if !== null) {

			if (this.pending.if.not === true) {
				var _name = this._namefy( this.pending.if.attr, '#ifnotin_' )

				var ins = []
				value.map(function(v,idx) {
					var _vname = $this._valuefy( $this.pending.if.attr, ':ifnotin' + idx + '_',  v )
					ins.push( _vname )
				})

				this.pending.ConditionExpression.push(
					"(NOT ( " + _name + " IN (" + ins.join(' , ') + ") ))"
				)
			} else {
				var _name = this._namefy( this.pending.if.attr, '#ifin_' )

				var ins = []
				value.map(function(v,idx) {
					var _vname = $this._valuefy( $this.pending.if.attr, ':ifin' + idx + '_',  v )
					ins.push( _vname )
				})

				this.pending.ConditionExpression.push(
					"( " + _name + " IN (" + ins.join(' , ') + ") )"
				)
			}

			this.pending.if = null;

			return this
		}
		return this;
	}



	Transact.prototype.contains = function( value ) {
		if (this.pending.if !== null) {

			if (this.pending.if.not === true) {
				var _name = this._namefy( this.pending.if.attr, '#ifnotcontains_' )
				var _vname = this._valuefy( this.pending.if.attr, ':ifnotcontains_',  value )
				this.pending.ConditionExpression.push(
					"( NOT contains( " + _name + " , " + _vname + ") )"
				)
			} else {
				var _name = this._namefy( this.pending.if.attr, '#ifcontains_' )
				var _vname = this._valuefy( this.pending.if.attr, ':ifcontains_',  value )
				this.pending.ConditionExpression.push(
					"contains( " + _name + " , " + _vname + " )"
				)
			}
			this.pending.if = null;

			return this
		}
		return this;
	}

	Transact.prototype.begins_with = function( value ) {
		if (this.pending.if !== null) {

			if (this.pending.if.not === true) {
				var _name = this._namefy( this.pending.if.attr, '#ifnotbw_' )
				var _vname = this._valuefy( this.pending.if.attr, ':ifnotbw_',  value )
				this.pending.ConditionExpression.push(
					"(NOT begins_with( " + _name + " , " + _vname + " ))"
				)
			} else {
				var _name = this._namefy( this.pending.if.attr, '#ifbw_' )
				var _vname = this._valuefy( this.pending.if.attr, ':ifbw_',  value )
				this.pending.ConditionExpression.push(
					"begins_with( " + _name + " , " + _vname + " )"
				)
			}
			this.pending.if = null;

			return this
		}
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
				// Item: util.anormalizeItem(item),
				ExpressionAttributeNames: this.pending.ExpressionAttributeNames,
				ExpressionAttributeValues: this.pending.ExpressionAttributeValues,
			},
		}

		if (UpdateExpression.length)
			$thisQuery.Update.UpdateExpression = "SET " + UpdateExpression.join(' , ');

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
