
var DynamoUtil = {}

DynamoUtil.Raw = function(data) {
	this.data = data
}

DynamoUtil.anormalizeList = function(list) {
	var $ret = []
	for (var $i in list) {
		$ret.push(DynamoUtil.anormalizeItem(list[$i]))
	}
	return $ret;
}

DynamoUtil.anormalizeItem = function(item) {
	var anormal = {}
	for (var key in item) {
		if (item.hasOwnProperty(key)) {
			anormal[key] = DynamoUtil.anormalizeValue(item[key])
		}
	}
	return anormal;
}


DynamoUtil.anormalizeValue = function( $value ) {
	if (typeof $value == 'boolean')
		return {'BOOL' : $value }

	if (typeof $value == 'number')
		return {'N' : $value.toString() }

	if (typeof $value == 'string') {
		if ( $value === '') return {'NULL' : true }
		return {'S' : $value }
	}

	if ($value === null)
		return {'NULL' : true }

	if ($value instanceof Buffer)
		return {'B' : $value }

	// stringSet, numberSet
	if ((typeof $value == 'object') && ($value instanceof DynamoUtil.Raw) ) {
		return $value.data
	}

	if (typeof $value == 'object') {
		if(Array.isArray($value) ) {
			var to_ret = {'L': [] }
			for (var i in $value) {
				if ($value.hasOwnProperty(i)) {
					to_ret.L[i] = DynamoUtil.anormalizeValue($value[i] )
				}
			}
			return to_ret
		}

		var to_ret = {'M': {} }
		for (var i in $value) {
			if ($value.hasOwnProperty(i)) {
					to_ret.M[i] = DynamoUtil.anormalizeValue($value[i] )
				}
			}
			return to_ret
	}

	// @todo: support other types
}

DynamoUtil.anormalizeType = function( $value ) {
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

DynamoUtil.normalizeList = function($items) {
	var $list = []
	for (var i in $items) {
		$list.push(DynamoUtil.normalizeItem($items[i]))
	}
	return $list;
}

DynamoUtil.normalizeItem = function($item) {
	// disabled for now so we dont break compatibility with older versions, should return null on undefined $item
	//if (!$item)
	//	return null

	var normal = {}
	for (var key in $item) {
		if ($item.hasOwnProperty(key)) {
			if ($item[key].hasOwnProperty('S'))
				normal[key] = $item[key]['S']

			if ($item[key].hasOwnProperty('N'))
				normal[key] = +($item[key]['N'])

			if ($item[key].hasOwnProperty('BOOL'))
				normal[key] = $item[key]['BOOL']

			if ($item[key].hasOwnProperty('NULL'))
				normal[key] = null

			if ($item[key].hasOwnProperty('B'))
				normal[key] = $item[key]['B']

			if ($item[key].hasOwnProperty('SS'))
				normal[key] = $item[key]['SS']

			if ($item[key].hasOwnProperty('NS')) {
				normal[key] = []
				$item[key]['NS'].forEach(function(el,idx) {
					normal[key].push(parseFloat(el))
				})
			}

			if ($item[key].hasOwnProperty('L')){
				normal[key] = []
				for (var i in $item[key]['L'] ) {
					if ($item[key]['L'].hasOwnProperty(i)) {
						normal[key][i] = DynamoUtil.normalizeItem({
								key: $item[key]['L'][i]
						}).key
					}
				}
			}

			if ($item[key].hasOwnProperty('M')) {
				normal[key] = {}
				for (var i in $item[key]['M'] ) {
					if ($item[key]['M'].hasOwnProperty(i)) {
						normal[key][i] = DynamoUtil.normalizeItem({
								key: $item[key]['M'][i]
						}).key
					}
				}
			}
		}
	}
	return normal;
}


DynamoUtil.buildExpected = function( $expected ) {
	var anormal = {}

	for (var key in $expected ) {
		if ($expected.hasOwnProperty(key)) {

				var whereVal = {}

				if ((typeof $expected[key] == 'object') && ($expected[key] instanceof DynamoUtil.Raw) ) {
					anormal[key] = $expected[key].data
				} else if ($expected[key].hasOwnProperty('value2') && $expected[key].value2 !== undefined ) {
					anormal[key] = {
						ComparisonOperator: $expected[key].operator,
						AttributeValueList: [ DynamoUtil.anormalizeValue( $expected[key].value ), DynamoUtil.anormalizeValue( $expected[key].value2 ) ]
					}
				} else {
					anormal[key] = {
						ComparisonOperator: $expected[key].operator,
						AttributeValueList: [ DynamoUtil.anormalizeValue( $expected[key].value ) ]
					}
				}
		}
	}
	return anormal
}


DynamoUtil.expression_name_split = function(item) {
	var ret = []
	var split = ''
	var in_brackets = false
	for (var i = 0;i<item.length;i++) {
		if (in_brackets) {
			if (item[i] == '"') {
				in_brackets = false
				ret.push(split)
				split = ''
			} else {
				split+=item[i]
			}
		} else {
			if (item[i] == '"') {
				in_brackets = true
			} else {
				if (item[i] == '.') {
					ret.push(split)
					split = ''
				} else {
					split+=item[i]
				}
			}
		}
	}
	ret.push(split)
	return ret.filter(function(v) { return v.trim() !== '' })
}
DynamoUtil.clone = function ( source) {

	var from;
	var to = Object({});
	var symbols;

	for (var s = 0; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (Object.prototype.hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (Object.prototype.propertyIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
}

module.exports = DynamoUtil
