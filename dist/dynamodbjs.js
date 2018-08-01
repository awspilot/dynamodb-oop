(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],3:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":4}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){

var DynamoDB = require('./lib/dynamodb')

window['@awspilot/dynamodb'] = DynamoDB

},{"./lib/dynamodb":6}],6:[function(require,module,exports){
(function (global){
'use strict';

	var DynamodbFactory = function ( $config ) {
		return new DynamoDB($config)
	}
	DynamodbFactory.util = require('@awspilot/dynamodb-util')
	
	DynamodbFactory.config = function(o) {
		if (o.hasOwnProperty('empty_string_replace_as'))
			DynamodbFactory.util.config.empty_string_replace_as = o.empty_string_replace_as;

		if (o.hasOwnProperty('stringset_parse_as_set'))
			DynamodbFactory.util.config.stringset_parse_as_set = o.stringset_parse_as_set;

		if (o.hasOwnProperty('numberset_parse_as_set'))
			DynamodbFactory.util.config.numberset_parse_as_set = o.numberset_parse_as_set;

	}


	var Promise = (typeof window !== "undefined" ? window['promise'] : typeof global !== "undefined" ? global['promise'] : null)
	var util = require('@awspilot/dynamodb-util')
	var AWS = (typeof window !== "undefined" ? window['AWS'] : typeof global !== "undefined" ? global['AWS'] : null)
	var sqlparser = require('./sqlparser.js');
	sqlparser.parser.yy.extend = function (a,b){
		if(typeof a == 'undefined') a = {};
		for(var key in b) {
			if(b.hasOwnProperty(key)) {
				a[key] = b[key]
			}
		}
		return a;
	}


	var filterOperators = {
		EQ: '=',
		NE: '<>',
		LT: '<',
		LE: '<=',
		GT: '>',
		GE: '>=',

		BETWEEN: 'BETWEEN',
		IN: 'IN',

		NOT_NULL: 'attribute_exists',
		NULL:     'attribute_not_exists',

		BEGINS_WITH: 'begins_with',
		CONTAINS: 'contains',
		NOT_CONTAINS: 'not_contains',

	 }

	function DynamoDB ( $config ) {
		this.events = {
			error: function() {},
			beforeRequest: function() {}
		}

		// $config will not be an instance of DynamoDB becanse we have a different instance of AWS sdk loaded
		// aws had similar issues in the past: https://github.com/awslabs/dynamodb-document-js-sdk/issues/16

		// a way around to make sure it is an instance of AWS.DynamoDB
		if ((typeof $config === "object") && (($config.config || {}).hasOwnProperty('dynamoDbCrc32'))) {
		//if ($config instanceof AWS.DynamoDB) {
				this.client = $config
				return
		}


		// delay implementation of amazon-dax-client,
		// if node-gyp is not available during npm install,
		// amazon-dax-client will throw error when require('@awspilot/dynamodb')


		//if (process.version.match(/^v(\d+)/)[1] !== '0') {
		//	// amazon-dax-client does not work on node 0.x atm
		//	var AmazonDaxClient = require('amazon-dax-client')
		//	if ($config instanceof AmazonDaxClient) {
		//		this.client = $config
		//		$config = null
		//		return
		//	}
		//}


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
	DynamoDB.prototype.SS = function(data) {
		if (Array.isArray(data))
			return new DynamodbFactory.util.Raw({'SS': data })
		throw new Error('SS: argument should be a array')
	}
	DynamoDB.prototype.stringSet = DynamoDB.prototype.SS


	DynamoDB.prototype.N = function(data) {
		if (typeof data === "number" || typeof data === "string")
			return new DynamodbFactory.util.Raw({'N': data.toString() })
		throw new Error('N: argument should be a number or string that converts to a number')
	}
	DynamoDB.prototype.number = DynamoDB.prototype.N


	DynamoDB.prototype.S = function(data) {
		if (typeof data === "string")
			return new DynamodbFactory.util.Raw({'S': data })

		throw new Error('S: argument should be a string')
	}
	DynamoDB.prototype.string = DynamoDB.prototype.S

	DynamoDB.prototype.NS = function(data) {
		if (Array.isArray(data)) {
			var $to_ret = []
			return new DynamodbFactory.util.Raw({'NS': data.map(function(el,idx) { return el.toString() }) })
		}
		throw new Error('NS: argument should be an Array')
	}
	DynamoDB.prototype.numberSet = DynamoDB.prototype.NS


	DynamoDB.prototype.L = function(data) {
		if (Array.isArray(data)) {
			var $to_ret = []
			for (var i in data) {
				$to_ret[i] = DynamodbFactory.util.stringify( data[i] )
			}
			return new DynamodbFactory.util.Raw({'L': $to_ret })
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
		if ((typeof data === "object") && (data instanceof DynamodbFactory.util.Raw )) {
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

		// add for M is not supported
		//if (typeof data === "object")
		//	return this.add(this.M(data))


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
		if ((typeof data === "object") && (data instanceof DynamodbFactory.util.Raw )) {
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


	DynamoDB.prototype.query = function() {
		var r = new Request( this.client, this.events )
		return r.sql(arguments[0],arguments[1]);
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
		this.events = $events // global events
		this.local_events = {}
		this.client = $client

		this.reset()
	}

	Request.prototype.reset = function() {
		//console.log("reseting")

		this.Select = null

		this.AttributesToGet = [] // deprecated in favor of ProjectionExpression
		this.ProjectionExpression = undefined
		this.ExpressionAttributeNames = undefined
		this.ExpressionAttributeValues = undefined

		this.FilterExpression = undefined

		this.pendingKey = null
		this.pendingFilter = null
		this.pendingIf = null

		this.whereKey = {}
		this.KeyConditionExpression = undefined

		this.whereOther = {}
		this.whereFilter = {}
		this.whereFilterExpression = []  // same as whereFilter, except we can support same attribute compared multiple times

		this.ifFilter = {}
		this.ifConditionExpression = []  // same as ifFilter, except we can support same attribute compared multiple times
		this.ConditionExpression = undefined

		this.limit_value = null
		this.IndexName = null
		this.ScanIndexForward = true
		this.LastEvaluatedKey = null
		this.ExclusiveStartKey = null
		this.ConsistentRead = false
		this.ReturnConsumedCapacity = 'TOTAL'
		this.ReturnValues = DynamoDB.NONE
		//this.ConsumedCapacity = null

	}

	Request.prototype.routeCall = function(method, params, reset ,callback ) {
		var $this = this
		this.events.beforeRequest.apply( this, [ method, params ])

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
	Request.prototype.describeTable = function( table, callback ) {
		this.routeCall('describeTable', { TableName: table }, false, function(err,data) {
			return callback.apply( this, [ err, data ] )
		})
	}

	Request.prototype.describe = function( callback ) {
		this.routeCall('describeTable', { TableName: this.tableName }, true,function(err,raw) {
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
	Request.prototype.on = function(eventName, callback ) {
		this.local_events[eventName] = callback
		return this
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
		var $this = this

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {
				$this.describeTable($this.tableName, function(err,data) {
					if (err)
						return reject(err)

					for (var i in data.Table.KeySchema ) {
						$this.if(data.Table.KeySchema[i].AttributeName).not_exists()
					}

					var $thisQuery = {
						TableName: $this.tableName,
						Item: DynamodbFactory.util.anormalizeItem(item),
						Expected: DynamodbFactory.util.buildExpected( $this.ifFilter ),
						ReturnConsumedCapacity: $this.ReturnConsumedCapacity,
						ReturnValues: $this.ReturnValues
					}

				if (typeof $this.local_events['beforeRequest'] === "function" )
						$this.local_events['beforeRequest']('putItem', $thisQuery)

					$this.routeCall('putItem', $thisQuery ,true, function(err,data) {
						if (err)
							return reject(err)

						fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
					})
				})
			})
		}

		this.describeTable(this.tableName, function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			for (var i in data.Table.KeySchema ) {
				this.if(data.Table.KeySchema[i].AttributeName).not_exists()
			}

			var $thisQuery = {
				TableName: this.tableName,
				Item: DynamodbFactory.util.anormalizeItem(item),
				Expected: DynamodbFactory.util.buildExpected( this.ifFilter ),
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}

			if (typeof this.local_events['beforeRequest'] === "function" )
				this.local_events['beforeRequest']('putItem', $thisQuery)

			this.routeCall('putItem', $thisQuery ,true, function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
			})
		})
	}

	// remember that replace should fail if item does not exist
	Request.prototype.replace = function(item, callback) {
		var $this = this
		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {
				$this.describeTable($this.tableName, function(err,data) {
					if (err)
						return reject(err)

					for (var i in data.Table.KeySchema ) {
						$this.if(data.Table.KeySchema[i].AttributeName).eq(item[ data.Table.KeySchema[i].AttributeName ])
					}

					var $thisQuery = {
						TableName: $this.tableName,
						Item: DynamodbFactory.util.anormalizeItem(item),
						Expected: DynamodbFactory.util.buildExpected( $this.ifFilter ),
						ReturnConsumedCapacity: $this.ReturnConsumedCapacity,
						ReturnValues: $this.ReturnValues
					}

					$this.routeCall('putItem', $thisQuery, true , function(err,data) {
						if (err)
							return reject(err)

						fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
					})
				})
			})
		}

		this.describeTable(this.tableName, function(err,data) {
			if (err)
				return callback(err, false)

			for (var i in data.Table.KeySchema ) {
				this.if(data.Table.KeySchema[i].AttributeName).eq(item[ data.Table.KeySchema[i].AttributeName ])
			}

			var $thisQuery = {
				TableName: this.tableName,
				Item: DynamodbFactory.util.anormalizeItem(item),
				Expected: DynamodbFactory.util.buildExpected( this.ifFilter ),
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}

			this.routeCall('putItem', $thisQuery, true , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
			})
		})
	}

	Request.prototype.update = function($attrz, callback, $action ) {
		var $this = this

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {

				$this.describeTable($this.tableName, function(err,data) {
					if (err)
						return reject(err)

					for (var i in data.Table.KeySchema ) {
						if (!$this.whereKey.hasOwnProperty(data.Table.KeySchema[i].AttributeName)) {
							// aws will throw: Uncaught ValidationException: The provided key element does not match the schema
							// we're throwing a more understandable error
							return reject({message: "Uncaught ValidationException: Missing value for Attribute '" + data.Table.KeySchema[i].AttributeName + "' in .where()" })
						} else {
							$this.if(data.Table.KeySchema[i].AttributeName).eq(DynamodbFactory.util.normalizeItem({key: $this.whereKey[ data.Table.KeySchema[i].AttributeName ]}).key )
						}
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
									Value: DynamodbFactory.util.stringify($attrz[$k])
								}
							}
						}
					}
					//this.buildConditionExpression()
					var $thisQuery = {
						TableName: $this.tableName,
						Key: $this.whereKey,

						Expected: DynamodbFactory.util.buildExpected( $this.ifFilter ),

						//ConditionExpression: $this.ConditionExpression,
						//ExpressionAttributeNames: $this.ExpressionAttributeNames,
						//ExpressionAttributeValues: $this.ExpressionAttributeValues,

						//UpdateExpression
						AttributeUpdates : $to_update,

						ReturnConsumedCapacity: $this.ReturnConsumedCapacity,
						ReturnValues: $this.ReturnValues,

					}

					if (typeof $this.local_events['beforeRequest'] === "function" )
						$this.local_events['beforeRequest']('updateItem', $thisQuery)

					$this.routeCall('updateItem', $thisQuery, true , function(err,data) {
						if (err)
							return reject(err)

						fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
					})
				})
			})
		}

		this.describeTable(this.tableName, function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback(err, false)

			for (var i in data.Table.KeySchema ) {
				if (!this.whereKey.hasOwnProperty(data.Table.KeySchema[i].AttributeName)) {
					// aws will throw: Uncaught ValidationException: The provided key element does not match the schema
					// we're throwing a more understandable error
					typeof callback !== "function" ? null : callback.apply( this, [{message: "Uncaught ValidationException: Missing value for Attribute '" + data.Table.KeySchema[i].AttributeName + "' in .where()" }])
				} else {
					this.if(data.Table.KeySchema[i].AttributeName).eq(DynamodbFactory.util.normalizeItem({key: this.whereKey[ data.Table.KeySchema[i].AttributeName ]}).key )
				}

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
							Value: DynamodbFactory.util.stringify($attrz[$k])
						}
					}
				}
			}
			//this.buildConditionExpression()
			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,


				Expected: DynamodbFactory.util.buildExpected( this.ifFilter ),

				//ConditionExpression: this.ConditionExpression,
				//ExpressionAttributeNames: this.ExpressionAttributeNames,
				//ExpressionAttributeValues: this.ExpressionAttributeValues,

				//UpdateExpression
				AttributeUpdates : $to_update,

				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues,

			}

			if (typeof this.local_events['beforeRequest'] === "function" )
				this.local_events['beforeRequest']('updateItem', $thisQuery)

			this.routeCall('updateItem', $thisQuery, true , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
			})
		})
	}

	Request.prototype.insert_or_update = function( params, callback, $action ) {
		var $this = this
		var $attrz = DynamodbFactory.util.clone( params )

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {

				$this.describeTable($this.tableName, function(err,data) {
					if (err)
						return reject(err)

					// extract the hash/range keys
					for (var i in data.Table.KeySchema ) {
						$this.where(data.Table.KeySchema[i].AttributeName).eq( $attrz[data.Table.KeySchema[i].AttributeName])
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
									Value: DynamodbFactory.util.stringify($attrz[$k])
								}
							}
						}
					}
					var $thisQuery = {
						TableName: $this.tableName,
						Key: $this.whereKey,
						AttributeUpdates : $to_update,
						ReturnConsumedCapacity: $this.ReturnConsumedCapacity,
						ReturnValues: $this.ReturnValues
					}
					$this.routeCall('updateItem', $thisQuery, true , function(err,data) {
						if (err)
							return reject(err)

						fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
					})
				})
			})
		}



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
							Value: DynamodbFactory.util.stringify($attrz[$k])
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
			this.routeCall('updateItem', $thisQuery, true , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
			})
		})
	}

	Request.prototype.insert_or_replace = function( item, callback ) {
		var $this = this

		var $thisQuery = {
			TableName: this.tableName,
			Item: DynamodbFactory.util.anormalizeItem(item),
			ReturnConsumedCapacity: this.ReturnConsumedCapacity,
			ReturnValues: this.ReturnValues
		}

		if (typeof this.local_events['beforeRequest'] === "function" )
			this.local_events['beforeRequest']('putItem', $thisQuery)

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {
				$this.routeCall('putItem', $thisQuery , true, function(err,data) {
					if (err)
						return reject(err)

					fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
				})
			})
		}

		this.routeCall('putItem', $thisQuery , true , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
		})
	}

	Request.prototype.delete = function($attrz, callback ) {
		var $this = this

		if ( arguments.length === 0) {
			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}
			return new Promise(function(fullfill, reject) {
				$this.routeCall('deleteItem', $thisQuery , true, function(err,data) {
					if (err)
						return reject(err)

					fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
				})
			})
		} else if (typeof $attrz == 'function') {
			// delete entire item, $attrz is actually the callback

			var $thisQuery = {
				TableName: this.tableName,
				Key: this.whereKey,
				ReturnConsumedCapacity: this.ReturnConsumedCapacity,
				ReturnValues: this.ReturnValues
			}
			this.routeCall('deleteItem', $thisQuery, true , function(err,data) {
				if (err)
					return $attrz.apply( this, [ err, false ] )

				$attrz.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
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
			this.routeCall('updateItem', $thisQuery , true , function(err,data) {
				if (err)
					return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

				typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
			})
		}
	}

	Request.prototype.get = function(callback) {
		var $this = this
		this.buildProjectionExpression() // this will set ProjectionExpression and ExpressionAttributeNames
		var $thisQuery = {
			TableName: this.tableName,
			Key: this.whereKey,
			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.ReturnConsumedCapacity,

			ProjectionExpression: this.ProjectionExpression,
			ExpressionAttributeNames: this.ExpressionAttributeNames,
		}

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {
				$this.routeCall('getItem', $thisQuery , true, function(err,data) {
					if (err)
						return reject(err)

					fullfill(DynamodbFactory.util.normalizeItem(data.Item))
				})
			})
		}


		this.routeCall('getItem', $thisQuery , true, function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Item), data ])
		})
	}

	Request.prototype.query = function(callback) {
		var $this = this

		if ( this.KeyConditionExpression === undefined )
			this.buildKeyConditionExpression() // will set KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues

		if ( this.ProjectionExpression === undefined )
			this.buildProjectionExpression() // will set ProjectionExpression, ExpressionAttributeNames

		if ( this.FilterExpression === undefined )
			this.buildFilterExpression() // will set FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues

		var $thisQuery = {
			TableName: this.tableName,

			KeyConditionExpression: this.KeyConditionExpression,

			ConsistentRead: this.ConsistentRead,
			ReturnConsumedCapacity: this.ReturnConsumedCapacity,

			"Select": this.Select !== null ? this.Select : undefined,
			//AttributesToGet: this.AttributesToGet.length ? this.AttributesToGet : undefined

			ProjectionExpression: this.ProjectionExpression,
			ExpressionAttributeNames: this.ExpressionAttributeNames,

			FilterExpression: this.FilterExpression,

			ExpressionAttributeValues: this.ExpressionAttributeValues,
		}
		if (this.limit_value !== null)
			$thisQuery['Limit'] = this.limit_value;

		if (this.ScanIndexForward !== true) {
				$thisQuery['ScanIndexForward'] = false;
		}
		if ( this.IndexName !== null )
			$thisQuery['IndexName'] = this.IndexName;

		if ( this.ExclusiveStartKey !== null )
			$thisQuery['ExclusiveStartKey'] = this.ExclusiveStartKey;

		if (typeof this.local_events['beforeRequest'] === "function" )
			this.local_events['beforeRequest']('updateItem', $thisQuery)

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {
				$this.routeCall('query', $thisQuery , true, function(err,data) {
					if (err)
						return reject(err)

					fullfill(DynamodbFactory.util.normalizeList(data.Items))
				})
			})
		}

		this.routeCall('query', $thisQuery , true , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey

			typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeList(data.Items), data ])
		})

		return this
	}

	Request.prototype.scan = function( callback ) {
		var $this = this

		if ( this.ProjectionExpression === undefined )
			this.buildProjectionExpression() // this will set ProjectionExpression and ExpressionAttributeNames

		this.buildFilterExpression()
		var $thisQuery = {
			TableName: this.tableName,
			"Select": this.Select !== null ? this.Select : undefined,

			ProjectionExpression: this.ProjectionExpression,
			ExpressionAttributeNames: this.ExpressionAttributeNames,

			FilterExpression: this.FilterExpression,

			ExpressionAttributeValues: this.ExpressionAttributeValues,

			ReturnConsumedCapacity: this.ReturnConsumedCapacity
		}

		if (this.limit_value !== null)
			$thisQuery['Limit'] = this.limit_value;


		if ( this.ExclusiveStartKey !== null )
			$thisQuery['ExclusiveStartKey'] = this.ExclusiveStartKey;

		if ( this.IndexName !== null )
			$thisQuery['IndexName'] = this.IndexName;

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {
				$this.routeCall('scan', $thisQuery , true, function(err,data) {
					if (err)
						return reject(err)

					fullfill(DynamodbFactory.util.normalizeList(data.Items))
				})
			})
		}

		this.routeCall('scan', $thisQuery, true , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey

			typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeList(data.Items), data ])

		})
	}

	Request.prototype.sql = function( sql, callback ) {
		var $this = this;

		var sqp;
		try {
			sqp = sqlparser.parse( sql );
		} catch(err){
			return callback(err)
		}

		if (sqp.length > 1)
			return callback( { errorCode: 'UNSUPPORTED_MULTIQUERY', errorMessage: '[AWSPILOT] Multiple queries not supported, yet!' } )

		sqp = sqp[0];

		if (typeof callback !== "function") {
			return new Promise(function(fullfill, reject) {
				switch (sqp.statement) {
					case 'BATCHINSERT':

						if (typeof $this.local_events['beforeRequest'] === "function" )
							$this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

						$this.routeCall( sqp.operation, sqp.dynamodb ,true, function(err,data) {
							if (err)
								return reject(err)

							fullfill(data)
						})

						break;
					case 'INSERT':
						$this.describeTable(sqp.dynamodb.TableName, function(err,data) {
							if (err)
								return reject(err)

							for (var i in data.Table.KeySchema ) {
								$this.if(data.Table.KeySchema[i].AttributeName).not_exists()
							}

							sqp.dynamodb.Expected = DynamodbFactory.util.buildExpected( $this.ifFilter )

							if (typeof $this.local_events['beforeRequest'] === "function" )
								$this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

							$this.routeCall( sqp.operation, sqp.dynamodb ,true, function(err,data) {
								if (err)
									return reject(err)

								fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
							})
						})
						break;
					case 'UPDATE':
						$this.describeTable(sqp.dynamodb.TableName, function(err,data) {
							if (err)
								return reject(err)

							if (Object.keys(sqp.dynamodb.Expected).length !== Object.keys(data.Table.KeySchema).length)
								return reject( { errorCode: 'WHERE_SCHEMA_INVALID' } )

							for (var i in data.Table.KeySchema ) {
								if (! sqp.dynamodb.Expected.hasOwnProperty(data.Table.KeySchema[i].AttributeName))
									return reject( { errorCode: 'WHERE_SCHEMA_INVALID' } )
							}

							if (typeof $this.local_events['beforeRequest'] === "function" )
								$this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

							$this.routeCall( sqp.operation, sqp.dynamodb ,true, function(err,data) {
								if (err)
									return reject(err)

								fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
							})

						})
						break
					case 'REPLACE':
					case 'DELETE':

						if (typeof $this.local_events['beforeRequest'] === "function" )
							$this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

						$this.routeCall( sqp.operation, sqp.dynamodb ,true, function(err,data) {
							if (err)
								return reject(err)

							fullfill(DynamodbFactory.util.normalizeItem(data.Attributes || {}))
						})

						break;
					case 'SELECT':
					case 'SCAN':

						if (typeof $this.local_events['beforeRequest'] === "function" )
							$this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

						$this.routeCall( sqp.operation, sqp.dynamodb ,true, function(err,data) {
							if (err)
								return reject(err)
						
							this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey
						
							fullfill(DynamodbFactory.util.normalizeList(data.Items || []))
						})
						break;
					default:
						reject({ errorCode: 'UNSUPPORTED_QUERY_TYPE' })
				}

			})
		}


		switch (sqp.statement) {
			case 'BATCHINSERT':
				if (typeof this.local_events['beforeRequest'] === "function" )
					this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

				this.routeCall(sqp.operation, sqp.dynamodb ,true, function(err,data) {
					if (err)
						return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

					typeof callback !== "function" ? null : callback.apply( this, [ err, data, data ])
				})
				break;
			case 'INSERT':

				this.describeTable(sqp.dynamodb.TableName, function(err,data) {
					if (err)
						return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

					for (var i in data.Table.KeySchema ) {
						this.if(data.Table.KeySchema[i].AttributeName).not_exists()
					}

					sqp.dynamodb.Expected = DynamodbFactory.util.buildExpected( this.ifFilter )

					if (typeof this.local_events['beforeRequest'] === "function" )
						this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

					this.routeCall(sqp.operation, sqp.dynamodb ,true, function(err,data) {
						if (err)
							return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

						typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
					})

				})

				break;
			case 'UPDATE':

				this.describeTable(sqp.dynamodb.TableName, function(err,data) {
					if (err)
						return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

					if (Object.keys(sqp.dynamodb.Expected).length !== Object.keys(data.Table.KeySchema).length)
						return callback( { errorCode: 'WHERE_SCHEMA_INVALID' } )

					for (var i in data.Table.KeySchema ) {
						if (! sqp.dynamodb.Expected.hasOwnProperty(data.Table.KeySchema[i].AttributeName))
							return callback( { errorCode: 'WHERE_SCHEMA_INVALID' } )
					}

					if (typeof this.local_events['beforeRequest'] === "function" )
						this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

					this.routeCall(sqp.operation, sqp.dynamodb ,true, function(err,data) {
						if (err)
							return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

						typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
					})

				})
				break;
			case 'REPLACE':
			case 'DELETE':

				if (typeof this.local_events['beforeRequest'] === "function" )
					this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

				this.routeCall(sqp.operation, sqp.dynamodb ,true, function(err,data) {
					if (err)
						return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

					typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeItem(data.Attributes || {}), data ])
				})

				break;
			case 'SELECT':
			case 'SCAN':

				if (typeof this.local_events['beforeRequest'] === "function" )
					this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

				this.routeCall(sqp.operation, sqp.dynamodb, true , function(err,data) {
					if (err)
						return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )
				
					this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey
				
					typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.normalizeList(data.Items), data ])
				
				})
				break;
			default:
				return callback({ errorCode: 'UNSUPPORTED_QUERY_TYPE' })
				break;
		}
	}

	Request.prototype.resume = function( from ) {
		this.ExclusiveStartKey = from
		return this
	}
	Request.prototype.compare = function( $comparison, $value , $value2 ) {
		if (this.pendingFilter !== null) {
			this.whereFilter[this.pendingFilter] = {
				operator: $comparison,
				type: DynamodbFactory.util.anormalizeType($value),
				value: $value,
				value2: $value2
			}
			this.whereFilterExpression.push({
				attribute: this.pendingFilter,
				operator: $comparison,
				type: DynamodbFactory.util.anormalizeType($value),
				value: $value,
				value2: $value2
			})
			this.pendingFilter = null
			return this
		}

		if (this.pendingIf !== null) {
			if ($comparison == 'EQ') {
				this.ifFilter[this.pendingIf] = new DynamodbFactory.util.Raw({ Exists: true, Value: DynamodbFactory.util.stringify($value) })
			} else {
				this.ifFilter[this.pendingIf] = { operator: $comparison, type: DynamodbFactory.util.anormalizeType($value), value: $value, value2: $value2 }
			}

			this.ifConditionExpression.push({
				attribute: this.pendingIf,
				operator: $comparison,
				type: DynamodbFactory.util.anormalizeType($value),
				value: $value,
				value2: $value2
			})

			this.pendingIf = null
			return this
		}

		this.whereOther[this.pendingKey] = { operator: $comparison, type: DynamodbFactory.util.anormalizeType($value), value: $value, value2: $value2 }
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

		this.whereKey[this.pendingKey] = DynamodbFactory.util.stringify( $value )

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
		return this.compare( 'CONTAINS', $value )
	}
	Request.prototype.not_contains = function( $value ) {
		return this.compare( 'NOT_CONTAINS', $value )
	}
	Request.prototype.in = function( $value ) {
		return this.compare( 'IN', $value )
	}

	// Expected only
	Request.prototype.exists = function( ) {
		if (this.pendingIf !== null) {
			this.ifFilter[this.pendingIf] = new DynamodbFactory.util.Raw({ Exists: true })

			this.pendingIf = null
			return this
		}
		return this
	}
	Request.prototype.not_exists = function( ) {
		if (this.pendingIf !== null) {
			this.ifFilter[this.pendingIf] = new DynamodbFactory.util.Raw({ Exists: false })
			this.pendingIf = null
			return this
		}
		return this
	}

	// helper functions ...

	Request.prototype.registerExpressionAttributeName = function(item, ALLOW_DOT ) {
		var $this = this

		if ($this.ExpressionAttributeNames === undefined)
			$this.ExpressionAttributeNames = {}



		if (!ALLOW_DOT)
			return DynamodbFactory.util.expression_name_split(item).map(function(original_attName) {

				var attName =  original_attName.split('-').join('_minus_').split('.').join('_dot_') // "-","." not allowed
				var attSpecialName = '#' + attName


				if (attName.indexOf('[') !== -1) {
					attSpecialName = attName.split('[').map(function(v) {
						if (v[v.length-1] == ']')
							return v

						$this.ExpressionAttributeNames[ '#'+v ] = v
						return '#' + v
					}).join('[')
				} else {
					if (attSpecialName[0] === '#')
						$this.ExpressionAttributeNames[ attSpecialName ] = original_attName
				}

				return attSpecialName
			}).join('.')


		//if (ALLOW_DOT)
		var original_attName = item
		var attName =  original_attName.split('-').join('_minus_').split('.').join('_dot_') // "-","." not allowed

		var attSpecialName = '#' + attName


		if (attName.indexOf('[') !== -1) {
			attSpecialName = attName.split('[').map(function(v) {
				if (v[v.length-1] == ']')
					return v

				$this.ExpressionAttributeNames[ '#'+v ] = v
				return '#' + v
			}).join('[')
		} else {
			if (attSpecialName[0] === '#')
				$this.ExpressionAttributeNames[ attSpecialName ] = original_attName
		}

		return attSpecialName

	}
	Request.prototype.registerExpressionAttributeValue = function(original_attName, value) {
		if (this.ExpressionAttributeValues === undefined)
			this.ExpressionAttributeValues = {}

		var attName = original_attName.split('-').join('_minus_').split('"').join("_quote_") // "-" not allowed

		var attNameValue = ':' + attName.split('.').join('_').split('[').join('_idx_').split(']').join('')

		var attNameValueVersion = 1;
		while (this.ExpressionAttributeValues.hasOwnProperty(attNameValue+'_v'+attNameValueVersion)) attNameValueVersion++

		this.ExpressionAttributeValues[attNameValue+'_v'+attNameValueVersion] = DynamodbFactory.util.stringify( value )

		return attNameValue+'_v'+attNameValueVersion
	}

	Request.prototype.buildProjectionExpression = function() {
		if (!this.AttributesToGet.length)
			return

		var $this = this

		this.ProjectionExpression = this.AttributesToGet.map(function(item) {
			return $this.registerExpressionAttributeName(item)
		}).join(', ')
	}

	//
	Request.prototype.buildKeyConditionExpression = function(idx) {
		var $this = this
		var ret = []
		this.KeyConditionExpression = Object.keys(this.whereKey).map(function(key) {
			return $this.registerExpressionAttributeName(key, true ) + ' ' +
				'=' + ' ' +
				$this.registerExpressionAttributeValue(key, DynamodbFactory.util.normalizeItem({value: $this.whereKey[key] }).value, true )
		}).concat(
			Object.keys(this.whereOther).map(function(key) {
				var whereFilter = $this.whereOther[key]

				switch (filterOperators[whereFilter.operator]) {
					case '=':
					case '<':
					case '<=':
					case '>':
					case '>=':
						return $this.registerExpressionAttributeName(key, true ) + ' ' +
							filterOperators[whereFilter.operator] + ' ' +
							$this.registerExpressionAttributeValue(key, whereFilter.value, true )
						break

					case  'BETWEEN':
						return $this.registerExpressionAttributeName(key, true ) + ' BETWEEN ' +
							$this.registerExpressionAttributeValue(key+'_1', whereFilter.value, true ) +
							' AND ' +
							$this.registerExpressionAttributeValue(key+'_2', whereFilter.value2, true )
						break;

					case 'begins_with':
						return 'begins_with(' + $this.registerExpressionAttributeName(key, true ) + ', ' + $this.registerExpressionAttributeValue(key, whereFilter.value, true ) + ')'
						break;

				}
			})
		).map(function(v) { return '( ' + v + ' )'}).join(" AND \n")
	}

	Request.prototype.buildFilterExpression = function(idx) {
		var $this = this

		if (!this.whereFilterExpression.length)
			return

		var ret = []
		this.FilterExpression = this.whereFilterExpression.map(function(whereFilter) {
			var key = whereFilter.attribute

			switch (filterOperators[whereFilter.operator]) {
				case '=':
				case '<>':
				case '<':
				case '<=':
				case '>':
				case '>=':
					return $this.registerExpressionAttributeName(whereFilter.attribute) + ' ' +
						filterOperators[whereFilter.operator] + ' ' +
						$this.registerExpressionAttributeValue(whereFilter.attribute, whereFilter.value)
					break

				case  'BETWEEN':
					return $this.registerExpressionAttributeName(whereFilter.attribute) + ' BETWEEN ' +
						$this.registerExpressionAttributeValue(whereFilter.attribute+'_1', whereFilter.value) +
						' AND ' +
						$this.registerExpressionAttributeValue(whereFilter.attribute+'_2', whereFilter.value2)
					break;

				case 'IN':
					return $this.registerExpressionAttributeName(whereFilter.attribute) + ' IN (' +
							whereFilter.value.map(function(v, idx) {
								return $this.registerExpressionAttributeValue(whereFilter.attribute+'_' + idx, v)
							}).join(',')  +
						' )'
					break;


				case 'attribute_exists':
					return 'attribute_exists(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ')'
					break;

				case 'attribute_not_exists':
					return 'attribute_not_exists(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ')'
					break;

				case 'begins_with':
					return 'begins_with(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ', ' + $this.registerExpressionAttributeValue(whereFilter.attribute, whereFilter.value) + ')'
					break;

				case 'contains':
					return 'contains(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ', ' + $this.registerExpressionAttributeValue(whereFilter.attribute, whereFilter.value) + ')'
					break;

				case 'not_contains':
					return 'NOT contains(' + $this.registerExpressionAttributeName(whereFilter.attribute) + ', ' + $this.registerExpressionAttributeValue(whereFilter.attribute, whereFilter.value) + ')'
					break;
				//attribute_type (path, type)
				//size (path)
			}
		}).map(function(v) { return '( ' + v + ' )'}).join(" AND \n")
	}


	// RAW functions, used by dynamodb-sql 
	Request.prototype.RawIndexName = function( value ) {
		this.IndexName = value
		return this
	}
	Request.prototype.RawScanIndexForward = function( value ) {
		this.ScanIndexForward = value
		return this
	}
	Request.prototype.RawLimit = function( value ) {
		this.limit_value = value
		return this
	}
	Request.prototype.RawConsistentRead = function( value ) {
		this.ConsistentRead = value
		return this
	}
	Request.prototype.RawKeyConditionExpression = function( value ) {
		this.KeyConditionExpression = value
		return this
	}
	Request.prototype.RawExpressionAttributeNames = function( value ) {
		this.ExpressionAttributeNames = value
		return this
	}
	Request.prototype.RawExpressionAttributeValues = function( value ) {
		this.ExpressionAttributeValues = value
		return this
	}
	Request.prototype.RawProjectionExpression = function( value ) {
		this.ProjectionExpression = value
		return this
	}
	Request.prototype.RawFilterExpression = function( value ) {
		this.FilterExpression = value
		return this
	}


DynamoDB.Raw = function(data) {
	this.data = data
}
DynamoDB.Raw.prototype.getRawData = function() {
	return this.data
}
module.exports = DynamodbFactory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./sqlparser.js":7,"@awspilot/dynamodb-util":8}],7:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var sqlparser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,17],$V1=[1,18],$V2=[1,19],$V3=[1,20],$V4=[1,27],$V5=[1,21],$V6=[1,22],$V7=[1,23],$V8=[1,24],$V9=[1,28],$Va=[1,26],$Vb=[5,6],$Vc=[5,6,124,126],$Vd=[1,37],$Ve=[1,38],$Vf=[5,6,126],$Vg=[1,58],$Vh=[1,59],$Vi=[1,60],$Vj=[1,56],$Vk=[1,51],$Vl=[1,57],$Vm=[21,22,92],$Vn=[1,66],$Vo=[5,6,29,54,65,71,73,97,99,104,107,110,112,117,124,125,126,132,135,141,146,147,148,149,150,151,153,157,165,167,176,181],$Vp=[1,83],$Vq=[1,84],$Vr=[1,85],$Vs=[1,86],$Vt=[1,87],$Vu=[5,6,73,90,91,92,93],$Vv=[5,6,53,54,73,90,91,92,93],$Vw=[1,93],$Vx=[54,117],$Vy=[54,107],$Vz=[5,6,73,90,91],$VA=[2,120],$VB=[5,6,124,126,141],$VC=[1,156],$VD=[1,174],$VE=[1,172],$VF=[1,173],$VG=[1,175],$VH=[1,176],$VI=[1,177],$VJ=[1,179],$VK=[1,178],$VL=[1,180],$VM=[5,6,54],$VN=[5,6,53,54,63,107,112,124,125,126,141],$VO=[5,6,53,54,63,107],$VP=[54,63],$VQ=[2,91],$VR=[1,209],$VS=[1,210],$VT=[53,54],$VU=[2,59],$VV=[1,221],$VW=[5,6,54,107,112,124,125,126,141],$VX=[1,238],$VY=[5,6,124,125,126],$VZ=[1,258],$V_=[1,259],$V$=[1,260],$V01=[1,256],$V11=[1,257],$V21=[1,252],$V31=[5,6,112],$V41=[1,297],$V51=[5,6,124,125,126,141],$V61=[1,303],$V71=[1,301],$V81=[1,304],$V91=[1,305],$Va1=[1,306],$Vb1=[1,307],$Vc1=[1,308],$Vd1=[1,309],$Ve1=[1,310],$Vf1=[5,6,104,112,124,126,146,147,148,149,150,151,153,157],$Vg1=[5,6,104,112,124,125,126,146,147,148,149,150,151,153,157],$Vh1=[1,337],$Vi1=[1,342],$Vj1=[1,340],$Vk1=[1,343],$Vl1=[1,344],$Vm1=[1,345],$Vn1=[1,346],$Vo1=[1,347],$Vp1=[1,348],$Vq1=[1,349],$Vr1=[54,73],$Vs1=[5,6,112,124,125,126,141],$Vt1=[2,281],$Vu1=[1,434],$Vv1=[5,6,54,107],$Vw1=[2,283],$Vx1=[1,453],$Vy1=[54,73,171];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"main":3,"sql_stmt_list":4,"EOF":5,"SEMICOLON":6,"sql_stmt":7,"select_stmt":8,"insert_stmt":9,"update_stmt":10,"replace_stmt":11,"delete_stmt":12,"create_table_stmt":13,"show_tables_stmt":14,"drop_table_stmt":15,"describe_table_stmt":16,"drop_index_stmt":17,"scan_stmt":18,"debug_stmt":19,"name":20,"LITERAL":21,"BRALITERAL":22,"database_table_name":23,"DOT":24,"dynamodb_table_name":25,"database_index_name":26,"dynamodb_index_name":27,"signed_number":28,"NUMBER":29,"string_literal":30,"SINGLE_QUOTED_STRING":31,"DOUBLE_QUOTED_STRING":32,"XSTRING":33,"literal_value":34,"boolean":35,"TRUE":36,"FALSE":37,"boolean_value":38,"dynamodb_data_string":39,"dynamodb_raw_string":40,"dynamodb_data_number":41,"dynamodb_raw_number":42,"dynamodb_data_boolean":43,"dynamodb_raw_boolean":44,"dynamodb_data_null":45,"NULL":46,"dynamodb_raw_null":47,"dynamodb_data_undefined":48,"UNDEFINED":49,"dynamodb_data_array":50,"ARRAYLPAR":51,"array_list":52,"ARRAYRPAR":53,"COMMA":54,"array_value":55,"dynamodb_data_json":56,"dynamodb_raw_array":57,"array_list_raw":58,"array_value_raw":59,"dynamodb_raw_json":60,"JSONLPAR":61,"dynamodb_data_json_list":62,"JSONRPAR":63,"dynamodb_data_json_kv":64,"COLON":65,"dynamodb_data_json_list_raw":66,"dynamodb_raw_json_kv":67,"dynamodb_raw_stringset":68,"NEW":69,"STRINGSET":70,"LPAR":71,"stringset_list":72,"RPAR":73,"dynamodb_raw_numberset":74,"NUMBERSET":75,"numberset_list":76,"javascript_data_obj_date":77,"DATE":78,"javascript_raw_date_parameter":79,"javascript_raw_obj_date":80,"def_resolvable_expr":81,"javascript_raw_obj_math":82,"javascript_data_obj_math":83,"MATH":84,"javascript_raw_math_funcname":85,"javascript_raw_math_parameter":86,"RANDOM":87,"javascript_raw_expr":88,"dev_resolvable_value":89,"PLUS":90,"MINUS":91,"STAR":92,"SLASH":93,"INSERT":94,"def_insert_ignore":95,"INTO":96,"SET":97,"def_insert_columns":98,"VALUES":99,"def_insert_items":100,"IGNORE":101,"def_insert_item":102,"def_insert_onecolumn":103,"EQ":104,"UPDATE":105,"def_update_columns":106,"WHERE":107,"def_update_where":108,"def_update_onecolumn":109,"PLUSEQ":110,"def_update_where_cond":111,"AND":112,"REPLACE":113,"def_replace_columns":114,"def_replace_onecolumn":115,"DELETE":116,"FROM":117,"def_delete_where":118,"def_delete_where_cond":119,"def_select":120,"select_sort_clause":121,"limit_clause":122,"def_consistent_read":123,"LIMIT":124,"DESC":125,"CONSISTENT_READ":126,"distinct_all":127,"DISTINCT":128,"ALL":129,"def_select_columns":130,"def_select_onecolumn":131,"AS":132,"def_select_from":133,"def_select_use_index":134,"USE":135,"INDEX":136,"def_where":137,"select_where_hash":138,"select_where_range":139,"def_having":140,"HAVING":141,"having_expr":142,"SELECT":143,"where_expr":144,"bind_parameter":145,"OR":146,"GT":147,"GE":148,"LT":149,"LE":150,"BETWEEN":151,"where_between":152,"LIKE":153,"select_where_hash_value":154,"select_where_range_value":155,"select_where_between":156,"CONTAINS":157,"CREATE":158,"TABLE":159,"def_ct_typedef_list":160,"def_ct_pk":161,"def_ct_indexes":162,"def_ct_index_list":163,"def_ct_index":164,"LSI":165,"def_ct_projection":166,"GSI":167,"def_ct_throughput":168,"PRIMARY":169,"KEY":170,"THROUGHPUT":171,"PROJECTION":172,"KEYS_ONLY":173,"def_ct_projection_list":174,"def_ct_typedef":175,"STRING":176,"SHOW":177,"TABLES":178,"DROP":179,"DESCRIBE":180,"ON":181,"def_scan":182,"def_scan_limit_clause":183,"def_scan_consistent_read":184,"SCAN":185,"def_scan_columns":186,"def_scan_use_index":187,"def_scan_having":188,"def_scan_onecolumn":189,"def_scan_having_expr":190,"DEBUG":191,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"SEMICOLON",21:"LITERAL",22:"BRALITERAL",24:"DOT",29:"NUMBER",31:"SINGLE_QUOTED_STRING",32:"DOUBLE_QUOTED_STRING",33:"XSTRING",36:"TRUE",37:"FALSE",46:"NULL",49:"UNDEFINED",51:"ARRAYLPAR",53:"ARRAYRPAR",54:"COMMA",61:"JSONLPAR",63:"JSONRPAR",65:"COLON",69:"NEW",70:"STRINGSET",71:"LPAR",73:"RPAR",75:"NUMBERSET",78:"DATE",84:"MATH",87:"RANDOM",90:"PLUS",91:"MINUS",92:"STAR",93:"SLASH",94:"INSERT",96:"INTO",97:"SET",99:"VALUES",101:"IGNORE",104:"EQ",105:"UPDATE",107:"WHERE",110:"PLUSEQ",112:"AND",113:"REPLACE",116:"DELETE",117:"FROM",124:"LIMIT",125:"DESC",126:"CONSISTENT_READ",128:"DISTINCT",129:"ALL",132:"AS",135:"USE",136:"INDEX",141:"HAVING",143:"SELECT",145:"bind_parameter",146:"OR",147:"GT",148:"GE",149:"LT",150:"LE",151:"BETWEEN",153:"LIKE",157:"CONTAINS",158:"CREATE",159:"TABLE",165:"LSI",167:"GSI",169:"PRIMARY",170:"KEY",171:"THROUGHPUT",172:"PROJECTION",173:"KEYS_ONLY",176:"STRING",177:"SHOW",178:"TABLES",179:"DROP",180:"DESCRIBE",181:"ON",185:"SCAN",191:"DEBUG"},
productions_: [0,[3,2],[4,3],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[20,1],[20,1],[23,3],[23,1],[25,1],[26,1],[27,1],[28,1],[30,1],[30,1],[30,1],[34,1],[34,1],[35,1],[35,1],[38,1],[38,1],[39,1],[39,1],[40,1],[40,1],[41,1],[42,1],[43,1],[43,1],[44,1],[44,1],[45,1],[47,1],[48,1],[50,3],[52,3],[52,1],[55,0],[55,1],[55,1],[55,1],[55,1],[55,1],[55,1],[57,3],[58,3],[58,1],[59,0],[59,1],[59,1],[59,1],[59,1],[59,1],[59,1],[56,3],[62,3],[62,1],[64,0],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[60,3],[66,3],[66,1],[67,0],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[67,3],[68,7],[72,3],[72,1],[74,7],[76,3],[76,1],[77,5],[77,9],[80,5],[80,9],[79,0],[79,1],[82,1],[83,6],[85,1],[85,1],[86,0],[86,1],[88,1],[81,1],[81,3],[81,3],[81,3],[81,3],[81,3],[89,1],[89,1],[89,1],[89,1],[9,6],[9,6],[95,0],[95,1],[100,3],[100,1],[102,3],[98,3],[98,1],[103,3],[103,3],[103,3],[103,3],[103,3],[103,3],[103,3],[103,3],[103,3],[103,3],[10,6],[106,3],[106,1],[109,3],[109,3],[109,3],[109,3],[109,3],[109,3],[109,3],[109,3],[109,3],[109,3],[109,3],[109,3],[108,1],[108,3],[111,3],[111,3],[111,3],[111,3],[11,5],[114,3],[114,1],[115,3],[115,3],[115,3],[115,3],[115,3],[115,3],[115,3],[115,3],[115,3],[115,3],[12,5],[118,1],[118,3],[119,3],[119,3],[119,3],[119,3],[8,4],[122,0],[122,2],[121,0],[121,1],[123,0],[123,1],[127,0],[127,1],[127,1],[130,3],[130,1],[131,1],[131,1],[131,3],[133,2],[134,0],[134,3],[137,2],[137,4],[140,2],[140,0],[120,7],[144,1],[144,1],[144,1],[144,3],[144,3],[144,3],[144,3],[144,3],[144,3],[144,3],[144,3],[144,3],[138,3],[154,1],[154,1],[154,1],[154,1],[139,3],[139,3],[139,3],[139,3],[139,3],[139,3],[139,3],[155,1],[155,1],[155,1],[155,1],[156,3],[156,3],[152,3],[152,3],[142,1],[142,1],[142,1],[142,1],[142,3],[142,3],[142,3],[142,3],[142,3],[142,3],[142,3],[142,3],[142,3],[142,3],[142,3],[142,3],[13,9],[162,0],[162,2],[163,3],[163,1],[164,7],[164,8],[164,9],[164,10],[161,6],[161,8],[168,0],[168,3],[166,0],[166,2],[166,2],[166,4],[174,3],[174,1],[160,3],[160,1],[175,2],[175,2],[14,2],[15,3],[16,3],[17,5],[18,3],[182,6],[183,0],[183,2],[184,0],[184,1],[186,3],[186,1],[189,1],[189,1],[189,3],[187,0],[187,3],[188,2],[188,0],[190,1],[190,1],[190,1],[190,1],[190,3],[190,3],[190,3],[190,3],[190,3],[190,3],[190,3],[190,3],[190,3],[190,3],[190,3],[190,3],[19,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

			this.$ = $$[$0-1];
			return this.$;
		
break;
case 2:
 this.$ = $$[$0-2]; if($$[$0]) this.$.push($$[$0]); 
break;
case 3: case 48: case 58: case 68: case 90: case 112: case 144: case 147: case 160: case 181: case 210: case 288: case 304:
 this.$ = [$$[$0]]; 
break;
case 16: case 20: case 22: case 23: case 24: case 25: case 26: case 214: case 216: case 222: case 248: case 249: case 254: case 255: case 309: case 312: case 313:
 this.$ = $$[$0]; 
break;
case 17:
 this.$ = $$[$0].substr(1,$$[$0].length-2); 
break;
case 18:
 this.$ = {database:$$[$0-2], table:$$[$0]}; 
break;
case 19:
 this.$ = {table:$$[$0]}; 
break;
case 21:
 this.$ = {index:$$[$0]}; 
break;
case 27:
 this.$ = {type:'number', number:$$[$0]}; 
break;
case 28:
 this.$ = {type:'string', string: $$[$0]}
break;
case 29: case 39:
 this.$ = true; 
break;
case 30: case 40:
 this.$ = false; 
break;
case 31:
 this.$ = {type:'boolean', value: true }; 
break;
case 32:
 this.$ = {type:'boolean', value: false }; 
break;
case 33: case 34: case 37:
 this.$ = eval($$[$0]); 
break;
case 35: case 36:
 this.$ = { 'S': eval($$[$0]).toString() } 
break;
case 38:
 this.$ = { 'N': eval($$[$0]).toString() } 
break;
case 41:
 this.$ = { 'BOOL': true  } 
break;
case 42:
 this.$ = { 'BOOL': false } 
break;
case 43:
 this.$ = null; 
break;
case 44:
 this.$ = { 'NULL': true } 
break;
case 45:
 this.$ = "\0"; 
break;
case 46:

			if ($$[$0-1].slice(-1) == "\0") {
				this.$ = $$[$0-1].slice(0,-1)
			} else
				this.$ = $$[$0-1];
		
break;
case 47: case 57: case 111:

			this.$ = $$[$0-2] 
			this.$.push($$[$0]); 
		
break;
case 49: case 59:
 this.$ = "\0" 
break;
case 50: case 51: case 52: case 53: case 54: case 55: case 60: case 61: case 62: case 63: case 64: case 65: case 121: case 124: case 127: case 129: case 135: case 136: case 137: case 138: case 235: case 236: case 237: case 238: case 246: case 247:
 this.$ = $$[$0] 
break;
case 56:

			if ($$[$0-1].slice(-1) == "\0") {
				$$[$0-1] = $$[$0-1].slice(0,-1)
			}
			this.$ = { 'L': $$[$0-1] }
		
break;
case 66:
 
			var $kv = {}
			if ($$[$0-1]) {
				$$[$0-1].map(function(v) {
					if (v)
						$kv[v[0]] = v[1]
				})
			}
			this.$ = $kv
		
break;
case 67: case 89: case 143: case 146: case 159: case 180: case 209: case 273: case 287: case 303:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 69: case 91: case 200: case 206: case 215: case 271: case 299: case 308:
 this.$ = undefined; 
break;
case 70: case 71: case 72: case 73: case 74: case 75: case 76: case 77: case 78: case 79: case 80: case 81: case 82: case 83: case 84: case 85: case 86: case 87: case 92: case 95: case 98: case 101: case 104: case 107:
 this.$ = [$$[$0-2], $$[$0] ] 
break;
case 88:
 
			var $kv = {}
			if ($$[$0-1]) {
				$$[$0-1].map(function(v) {
					if (v)
						$kv[v[0]] = v[1]
				})
			}
			this.$ = { 'M': $kv }
		
break;
case 93: case 94: case 96: case 97: case 99: case 100: case 102: case 103: case 105: case 106: case 108: case 109:
 this.$ = [eval($$[$0-2]), $$[$0] ] 
break;
case 110:

			if ($$[$0-2].slice(-1) == "\0") {
				$$[$0-2] = $$[$0-2].slice(0,-1)
			}
			this.$ = { 'SS': $$[$0-2] }
		
break;
case 113:

			if ($$[$0-2].slice(-1) == "\0") {
				$$[$0-2] = $$[$0-2].slice(0,-1)
			}
			this.$ = { 'NS': $$[$0-2] }
		
break;
case 114:

			this.$ = $$[$0-2] 
			this.$.push( ($$[$0]).toString() ); 
		
break;
case 115:
 this.$ = [ ($$[$0]).toString() ]; 
break;
case 116:

			var date;
			if ($$[$0-1])
				date = new Date($$[$0-1]);
			else
				date = new Date()

			if (typeof date === "object") {
				this.$ = date.toString()
			}
			if (typeof date === "string") {
				this.$ = date
			}
			if (typeof date === "number") {
				this.$ = date
			}
		
break;
case 117:

			var date;
			if ($$[$0-5])
				date = new Date($$[$0-5]);
			else
				date = new Date()


			if (typeof date[$$[$0-2]] === "function" ) {
				date = date[$$[$0-2]]();
				if (typeof date === "object") {
					this.$ = date.toString()
				}
				if (typeof date === "string") {
					this.$ = date
				}
				if (typeof date === "number") {
					this.$ = date
				}
			} else {
				throw $$[$0-2] + " not a function"
			}
		
break;
case 118:

			var date;
			if ($$[$0-1])
				date = new Date($$[$0-1]);
			else
				date = new Date()

			if (typeof date === "object") {
				this.$ = { S: date.toString() }
			}
			if (typeof date === "string") {
				this.$ = { S: date }
			}
			if (typeof date === "number") {
				this.$ = { N: date.toString() }
			}
		
break;
case 119:

			var date;
			if ($$[$0-5])
				date = new Date($$[$0-5]);
			else
				date = new Date()


			if (typeof date[$$[$0-2]] === "function" ) {
				date = date[$$[$0-2]]();
				if (typeof date === "object") {
					this.$ = { S: date.toString() }
				}
				if (typeof date === "string") {
					this.$ = { S: date }
				}
				if (typeof date === "number") {
					this.$ = { N: date.toString() }
				}
			} else {
				throw $$[$0-2] + " not a function"
			}
		
break;
case 120: case 126:
 this.$ = undefined 
break;
case 122: case 128:

			if (typeof $$[$0] === "object") {
				this.$ = { S: $$[$0].toString() }
			}
			if (typeof $$[$0] === "string") {
				this.$ = { S: $$[$0] }
			}
			if (typeof $$[$0] === "number") {
				this.$ = { N: $$[$0].toString() }
			}
		
break;
case 123:

			if (typeof Math[$$[$0-3]] === "function" ) {
				this.$ = Math[$$[$0-3]]($$[$0-1]);
			} else {
				throw 'Math.' + $$[$0-3] + " not a function"
			}
		
break;
case 125:
 this.$ = 'random' 
break;
case 130: case 145:
 this.$ = $$[$0-1] 
break;
case 131:
 this.$ = $$[$0-2] + $$[$0] 
break;
case 132:
 this.$ = $$[$0-2] - $$[$0] 
break;
case 133:
 this.$ = $$[$0-2] * $$[$0] 
break;
case 134:

			if ($$[$0] === 0 )
				throw 'Division by 0';

			this.$ = $$[$0-2] / $$[$0]
		
break;
case 139:

			var $kv = {}
			$$[$0].map(function(v) { $kv[v[0]] = v[1] })

			this.$ = {
				statement: 'INSERT',
				operation: 'putItem',
				ignore: $$[$0-4],
				dynamodb: {
					TableName: $$[$0-2],
					Item: $kv,

				},

			};

		
break;
case 140:

			if ($$[$0].length == 1) {
				this.$ = {
					statement: 'INSERT',
					operation: 'putItem',
					ignore: $$[$0-4],
					dynamodb: {
						TableName: $$[$0-2],
						Item: $$[$0][0].M,
					},

				};
			} else {
				// batch insert
				this.$ = {
					statement: 'BATCHINSERT',
					operation: 'batchWriteItem',
					dynamodb: {
						RequestItems: {}
					}

				}

				var RequestItems = {}

				RequestItems[$$[$0-2]] = []

				$$[$0].map(function(v) {
					RequestItems[$$[$0-2]].push({
						PutRequest: {
							Item: v.M
						}
					})
				})
				this.$.dynamodb.RequestItems = RequestItems;
			}
		
break;
case 141:
 this.$ = false 
break;
case 142:
 this.$ = true 
break;
case 148: case 149: case 150: case 151: case 152: case 153: case 154: case 155: case 156: case 157: case 161: case 162: case 163: case 164: case 165: case 166: case 167: case 168: case 169: case 170: case 182: case 183: case 184: case 185: case 186: case 187: case 188: case 189: case 190: case 191: case 250: case 251:
 this.$ = [ $$[$0-2], $$[$0] ]; 
break;
case 158:


			var Key = {}
			$$[$0].map(function(k) {
				Key[k.k] = k.v
			})
			var Expected = {}
			$$[$0].map(function(k) {
				Expected[k.k] = {
					ComparisonOperator: 'EQ',
					Value: k.v,

				}
			})

			var AttributeUpdates = {}
			$$[$0-2].map(function(k) {
				var Value = k[1]
				var Action = 'PUT' // default

				if (k[2] === '+=')
					Action = 'ADD'

				if (k[2] === 'delete') {
					Action = 'DELETE'

				}

				AttributeUpdates[k[0]] = {
					Action: Action,
					Value: Value,
				}
			})

			this.$ = {
				statement: 'UPDATE',
				operation: 'updateItem',
				dynamodb: {
					TableName: $$[$0-4],
					Key: Key,
					Expected: Expected,
					AttributeUpdates: AttributeUpdates,
				},
			}
		
break;
case 171:
 this.$ = [ $$[$0-2], $$[$0], '+=' ]; 
break;
case 172:
 this.$ = [ $$[$0-2], undefined, 'delete' ]; 
break;
case 173: case 193: case 274: case 290:
 this.$ = [ $$[$0] ]; 
break;
case 174: case 194:
 this.$ = [$$[$0-2], $$[$0]]; 
break;
case 175: case 176: case 177: case 178: case 195: case 196: case 197: case 198:
 this.$ = {k: $$[$0-2], v: $$[$0] }; 
break;
case 179:

			var $kv = {}
			$$[$0].map(function(v) {
				$kv[v[0]] = v[1]
			})
			this.$ = {
				statement: 'REPLACE',
				operation: 'putItem',
				dynamodb: {
					TableName: $$[$0-2],
					Item: $kv
				},
			}
		
break;
case 192:

			var $kv = {}
			$$[$0].map(function(v) { $kv[v.k] = v.v })

			this.$ = {
				statement: 'DELETE',
				operation: 'deleteItem',
				dynamodb: {
					TableName: $$[$0-2],
					Key: $kv,
				}
			}
		
break;
case 199:

			this.$ = {
				statement: 'SELECT',
				operation: 'query',
				dynamodb: $$[$0-3].dynamodb,
			};
			yy.extend(this.$.dynamodb,$$[$0-2]);
			yy.extend(this.$.dynamodb,$$[$0-1]);
			yy.extend(this.$.dynamodb,$$[$0]);
		
break;
case 201:
 this.$ = { Limit: $$[$0] }; 
break;
case 202:
 this.$ = { ScanIndexForward: true }; 
break;
case 203:
 this.$ = { ScanIndexForward: false }; 
break;
case 204: case 301:
 this.$ = { ConsistentRead: false }; 
break;
case 205:
 this.$ = { ConsistentRead: true }; 
break;
case 207:
 this.$ = {distinct:true}; 
break;
case 208:
 this.$ = {all:true}; 
break;
case 211: case 305:
 this.$ = {type: 'star', star:true}; 
break;
case 212: case 306:
 this.$ = {type: 'column', column: $$[$0]}; 
break;
case 213: case 307:
 this.$ = {type: 'column', column: $$[$0-2], alias: $$[$0] }; 
break;
case 217:

			this.$ = {
				//KeyConditionExpression: $$[$0],
				ExpressionAttributeNames: {},
				ExpressionAttributeValues: {},
			};

			this.$.ExpressionAttributeNames[ '#partitionKeyName' ] = $$[$0].partition.partitionKeyName
			this.$.ExpressionAttributeValues[ ':partitionKeyValue' ] = $$[$0].partition.partitionKeyValue
			this.$.KeyConditionExpression = ' #partitionKeyName =  :partitionKeyValue '

		
break;
case 218:

			this.$ = {
				//KeyConditionExpression: $$[$0-2],
				ExpressionAttributeNames: {},
				ExpressionAttributeValues: {},
			};

			this.$.ExpressionAttributeNames[ '#partitionKeyName' ] = $$[$0-2].partition.partitionKeyName
			this.$.ExpressionAttributeValues[ ':partitionKeyValue' ] = $$[$0-2].partition.partitionKeyValue
			this.$.KeyConditionExpression = ' #partitionKeyName =  :partitionKeyValue '


			if ($$[$0].sort) {
				this.$.ExpressionAttributeNames[ '#sortKeyName' ] = $$[$0].sort.sortKeyName

				switch ($$[$0].sort.op) {
					case '=':
					case '>':
					case '>=':
					case '<':
					case '<=':
						this.$.ExpressionAttributeValues[ ':sortKeyValue' ] = $$[$0].sort.sortKeyValue
						this.$.KeyConditionExpression += ' AND #sortKeyName ' + $$[$0].sort.op + ' :sortKeyValue '

						break;
					case 'BETWEEN':
						this.$.ExpressionAttributeValues[ ':sortKeyValue1' ] = $$[$0].sort.sortKeyValue1
						this.$.ExpressionAttributeValues[ ':sortKeyValue2' ] = $$[$0].sort.sortKeyValue2
						this.$.KeyConditionExpression += ' AND #sortKeyName BETWEEN :sortKeyValue1 AND :sortKeyValue2'
						break;
					case 'BEGINS_WITH':

						if ($$[$0].sort.sortKeyValue.S.slice(-1) !== '%' )
							throw "LIKE '%string' must end with a % for sort key "


						$$[$0].sort.sortKeyValue.S = $$[$0].sort.sortKeyValue.S.slice(0,-1)

						this.$.ExpressionAttributeValues[ ':sortKeyValue' ] = $$[$0].sort.sortKeyValue
						this.$.KeyConditionExpression += ' AND begins_with ( #sortKeyName, :sortKeyValue ) '

						break;
				}

			}


		
break;
case 219: case 310:
 this.$ = {having: $$[$0]}; 
break;
case 221:

			this.$ = {
				dynamodb: {
					TableName: $$[$0-3],
					IndexName: $$[$0-2],
				},
				columns:$$[$0-4]
			};
			yy.extend(this.$.dynamodb,$$[$0-5]);
			yy.extend(this.$.dynamodb,$$[$0-1]);
			yy.extend(this.$.dynamodb,$$[$0]);

			// if we have star, then the rest does not matter
			if (this.$.columns.filter(function(c) { return c.type === 'star'}).length === 0) {
				if (!this.$.dynamodb.hasOwnProperty('ExpressionAttributeNames'))
					this.$.dynamodb.ExpressionAttributeNames = {}

				var ExpressionAttributeNames_from_projection = { }
				var ProjectionExpression = []
				this.$.columns.map(function(c) {
					if (c.type === "column") {
						var replaced_name = '#projection_' + c.column.split('-').join('_minus_').split('.').join('_dot_')
						ExpressionAttributeNames_from_projection[replaced_name] = c.column;
						ProjectionExpression.push(replaced_name)
					}

				})

				yy.extend(this.$.dynamodb.ExpressionAttributeNames,ExpressionAttributeNames_from_projection);

				if (ProjectionExpression.length)
					this.$.dynamodb.ProjectionExpression = ProjectionExpression.join(' , ')

			}


		
break;
case 223: case 256: case 314:
 this.$ = {bind_parameter: $$[$0]}; 
break;
case 224: case 257: case 315:
 this.$ = {column: $$[$0]}; 
break;
case 225: case 258: case 316:
 this.$ = {op: 'AND', left: $$[$0-2], right: $$[$0]}; 
break;
case 226: case 259: case 317:
 this.$ = {op: 'OR', left: $$[$0-2], right: $$[$0]}; 
break;
case 227: case 260: case 318:
 this.$ = {op: '=', left: $$[$0-2], right: $$[$0]}; 
break;
case 228: case 261: case 319:
 this.$ = {op: '>', left: $$[$0-2], right: $$[$0]}; 
break;
case 229: case 262: case 320:
 this.$ = {op: '>=', left: $$[$0-2], right: $$[$0]}; 
break;
case 230: case 263: case 321:
 this.$ = {op: '<', left: $$[$0-2], right: $$[$0]}; 
break;
case 231: case 264: case 322:
 this.$ = {op: '<=', left: $$[$0-2], right: $$[$0]}; 
break;
case 232: case 265: case 323:
 this.$ = {op: 'BETWEEN', left: $$[$0-2], right:$$[$0] }; 
break;
case 233: case 266: case 324:
 this.$ = {op: 'LIKE', left:$$[$0-2], right: { type: 'string', string: $$[$0] } }; 
break;
case 234:

			this.$ = {
				partition: {
					partitionKeyName: $$[$0-2],
					partitionKeyValue: $$[$0]
				}
			}
		
break;
case 239:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '='
				}
			}
		
break;
case 240:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '>'
				}
			}
		
break;
case 241:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '>='
				}
			}
		
break;
case 242:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '<'
				}
			}
		
break;
case 243:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '<='
				}
			}
		
break;
case 244:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue1: $$[$0][0],
					sortKeyValue2: $$[$0][1],
					op: 'BETWEEN'
				}
			}
		
break;
case 245:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: 'BEGINS_WITH'
				}
			}
		
break;
case 252:
 this.$ = {left: { type: 'number', number: $$[$0-2]}, right: {type: 'number', number: $$[$0] } }; 
break;
case 253:
 this.$ = {left: { type: 'string', string: $$[$0-2]}, right: {type: 'string', string: $$[$0] } }; 
break;
case 267: case 325:
 this.$ = {op: 'CONTAINS', left:$$[$0-2], right: { type: 'string', string: $$[$0] } }; 
break;
case 268: case 326:
 this.$ = {op: 'CONTAINS', left:$$[$0-2], right: { type: 'number', number: $$[$0] } }; 
break;
case 269: case 327:
 this.$ = {op: 'CONTAINS', left:$$[$0-2], right: { type: 'boolean', value: $$[$0] } }; 
break;
case 270:

			this.$ = {
				statement: 'CREATE_TABLE',
				operation: 'createTable',
				dynamodb: {
					TableName: $$[$0-6],
					AttributeDefinitions: $$[$0-4],
				}
				
			};
			yy.extend(this.$.dynamodb,$$[$0-2]); // extend with pk
			yy.extend(this.$.dynamodb,$$[$0-1]); // extend with indexes
		
break;
case 272:

			var indexes = {
				LocalSecondaryIndexes: [],
				GlobalSecondaryIndexes: []
			}
			
			$$[$0].map(function(idx) {
				if (idx.hasOwnProperty('LSI'))
					indexes.LocalSecondaryIndexes.push(idx.LSI)
				if (idx.hasOwnProperty('GSI'))
					indexes.GlobalSecondaryIndexes.push(idx.GSI)
			})
			this.$ = indexes
		
break;
case 275:

			this.$ = {}
			this.$[$$[$0-4]] = { 
				IndexName: $$[$0-5], 
				KeySchema: [ { AttributeName: $$[$0-2], KeyType: 'HASH' } ], 
				Projection: $$[$0],
			}
		
break;
case 276:

			this.$ = {}
			this.$[$$[$0-5]] = { 
				IndexName: $$[$0-6], 
				KeySchema: [ { AttributeName: $$[$0-3], KeyType: 'HASH' } ], 
				Projection: $$[$0-1],
				ProvisionedThroughput: $$[$0] 
			}
		
break;
case 277:

			this.$ = {}
			this.$[$$[$0-6]] = { 
				IndexName: $$[$0-7], 
				KeySchema: [ { AttributeName: $$[$0-4], KeyType: 'HASH' }, { AttributeName: $$[$0-2], KeyType: 'RANGE' } ], 
				Projection: $$[$0],
			}
		
break;
case 278:

			this.$ = {}
			this.$[$$[$0-7]] = { 
				IndexName: $$[$0-8], 
				KeySchema: [ { AttributeName: $$[$0-5], KeyType: 'HASH' }, { AttributeName: $$[$0-3], KeyType: 'RANGE' } ], 
				Projection: $$[$0-1],
				ProvisionedThroughput: $$[$0] 
			}
		
break;
case 279:
 this.$ = { KeySchema: [ { AttributeName: $$[$0-2], KeyType: 'HASH' }], ProvisionedThroughput: $$[$0] }  
break;
case 280:
 this.$ = { KeySchema: [ { AttributeName: $$[$0-4], KeyType: 'HASH' } , { AttributeName: $$[$0-2], KeyType: 'RANGE' } ], ProvisionedThroughput: $$[$0] }  
break;
case 281:
 this.$ = { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }; 
break;
case 282:
 this.$ = { ReadCapacityUnits: eval($$[$0-1]), WriteCapacityUnits: eval($$[$0]) } 
break;
case 283: case 284:
 this.$ = { ProjectionType: 'ALL' }; 
break;
case 285:
 this.$ = { ProjectionType: 'KEYS_ONLY' } 
break;
case 286:
 this.$ = { ProjectionType: 'INCLUDE', NonKeyAttributes: $$[$0-1] } 
break;
case 289:
 this.$ = $$[$0-2]; this.$.push($$[$0]) 
break;
case 291:
 this.$ = { AttributeName: $$[$0-1], AttributeType: 'S'}; 
break;
case 292:
 this.$ = { AttributeName: $$[$0-1], AttributeType: 'N'}; 
break;
case 293:

			this.$ = {
				statement: 'SHOW_TABLES',
				operation: 'listTables',
				dynamodb: {}
			}
		
break;
case 294:

			this.$ = {
				statement: 'DROP_TABLE',
				operation: 'deleteTable',
				dynamodb: {
					TableName: $$[$0]
				}
			};
		
break;
case 295:

			this.$ = {
				statement: 'DESCRIBE_TABLE',
				operation: 'describeTable',
				dynamodb: {
					TableName: $$[$0]
				}
			};
		
break;
case 296:

			this.$ = {
				statement: 'DROP_INDEX',
				operation: 'updateTable',
				dynamodb: {
					TableName: $$[$0],
					GlobalSecondaryIndexUpdates: [
						{
							Delete: {
								IndexName: $$[$0-2]
							}
						}
					]
				}
			};
		
break;
case 297:

			this.$ = {
				statement: 'SCAN', 
				operation: 'scan',
				dynamodb: $$[$0-2].dynamodb,
			};

			this.$.columns = $$[$0-2].columns
			this.$.having  = Object.keys($$[$0-2].having).length ? $$[$0-2].having : undefined;
			
			yy.extend(this.$.dynamodb, $$[$0-1]);
			yy.extend(this.$.dynamodb, $$[$0]);
		
break;
case 298:

			this.$ = {
				dynamodb: {
					TableName: $$[$0-2],
					IndexName: $$[$0-1],
				},
				columns:$$[$0-4],
				having: {},
			}; 
			yy.extend(this.$,$$[$0]); // filter


			// if we have star, then the rest does not matter
			if (this.$.columns.filter(function(c) { return c.type === 'star'}).length === 0) {
				if (!this.$.dynamodb.hasOwnProperty('ExpressionAttributeNames'))
					this.$.dynamodb.ExpressionAttributeNames = {}

				var ExpressionAttributeNames_from_projection = { }
				var ProjectionExpression = []
				this.$.columns.map(function(c) {
					if (c.type === "column") {
						var replaced_name = '#projection_' + c.column.split('-').join('_minus_').split('.').join('_dot_') 
						ExpressionAttributeNames_from_projection[replaced_name] = c.column;
						ProjectionExpression.push(replaced_name)
					}	
				})
				
				yy.extend(this.$.dynamodb.ExpressionAttributeNames,ExpressionAttributeNames_from_projection);
				
				if (ProjectionExpression.length)
					this.$.dynamodb.ProjectionExpression = ProjectionExpression.join(' , ')
			
			}


		
break;
case 300:
 this.$ = {Limit: $$[$0]}; 
break;
case 302:
 this.$ = { ConsistentRead: true  }; 
break;
case 328:

			this.$ = $$[$0]
		
break;
}
},
table: [{3:1,4:2,7:3,8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,94:$V0,105:$V1,113:$V2,116:$V3,120:16,143:$V4,158:$V5,177:$V6,179:$V7,180:$V8,182:25,185:$V9,191:$Va},{1:[3]},{5:[1,29],6:[1,30]},o($Vb,[2,3]),o($Vb,[2,4]),o($Vb,[2,5]),o($Vb,[2,6]),o($Vb,[2,7]),o($Vb,[2,8]),o($Vb,[2,9]),o($Vb,[2,10]),o($Vb,[2,11]),o($Vb,[2,12]),o($Vb,[2,13]),o($Vb,[2,14]),o($Vb,[2,15]),o($Vc,[2,202],{121:31,125:[1,32]}),{95:33,96:[2,141],101:[1,34]},{20:36,21:$Vd,22:$Ve,25:35},{96:[1,39]},{117:[1,40]},{159:[1,41]},{178:[1,42]},{136:[1,44],159:[1,43]},{159:[1,45]},o($Vf,[2,299],{183:46,124:[1,47]}),{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,77:52,81:49,83:53,84:$Vl,88:48,89:50},o($Vm,[2,206],{127:61,128:[1,62],129:[1,63]}),{20:67,21:$Vd,22:$Ve,92:$Vn,186:64,189:65},{1:[2,1]},{7:68,8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,94:$V0,105:$V1,113:$V2,116:$V3,120:16,143:$V4,158:$V5,177:$V6,179:$V7,180:$V8,182:25,185:$V9,191:$Va},o($Vf,[2,200],{122:69,124:[1,70]}),o($Vc,[2,203]),{96:[1,71]},{96:[2,142]},{97:[1,72]},o([5,6,71,97,99,107,124,126,135,141],[2,20]),o($Vo,[2,16]),o($Vo,[2,17]),{20:36,21:$Vd,22:$Ve,25:73},{20:36,21:$Vd,22:$Ve,25:74},{20:36,21:$Vd,22:$Ve,25:75},o($Vb,[2,293]),{20:36,21:$Vd,22:$Ve,25:76},{20:78,21:$Vd,22:$Ve,27:77},{20:36,21:$Vd,22:$Ve,25:79},o($Vb,[2,301],{184:80,126:[1,81]}),{28:82,29:$Vp},o($Vb,[2,328]),o($Vb,[2,128],{90:$Vq,91:$Vr,92:$Vs,93:$Vt}),o($Vu,[2,129]),{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,77:52,81:88,83:53,84:$Vl,89:50},o($Vu,[2,135]),o($Vu,[2,136]),o($Vu,[2,137]),o($Vu,[2,138]),{78:[1,89]},{24:[1,90]},o($Vv,[2,37]),o($Vv,[2,33]),o($Vv,[2,34]),{20:94,21:$Vd,22:$Ve,92:$Vw,130:91,131:92},o($Vm,[2,207]),o($Vm,[2,208]),{54:[1,96],117:[1,95]},o($Vx,[2,304]),o($Vx,[2,305]),o($Vx,[2,306],{132:[1,97]}),o($Vb,[2,2]),o($Vb,[2,204],{123:98,126:[1,99]}),{28:100,29:$Vp},{20:36,21:$Vd,22:$Ve,25:101},{20:104,21:$Vd,22:$Ve,106:102,109:103},{97:[1,105]},{107:[1,106]},{71:[1,107]},o($Vb,[2,294]),{181:[1,108]},{181:[2,22]},o($Vb,[2,295]),o($Vb,[2,297]),o($Vb,[2,302]),o($Vf,[2,300]),o([5,6,29,54,73,104,112,124,125,126,146,147,148,149,150,151,153,157],[2,23]),{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,77:52,81:109,83:53,84:$Vl,89:50},{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,77:52,81:110,83:53,84:$Vl,89:50},{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,77:52,81:111,83:53,84:$Vl,89:50},{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,77:52,81:112,83:53,84:$Vl,89:50},{73:[1,113],90:$Vq,91:$Vr,92:$Vs,93:$Vt},{71:[1,114]},{21:[1,116],85:115,87:[1,117]},{54:[1,119],117:[1,120],133:118},o($Vx,[2,210]),o($Vx,[2,211]),o($Vx,[2,212],{132:[1,121]}),{20:36,21:$Vd,22:$Ve,25:122},{20:67,21:$Vd,22:$Ve,92:$Vn,189:123},{20:124,21:$Vd,22:$Ve},o($Vb,[2,199]),o($Vb,[2,205]),o($Vf,[2,201]),{97:[1,125],99:[1,126]},{54:[1,128],107:[1,127]},o($Vy,[2,160]),{104:[1,129],110:[1,130]},{20:133,21:$Vd,22:$Ve,114:131,115:132},{20:136,21:$Vd,22:$Ve,118:134,119:135},{20:139,21:$Vd,22:$Ve,160:137,175:138},{20:36,21:$Vd,22:$Ve,25:140},o($Vz,[2,131],{92:$Vs,93:$Vt}),o($Vz,[2,132],{92:$Vs,93:$Vt}),o($Vu,[2,133]),o($Vu,[2,134]),o($Vu,[2,130]),{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,73:$VA,77:52,79:141,81:142,83:53,84:$Vl,89:50},{71:[1,143]},{71:[2,124]},{71:[2,125]},{107:[2,215],134:144,135:[1,145]},{20:94,21:$Vd,22:$Ve,92:$Vw,131:146},{20:36,21:$Vd,22:$Ve,25:147},{20:148,21:$Vd,22:$Ve},o($VB,[2,308],{187:149,135:[1,150]}),o($Vx,[2,303]),o($Vx,[2,307]),{20:153,21:$Vd,22:$Ve,98:151,103:152},{71:$VC,100:154,102:155},{20:159,21:$Vd,22:$Ve,108:157,111:158},{20:104,21:$Vd,22:$Ve,109:160},{29:$VD,31:$VE,32:$VF,36:$VG,37:$VH,40:161,42:162,44:163,46:$VI,47:164,48:171,49:[1,182],51:$VJ,57:166,60:165,61:$VK,68:167,69:$VL,74:168,80:169,82:170,83:181,84:$Vl},{29:$VD,42:183},o($Vb,[2,179],{54:[1,184]}),o($VM,[2,181]),{104:[1,185]},o($Vb,[2,192]),o($Vb,[2,193],{112:[1,186]}),{104:[1,187]},{54:[1,188]},{54:[2,290]},{29:[1,190],176:[1,189]},o($Vb,[2,296]),{73:[1,191]},{73:[2,121],90:$Vq,91:$Vr,92:$Vs,93:$Vt},{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,73:[2,126],77:52,81:193,83:53,84:$Vl,86:192,89:50},{107:[1,195],137:194},{136:[1,196]},o($Vx,[2,209]),o([107,135],[2,214]),o($Vx,[2,213]),o($Vc,[2,311],{188:197,141:[1,198]}),{136:[1,199]},o($Vb,[2,139],{54:[1,200]}),o($VM,[2,147]),{104:[1,201]},o($Vb,[2,140],{54:[1,202]}),o($VM,[2,144]),{60:203,61:$VK},o($Vb,[2,158]),o($Vb,[2,173],{112:[1,204]}),{104:[1,205]},o($Vy,[2,159]),o($Vy,[2,161]),o($Vy,[2,162]),o($Vy,[2,163]),o($Vy,[2,164]),o($Vy,[2,165]),o($Vy,[2,166]),o($Vy,[2,167]),o($Vy,[2,168]),o($Vy,[2,169]),o($Vy,[2,170]),o($Vy,[2,172]),o($VN,[2,35]),o($VN,[2,36]),o($VN,[2,38]),o($VO,[2,41]),o($VO,[2,42]),o($VO,[2,44]),o($VP,$VQ,{66:206,67:207,20:208,21:$Vd,22:$Ve,31:$VR,32:$VS}),o($VT,$VU,{58:211,59:212,42:213,40:214,44:215,47:216,57:217,60:218,29:$VD,31:$VE,32:$VF,36:$VG,37:$VH,46:$VI,51:$VJ,61:$VK}),{70:[1,219],75:[1,220],78:$VV},o($VW,[2,122]),o($Vy,[2,45]),o($Vy,[2,171]),{20:133,21:$Vd,22:$Ve,115:222},{29:$VD,31:$VE,32:$VF,36:$VG,37:$VH,40:223,42:224,44:225,46:$VI,47:226,51:$VJ,57:228,60:227,61:$VK,68:229,69:$VL,74:230,80:231,82:232,83:181,84:$Vl},{20:136,21:$Vd,22:$Ve,119:233},{29:$VD,31:$VE,32:$VF,40:234,42:235,69:$VX,80:236,82:237,83:181,84:$Vl},{20:139,21:$Vd,22:$Ve,161:239,169:[1,241],175:240},{54:[2,291]},{54:[2,292]},o($Vu,[2,116],{24:[1,242]}),{73:[1,243]},{73:[2,127],90:$Vq,91:$Vr,92:$Vs,93:$Vt},o($VY,[2,220],{140:244,141:[1,245]}),{20:247,21:$Vd,22:$Ve,138:246},{20:248,21:$Vd,22:$Ve},o($Vc,[2,298]),{20:253,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:250,36:$V01,37:$V11,38:251,145:$V21,190:249},{20:261,21:$Vd,22:$Ve},{20:153,21:$Vd,22:$Ve,103:262},{29:$VD,31:$VE,32:$VF,36:$VG,37:$VH,40:263,42:264,44:265,46:$VI,47:266,51:$VJ,57:268,60:267,61:$VK,68:269,69:$VL,74:270,80:271,82:272,83:181,84:$Vl},{71:$VC,102:273},{73:[1,274]},{20:159,21:$Vd,22:$Ve,111:275},{29:$VD,31:$VE,32:$VF,40:276,42:277,69:$VX,80:278,82:279,83:181,84:$Vl},{54:[1,281],63:[1,280]},o($VP,[2,90]),{65:[1,282]},{65:[1,283]},{65:[1,284]},{53:[1,285],54:[1,286]},o($VT,[2,58]),o($VT,[2,60]),o($VT,[2,61]),o($VT,[2,62]),o($VT,[2,63]),o($VT,[2,64]),o($VT,[2,65]),{71:[1,287]},{71:[1,288]},{71:[1,289]},o($VM,[2,180]),o($VM,[2,182]),o($VM,[2,183]),o($VM,[2,184]),o($VM,[2,185]),o($VM,[2,186]),o($VM,[2,187]),o($VM,[2,188]),o($VM,[2,189]),o($VM,[2,190]),o($VM,[2,191]),o($Vb,[2,194]),o($V31,[2,195]),o($V31,[2,196]),o($V31,[2,197]),o($V31,[2,198]),{78:$VV},{54:[1,291],73:[2,271],162:290},{54:[2,289]},{170:[1,292]},{21:[1,293]},o([5,6,54,73,90,91,92,93,107,112,124,125,126,141],[2,123]),o($VY,[2,221]),{20:298,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:295,36:$V01,37:$V11,38:296,142:294,145:$V41},o($V51,[2,217],{112:[1,299]}),{104:[1,300]},{107:[2,216]},o($Vc,[2,310],{104:$V61,112:$V71,146:[1,302],147:$V81,148:$V91,149:$Va1,150:$Vb1,151:$Vc1,153:$Vd1,157:$Ve1}),o($Vf1,[2,312]),o($Vf1,[2,313]),o($Vf1,[2,314]),o($Vf1,[2,315]),o($Vg1,[2,27]),o($Vg1,[2,28]),o($Vg1,[2,31]),o($Vg1,[2,32]),o($Vg1,[2,24]),o($Vg1,[2,25]),o($Vg1,[2,26]),o($VB,[2,309]),o($VM,[2,146]),o($VM,[2,148]),o($VM,[2,149]),o($VM,[2,150]),o($VM,[2,151]),o($VM,[2,152]),o($VM,[2,153]),o($VM,[2,154]),o($VM,[2,155]),o($VM,[2,156]),o($VM,[2,157]),o($VM,[2,143]),o($VM,[2,145]),o($Vb,[2,174]),o($V31,[2,175]),o($V31,[2,176]),o($V31,[2,177]),o($V31,[2,178]),o([5,6,53,54,63,73,107],[2,88]),o($VP,$VQ,{20:208,67:311,21:$Vd,22:$Ve,31:$VR,32:$VS}),{29:$VD,31:$VE,32:$VF,36:$VG,37:$VH,40:313,42:312,44:314,46:$VI,47:315,51:$VJ,57:316,60:317,61:$VK},{29:$VD,31:$VE,32:$VF,36:$VG,37:$VH,40:319,42:318,44:320,46:$VI,47:321,51:$VJ,57:322,60:323,61:$VK},{29:$VD,31:$VE,32:$VF,36:$VG,37:$VH,40:325,42:324,44:326,46:$VI,47:327,51:$VJ,57:328,60:329,61:$VK},o($VO,[2,56]),o($VT,$VU,{42:213,40:214,44:215,47:216,57:217,60:218,59:330,29:$VD,31:$VE,32:$VF,36:$VG,37:$VH,46:$VI,51:$VJ,61:$VK}),{51:[1,331]},{51:[1,332]},{29:$Vg,31:$Vh,32:$Vi,39:55,41:54,69:$Vj,71:$Vk,73:$VA,77:52,79:333,81:142,83:53,84:$Vl,89:50},{73:[1,334]},{136:$Vh1,163:335,164:336},{71:[1,338]},{71:[1,339]},o($VY,[2,219],{104:$Vi1,112:$Vj1,146:[1,341],147:$Vk1,148:$Vl1,149:$Vm1,150:$Vn1,151:$Vo1,153:$Vp1,157:$Vq1}),o($Vg1,[2,254]),o($Vg1,[2,255]),o($Vg1,[2,256]),o($Vg1,[2,257]),{20:351,21:$Vd,22:$Ve,139:350},{29:$VD,31:$VE,32:$VF,40:354,42:353,69:$VX,80:355,82:356,83:181,84:$Vl,154:352},{20:253,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:250,36:$V01,37:$V11,38:251,145:$V21,190:357},{20:253,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:250,36:$V01,37:$V11,38:251,145:$V21,190:358},{20:253,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:250,36:$V01,37:$V11,38:251,145:$V21,190:359},{20:253,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:250,36:$V01,37:$V11,38:251,145:$V21,190:360},{20:253,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:250,36:$V01,37:$V11,38:251,145:$V21,190:361},{20:253,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:250,36:$V01,37:$V11,38:251,145:$V21,190:362},{20:253,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:250,36:$V01,37:$V11,38:251,145:$V21,190:363},{28:365,29:$Vp,30:366,31:$VZ,32:$V_,33:$V$,152:364},{30:367,31:$VZ,32:$V_,33:$V$},{28:369,29:$Vp,30:368,31:$VZ,32:$V_,33:$V$,36:$V01,37:$V11,38:370},o($VP,[2,89]),o($VP,[2,92]),o($VP,[2,95]),o($VP,[2,98]),o($VP,[2,101]),o($VP,[2,104]),o($VP,[2,107]),o($VP,[2,93]),o($VP,[2,96]),o($VP,[2,99]),o($VP,[2,102]),o($VP,[2,105]),o($VP,[2,108]),o($VP,[2,94]),o($VP,[2,97]),o($VP,[2,100]),o($VP,[2,103]),o($VP,[2,106]),o($VP,[2,109]),o($VT,[2,57]),{31:$Vh,32:$Vi,39:372,72:371},{29:$Vg,41:374,76:373},{73:[1,375]},o($Vb,[2,270]),{54:[1,376],73:[2,272]},o($Vr1,[2,274]),{20:377,21:$Vd,22:$Ve},{20:378,21:$Vd,22:$Ve},{73:[1,379]},{20:298,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:295,36:$V01,37:$V11,38:296,142:380,145:$V41},{20:298,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:295,36:$V01,37:$V11,38:296,142:381,145:$V41},{20:298,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:295,36:$V01,37:$V11,38:296,142:382,145:$V41},{20:298,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:295,36:$V01,37:$V11,38:296,142:383,145:$V41},{20:298,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:295,36:$V01,37:$V11,38:296,142:384,145:$V41},{20:298,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:295,36:$V01,37:$V11,38:296,142:385,145:$V41},{20:298,21:$Vd,22:$Ve,28:254,29:$Vp,30:255,31:$VZ,32:$V_,33:$V$,34:295,36:$V01,37:$V11,38:296,142:386,145:$V41},{28:365,29:$Vp,30:366,31:$VZ,32:$V_,33:$V$,152:387},{30:388,31:$VZ,32:$V_,33:$V$},{28:390,29:$Vp,30:389,31:$VZ,32:$V_,33:$V$,36:$V01,37:$V11,38:391},o($V51,[2,218]),{104:[1,392],147:[1,393],148:[1,394],149:[1,395],150:[1,396],151:[1,397],153:[1,398]},o($Vs1,[2,234]),o($Vs1,[2,235]),o($Vs1,[2,236]),o($Vs1,[2,237]),o($Vs1,[2,238]),o([5,6,112,124,126,146],[2,316],{104:$V61,147:$V81,148:$V91,149:$Va1,150:$Vb1,151:$Vc1,153:$Vd1,157:$Ve1}),o([5,6,124,126,146],[2,317],{104:$V61,112:$V71,147:$V81,148:$V91,149:$Va1,150:$Vb1,151:$Vc1,153:$Vd1,157:$Ve1}),o([5,6,104,112,124,126,146,151,153,157],[2,318],{147:$V81,148:$V91,149:$Va1,150:$Vb1}),o($Vf1,[2,319]),o($Vf1,[2,320]),o($Vf1,[2,321]),o($Vf1,[2,322]),o($Vf1,[2,323]),{112:[1,399]},{112:[1,400]},o($Vf1,[2,324]),o($Vf1,[2,325]),o($Vf1,[2,326]),o($Vf1,[2,327]),{53:[1,401],54:[1,402]},o($VT,[2,112]),{53:[1,403],54:[1,404]},o($VT,[2,115]),o($VW,[2,118],{24:[1,405]}),{136:$Vh1,164:406},{165:[1,407],167:[1,408]},{54:[1,410],73:[1,409]},o($Vu,[2,117]),o([5,6,112,124,125,126,146],[2,258],{104:$Vi1,147:$Vk1,148:$Vl1,149:$Vm1,150:$Vn1,151:$Vo1,153:$Vp1,157:$Vq1}),o([5,6,124,125,126,146],[2,259],{104:$Vi1,112:$Vj1,147:$Vk1,148:$Vl1,149:$Vm1,150:$Vn1,151:$Vo1,153:$Vp1,157:$Vq1}),o([5,6,104,112,124,125,126,146,151,153,157],[2,260],{147:$Vk1,148:$Vl1,149:$Vm1,150:$Vn1}),o($Vg1,[2,261]),o($Vg1,[2,262]),o($Vg1,[2,263]),o($Vg1,[2,264]),o($Vg1,[2,265]),o($Vg1,[2,266]),o($Vg1,[2,267]),o($Vg1,[2,268]),o($Vg1,[2,269]),{29:$VD,31:$VE,32:$VF,40:413,42:412,69:$VX,80:414,82:415,83:181,84:$Vl,155:411},{29:$VD,31:$VE,32:$VF,40:413,42:412,69:$VX,80:414,82:415,83:181,84:$Vl,155:416},{29:$VD,31:$VE,32:$VF,40:413,42:412,69:$VX,80:414,82:415,83:181,84:$Vl,155:417},{29:$VD,31:$VE,32:$VF,40:413,42:412,69:$VX,80:414,82:415,83:181,84:$Vl,155:418},{29:$VD,31:$VE,32:$VF,40:413,42:412,69:$VX,80:414,82:415,83:181,84:$Vl,155:419},{29:$VD,31:$VE,32:$VF,40:422,42:421,156:420},{31:$VE,32:$VF,40:423},{28:424,29:$Vp},{30:425,31:$VZ,32:$V_,33:$V$},{73:[1,426]},{31:$Vh,32:$Vi,39:427},{73:[1,428]},{29:$Vg,41:429},{21:[1,430]},o($Vr1,[2,273]),{71:[1,431]},{71:[1,432]},o($Vr1,$Vt1,{168:433,171:$Vu1}),{20:435,21:$Vd,22:$Ve},o($V51,[2,239]),o($V51,[2,246]),o($V51,[2,247]),o($V51,[2,248]),o($V51,[2,249]),o($V51,[2,240]),o($V51,[2,241]),o($V51,[2,242]),o($V51,[2,243]),o($V51,[2,244]),{112:[1,436]},{112:[1,437]},o($V51,[2,245]),o($Vg1,[2,252]),o($Vg1,[2,253]),o($Vv1,[2,110]),o($VT,[2,111]),o($Vv1,[2,113]),o($VT,[2,114]),{71:[1,438]},{20:439,21:$Vd,22:$Ve},{20:440,21:$Vd,22:$Ve},o($Vr1,[2,279]),{28:441,29:$Vp},{73:[1,442]},{29:$VD,42:443},{31:$VE,32:$VF,40:444},{73:[1,445]},{54:[1,447],73:[1,446]},{54:[1,449],73:[1,448]},{28:450,29:$Vp},o($Vr1,$Vt1,{168:451,171:$Vu1}),o($V51,[2,250]),o($V51,[2,251]),o($VW,[2,119]),o($Vr1,$Vw1,{166:452,172:$Vx1}),{20:454,21:$Vd,22:$Ve},o($Vy1,$Vw1,{166:455,172:$Vx1}),{20:456,21:$Vd,22:$Ve},o($Vr1,[2,282]),o($Vr1,[2,280]),o($Vr1,[2,275]),{71:[1,459],129:[1,457],173:[1,458]},{73:[1,460]},o($Vr1,$Vt1,{168:461,171:$Vu1}),{73:[1,462]},o($Vy1,[2,284]),o($Vy1,[2,285]),{20:464,21:$Vd,22:$Ve,174:463},o($Vr1,$Vw1,{166:465,172:$Vx1}),o($Vr1,[2,276]),o($Vy1,$Vw1,{166:466,172:$Vx1}),{54:[1,468],73:[1,467]},o($Vr1,[2,288]),o($Vr1,[2,277]),o($Vr1,$Vt1,{168:469,171:$Vu1}),o($Vy1,[2,286]),{20:470,21:$Vd,22:$Ve},o($Vr1,[2,278]),o($Vr1,[2,287])],
defaultActions: {29:[2,1],34:[2,142],78:[2,22],116:[2,124],117:[2,125],138:[2,290],189:[2,291],190:[2,292],240:[2,289],248:[2,216]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 22
break;
case 1:return 31
break;
case 2:return 32
break;
case 3:/* skip -- comments */
break;
case 4:/* skip whitespace */
break;
case 5:return 'ABORT'
break;
case 6:return 'ADD'
break;
case 7:return 'AFTER'
break;
case 8:return 'ALTER'
break;
case 9:return 'ANALYZE'
break;
case 10:return 112
break;
case 11:return 132
break;
case 12:return 'ASC'
break;
case 13:return 'ATTACH'
break;
case 14:return 'BEFORE'
break;
case 15:return 'BEGIN'
break;
case 16:return 151
break;
case 17:return 'BY'
break;
case 18:return 'CASCADE'
break;
case 19:return 'CASE'
break;
case 20:return 'CAST'
break;
case 21:return 'CHECK'
break;
case 22:return 'COLLATE'
break;
case 23:return 'COLUMN'
break;
case 24:return 'CONFLICT'
break;
case 25:return 126
break;
case 26:return 'CONSTRAINT'
break;
case 27:return 158
break;
case 28:return 'CROSS'
break;
case 29:return 'CURRENT DATE'
break;
case 30:return 'CURRENT TIME'
break;
case 31:return 'CURRENT TIMESTAMP'
break;
case 32:return 'DATABASE'
break;
case 33:return 'DEFAULT'
break;
case 34:return 'DEFERRABLE'
break;
case 35:return 'DEFERRED'
break;
case 36:return 116
break;
case 37:return 125
break;
case 38:return 'DETACH'
break;
case 39:return 128
break;
case 40:return 179
break;
case 41:return 180
break;
case 42:return 'EACH'
break;
case 43:return 'ELSE'
break;
case 44:return 'END'
break;
case 45:return 'ESCAPE'
break;
case 46:return 'EXCEPT'
break;
case 47:return 'EXCLUSIVE'
break;
case 48:return 'EXISTS'
break;
case 49:return 'EXPLAIN'
break;
case 50:return 'FAIL'
break;
case 51:return 'FOR'
break;
case 52:return 'FOREIGN'
break;
case 53:return 117
break;
case 54:return 'FULL'
break;
case 55:return 'GLOB'
break;
case 56:return 'GROUP'
break;
case 57:return 141
break;
case 58:return 'IF'
break;
case 59:return 101
break;
case 60:return 'IMMEDIATE'
break;
case 61:return 'IN'
break;
case 62:return 135
break;
case 63:return 136
break;
case 64:return 'INDEXED'
break;
case 65:return 'INITIALLY'
break;
case 66:return 'INNER'
break;
case 67:return 94
break;
case 68:return 'INSTEAD'
break;
case 69:return 'INTERSECT'
break;
case 70:return 96
break;
case 71:return 'IS'
break;
case 72:return 'ISNULL'
break;
case 73:return 'JOIN'
break;
case 74:return 170
break;
case 75:return 'LEFT'
break;
case 76:return 153
break;
case 77:return 157
break;
case 78:return 124
break;
case 79:return 'MATCH'
break;
case 80:return 'NATURAL'
break;
case 81:return 'NO'
break;
case 82:return 'NOT'
break;
case 83:return 'NOTNULL'
break;
case 84:return 46
break;
case 85:return 49
break;
case 86:return 'OF'
break;
case 87:return 'OFFSET'
break;
case 88:return 181
break;
case 89:return 146
break;
case 90:return 'ORDER'
break;
case 91:return 'OUTER'
break;
case 92:return 'PLAN'
break;
case 93:return 'PRAGMA'
break;
case 94:return 169
break;
case 95:return 'QUERY'
break;
case 96:return 'RAISE'
break;
case 97:return 'RECURSIVE'
break;
case 98:return 'REFERENCES'
break;
case 99:return 'REGEXP'
break;
case 100:return 'REINDEX'
break;
case 101:return 'RELEASE'
break;
case 102:return 'RENAME'
break;
case 103:return 113
break;
case 104:return 'RESTRICT'
break;
case 105:return 'RIGHT'
break;
case 106:return 'ROLLBACK'
break;
case 107:return 'ROW'
break;
case 108:return 143
break;
case 109:return 185
break;
case 110:return 97
break;
case 111:return 159
break;
case 112:return 'TEMP'
break;
case 113:return 'THEN'
break;
case 114:return 'TO'
break;
case 115:return 'TRIGGER'
break;
case 116:return 'UNION'
break;
case 117:return 'UNIQUE'
break;
case 118:return 105
break;
case 119:return 'USING'
break;
case 120:return 'VACUUM'
break;
case 121:return 99
break;
case 122:return 'VIEW'
break;
case 123:return 'WHEN'
break;
case 124:return 107
break;
case 125:return 'WITH'
break;
case 126:return 36
break;
case 127:return 37
break;
case 128:return 177
break;
case 129:return 178
break;
case 130:return 176
break;
case 131:return 29
break;
case 132:return 70
break;
case 133:return 75
break;
case 134:return 'BINARYSET'
break;
case 135:return 171
break;
case 136:return 167
break;
case 137:return 165
break;
case 138:return 172
break;
case 139:return 129
break;
case 140:return 173
break;
case 141:return 69
break;
case 142:return 191
break;
case 143:return 'ALLOCATE'
break;
case 144:return 'ALTER'
break;
case 145:return 'ANALYZE'
break;
case 146:return 112
break;
case 147:return 'ANY'
break;
case 148:return 'ARCHIVE'
break;
case 149:return 'ARE'
break;
case 150:return 'ARRAY'
break;
case 151:return 132
break;
case 152:return 'ASC'
break;
case 153:return 'ASCII'
break;
case 154:return 'ASENSITIVE'
break;
case 155:return 'ASSERTION'
break;
case 156:return 'ASYMMETRIC'
break;
case 157:return 'AT'
break;
case 158:return 'ATOMIC'
break;
case 159:return 'ATTACH'
break;
case 160:return 'ATTRIBUTE'
break;
case 161:return 'AUTH'
break;
case 162:return 'AUTHORIZATION'
break;
case 163:return 'AUTHORIZE'
break;
case 164:return 'AUTO'
break;
case 165:return 'AVG'
break;
case 166:return 'BACK'
break;
case 167:return 'BACKUP'
break;
case 168:return 'BASE'
break;
case 169:return 'BATCH'
break;
case 170:return 'BEFORE'
break;
case 171:return 'BEGIN'
break;
case 172:return 151
break;
case 173:return 'BIGINT'
break;
case 174:return 'BINARY'
break;
case 175:return 'BIT'
break;
case 176:return 'BLOB'
break;
case 177:return 'BLOCK'
break;
case 178:return 'BOOLEAN'
break;
case 179:return 'BOTH'
break;
case 180:return 'BREADTH'
break;
case 181:return 'BUCKET'
break;
case 182:return 'BULK'
break;
case 183:return 'BY'
break;
case 184:return 'BYTE'
break;
case 185:return 'CALL'
break;
case 186:return 'CALLED'
break;
case 187:return 'CALLING'
break;
case 188:return 'CAPACITY'
break;
case 189:return 'CASCADE'
break;
case 190:return 'CASCADED'
break;
case 191:return 'CASE'
break;
case 192:return 'CAST'
break;
case 193:return 'CATALOG'
break;
case 194:return 'CHAR'
break;
case 195:return 'CHARACTER'
break;
case 196:return 'CHECK'
break;
case 197:return 'CLASS'
break;
case 198:return 'CLOB'
break;
case 199:return 'CLOSE'
break;
case 200:return 'CLUSTER'
break;
case 201:return 'CLUSTERED'
break;
case 202:return 'CLUSTERING'
break;
case 203:return 'CLUSTERS'
break;
case 204:return 'COALESCE'
break;
case 205:return 'COLLATE'
break;
case 206:return 'COLLATION'
break;
case 207:return 'COLLECTION'
break;
case 208:return 'COLUMN'
break;
case 209:return 'COLUMNS'
break;
case 210:return 'COMBINE'
break;
case 211:return 'COMMENT'
break;
case 212:return 'COMMIT'
break;
case 213:return 'COMPACT'
break;
case 214:return 'COMPILE'
break;
case 215:return 'COMPRESS'
break;
case 216:return 'CONDITION'
break;
case 217:return 'CONFLICT'
break;
case 218:return 'CONNECT'
break;
case 219:return 'CONNECTION'
break;
case 220:return 'CONSISTENCY'
break;
case 221:return 'CONSISTENT'
break;
case 222:return 'CONSTRAINT'
break;
case 223:return 'CONSTRAINTS'
break;
case 224:return 'CONSTRUCTOR'
break;
case 225:return 'CONSUMED'
break;
case 226:return 'CONTINUE'
break;
case 227:return 'CONVERT'
break;
case 228:return 'COPY'
break;
case 229:return 'CORRESPONDING'
break;
case 230:return 'COUNT'
break;
case 231:return 'COUNTER'
break;
case 232:return 158
break;
case 233:return 'CROSS'
break;
case 234:return 'CUBE'
break;
case 235:return 'CURRENT'
break;
case 236:return 'CURSOR'
break;
case 237:return 'CYCLE'
break;
case 238:return 'DATA'
break;
case 239:return 'DATABASE'
break;
case 240:return 78
break;
case 241:return 'DATETIME'
break;
case 242:return 'DAY'
break;
case 243:return 'DEALLOCATE'
break;
case 244:return 'DEC'
break;
case 245:return 'DECIMAL'
break;
case 246:return 'DECLARE'
break;
case 247:return 'DEFAULT'
break;
case 248:return 'DEFERRABLE'
break;
case 249:return 'DEFERRED'
break;
case 250:return 'DEFINE'
break;
case 251:return 'DEFINED'
break;
case 252:return 'DEFINITION'
break;
case 253:return 116
break;
case 254:return 'DELIMITED'
break;
case 255:return 'DEPTH'
break;
case 256:return 'DEREF'
break;
case 257:return 125
break;
case 258:return 180
break;
case 259:return 'DESCRIPTOR'
break;
case 260:return 'DETACH'
break;
case 261:return 'DETERMINISTIC'
break;
case 262:return 'DIAGNOSTICS'
break;
case 263:return 'DIRECTORIES'
break;
case 264:return 'DISABLE'
break;
case 265:return 'DISCONNECT'
break;
case 266:return 128
break;
case 267:return 'DISTRIBUTE'
break;
case 268:return 'DO'
break;
case 269:return 'DOMAIN'
break;
case 270:return 'DOUBLE'
break;
case 271:return 179
break;
case 272:return 'DUMP'
break;
case 273:return 'DURATION'
break;
case 274:return 'DYNAMIC'
break;
case 275:return 'EACH'
break;
case 276:return 'ELEMENT'
break;
case 277:return 'ELSE'
break;
case 278:return 'ELSEIF'
break;
case 279:return 'EMPTY'
break;
case 280:return 'ENABLE'
break;
case 281:return 'END'
break;
case 282:return 'EQUAL'
break;
case 283:return 'EQUALS'
break;
case 284:return 'ERROR'
break;
case 285:return 'ESCAPE'
break;
case 286:return 'ESCAPED'
break;
case 287:return 'EVAL'
break;
case 288:return 'EVALUATE'
break;
case 289:return 'EXCEEDED'
break;
case 290:return 'EXCEPT'
break;
case 291:return 'EXCEPTION'
break;
case 292:return 'EXCEPTIONS'
break;
case 293:return 'EXCLUSIVE'
break;
case 294:return 'EXEC'
break;
case 295:return 'EXECUTE'
break;
case 296:return 'EXISTS'
break;
case 297:return 'EXIT'
break;
case 298:return 'EXPLAIN'
break;
case 299:return 'EXPLODE'
break;
case 300:return 'EXPORT'
break;
case 301:return 'EXPRESSION'
break;
case 302:return 'EXTENDED'
break;
case 303:return 'EXTERNAL'
break;
case 304:return 'EXTRACT'
break;
case 305:return 'FAIL'
break;
case 306:return 37
break;
case 307:return 'FAMILY'
break;
case 308:return 'FETCH'
break;
case 309:return 'FIELDS'
break;
case 310:return 'FILE'
break;
case 311:return 'FILTER'
break;
case 312:return 'FILTERING'
break;
case 313:return 'FINAL'
break;
case 314:return 'FINISH'
break;
case 315:return 'FIRST'
break;
case 316:return 'FIXED'
break;
case 317:return 'FLATTERN'
break;
case 318:return 'FLOAT'
break;
case 319:return 'FOR'
break;
case 320:return 'FORCE'
break;
case 321:return 'FOREIGN'
break;
case 322:return 'FORMAT'
break;
case 323:return 'FORWARD'
break;
case 324:return 'FOUND'
break;
case 325:return 'FREE'
break;
case 326:return 117
break;
case 327:return 'FULL'
break;
case 328:return 'FUNCTION'
break;
case 329:return 'FUNCTIONS'
break;
case 330:return 'GENERAL'
break;
case 331:return 'GENERATE'
break;
case 332:return 'GET'
break;
case 333:return 'GLOB'
break;
case 334:return 'GLOBAL'
break;
case 335:return 'GO'
break;
case 336:return 'GOTO'
break;
case 337:return 'GRANT'
break;
case 338:return 'GREATER'
break;
case 339:return 'GROUP'
break;
case 340:return 'GROUPING'
break;
case 341:return 'HANDLER'
break;
case 342:return 'HASH'
break;
case 343:return 'HAVE'
break;
case 344:return 141
break;
case 345:return 'HEAP'
break;
case 346:return 'HIDDEN'
break;
case 347:return 'HOLD'
break;
case 348:return 'HOUR'
break;
case 349:return 'IDENTIFIED'
break;
case 350:return 'IDENTITY'
break;
case 351:return 'IF'
break;
case 352:return 101
break;
case 353:return 'IMMEDIATE'
break;
case 354:return 'IMPORT'
break;
case 355:return 'IN'
break;
case 356:return 'INCLUDING'
break;
case 357:return 'INCLUSIVE'
break;
case 358:return 'INCREMENT'
break;
case 359:return 'INCREMENTAL'
break;
case 360:return 136
break;
case 361:return 'INDEXED'
break;
case 362:return 'INDEXES'
break;
case 363:return 'INDICATOR'
break;
case 364:return 'INFINITE'
break;
case 365:return 'INITIALLY'
break;
case 366:return 'INLINE'
break;
case 367:return 'INNER'
break;
case 368:return 'INNTER'
break;
case 369:return 'INOUT'
break;
case 370:return 'INPUT'
break;
case 371:return 'INSENSITIVE'
break;
case 372:return 94
break;
case 373:return 'INSTEAD'
break;
case 374:return 'INT'
break;
case 375:return 'INTEGER'
break;
case 376:return 'INTERSECT'
break;
case 377:return 'INTERVAL'
break;
case 378:return 96
break;
case 379:return 'INVALIDATE'
break;
case 380:return 'IS'
break;
case 381:return 'ISOLATION'
break;
case 382:return 'ITEM'
break;
case 383:return 'ITEMS'
break;
case 384:return 'ITERATE'
break;
case 385:return 'JOIN'
break;
case 386:return 170
break;
case 387:return 'KEYS'
break;
case 388:return 'LAG'
break;
case 389:return 'LANGUAGE'
break;
case 390:return 'LARGE'
break;
case 391:return 'LAST'
break;
case 392:return 'LATERAL'
break;
case 393:return 'LEAD'
break;
case 394:return 'LEADING'
break;
case 395:return 'LEAVE'
break;
case 396:return 'LEFT'
break;
case 397:return 'LENGTH'
break;
case 398:return 'LESS'
break;
case 399:return 'LEVEL'
break;
case 400:return 153
break;
case 401:return 124
break;
case 402:return 'LIMITED'
break;
case 403:return 'LINES'
break;
case 404:return 'LIST'
break;
case 405:return 'LOAD'
break;
case 406:return 'LOCAL'
break;
case 407:return 'LOCALTIME'
break;
case 408:return 'LOCALTIMESTAMP'
break;
case 409:return 'LOCATION'
break;
case 410:return 'LOCATOR'
break;
case 411:return 'LOCK'
break;
case 412:return 'LOCKS'
break;
case 413:return 'LOG'
break;
case 414:return 'LOGED'
break;
case 415:return 'LONG'
break;
case 416:return 'LOOP'
break;
case 417:return 'LOWER'
break;
case 418:return 'MAP'
break;
case 419:return 'MATCH'
break;
case 420:return 'MATERIALIZED'
break;
case 421:return 'MAX'
break;
case 422:return 'MAXLEN'
break;
case 423:return 'MEMBER'
break;
case 424:return 'MERGE'
break;
case 425:return 'METHOD'
break;
case 426:return 'METRICS'
break;
case 427:return 'MIN'
break;
case 428:return 91
break;
case 429:return 'MINUTE'
break;
case 430:return 'MISSING'
break;
case 431:return 'MOD'
break;
case 432:return 'MODE'
break;
case 433:return 'MODIFIES'
break;
case 434:return 'MODIFY'
break;
case 435:return 'MODULE'
break;
case 436:return 'MONTH'
break;
case 437:return 'MULTI'
break;
case 438:return 'MULTISET'
break;
case 439:return 'NAME'
break;
case 440:return 'NAMES'
break;
case 441:return 'NATIONAL'
break;
case 442:return 'NATURAL'
break;
case 443:return 'NCHAR'
break;
case 444:return 'NCLOB'
break;
case 445:return 69
break;
case 446:return 'NEXT'
break;
case 447:return 'NO'
break;
case 448:return 'NONE'
break;
case 449:return 'NOT'
break;
case 450:return 46
break;
case 451:return 'NULLIF'
break;
case 452:return 29
break;
case 453:return 'NUMERIC'
break;
case 454:return 'OBJECT'
break;
case 455:return 'OF'
break;
case 456:return 'OFFLINE'
break;
case 457:return 'OFFSET'
break;
case 458:return 'OLD'
break;
case 459:return 181
break;
case 460:return 'ONLINE'
break;
case 461:return 'ONLY'
break;
case 462:return 'OPAQUE'
break;
case 463:return 'OPEN'
break;
case 464:return 'OPERATOR'
break;
case 465:return 'OPTION'
break;
case 466:return 146
break;
case 467:return 'ORDER'
break;
case 468:return 'ORDINALITY'
break;
case 469:return 'OTHER'
break;
case 470:return 'OTHERS'
break;
case 471:return 'OUT'
break;
case 472:return 'OUTER'
break;
case 473:return 'OUTPUT'
break;
case 474:return 'OVER'
break;
case 475:return 'OVERLAPS'
break;
case 476:return 'OVERRIDE'
break;
case 477:return 'OWNER'
break;
case 478:return 'PAD'
break;
case 479:return 'PARALLEL'
break;
case 480:return 'PARAMETER'
break;
case 481:return 'PARAMETERS'
break;
case 482:return 'PARTIAL'
break;
case 483:return 'PARTITION'
break;
case 484:return 'PARTITIONED'
break;
case 485:return 'PARTITIONS'
break;
case 486:return 'PATH'
break;
case 487:return 'PERCENT'
break;
case 488:return 'PERCENTILE'
break;
case 489:return 'PERMISSION'
break;
case 490:return 'PERMISSIONS'
break;
case 491:return 'PIPE'
break;
case 492:return 'PIPELINED'
break;
case 493:return 'PLAN'
break;
case 494:return 'POOL'
break;
case 495:return 'POSITION'
break;
case 496:return 'PRECISION'
break;
case 497:return 'PREPARE'
break;
case 498:return 'PRESERVE'
break;
case 499:return 169
break;
case 500:return 'PRIOR'
break;
case 501:return 'PRIVATE'
break;
case 502:return 'PRIVILEGES'
break;
case 503:return 'PROCEDURE'
break;
case 504:return 'PROCESSED'
break;
case 505:return 'PROJECT'
break;
case 506:return 172
break;
case 507:return 'PROPERTY'
break;
case 508:return 'PROVISIONING'
break;
case 509:return 'PUBLIC'
break;
case 510:return 'PUT'
break;
case 511:return 'QUERY'
break;
case 512:return 'QUIT'
break;
case 513:return 'QUORUM'
break;
case 514:return 'RAISE'
break;
case 515:return 87
break;
case 516:return 'RANGE'
break;
case 517:return 'RANK'
break;
case 518:return 'RAW'
break;
case 519:return 'READ'
break;
case 520:return 'READS'
break;
case 521:return 'REAL'
break;
case 522:return 'REBUILD'
break;
case 523:return 'RECORD'
break;
case 524:return 'RECURSIVE'
break;
case 525:return 'REDUCE'
break;
case 526:return 'REF'
break;
case 527:return 'REFERENCE'
break;
case 528:return 'REFERENCES'
break;
case 529:return 'REFERENCING'
break;
case 530:return 'REGEXP'
break;
case 531:return 'REGION'
break;
case 532:return 'REINDEX'
break;
case 533:return 'RELATIVE'
break;
case 534:return 'RELEASE'
break;
case 535:return 'REMAINDER'
break;
case 536:return 'RENAME'
break;
case 537:return 'REPEAT'
break;
case 538:return 113
break;
case 539:return 'REQUEST'
break;
case 540:return 'RESET'
break;
case 541:return 'RESIGNAL'
break;
case 542:return 'RESOURCE'
break;
case 543:return 'RESPONSE'
break;
case 544:return 'RESTORE'
break;
case 545:return 'RESTRICT'
break;
case 546:return 'RESULT'
break;
case 547:return 'RETURN'
break;
case 548:return 'RETURNING'
break;
case 549:return 'RETURNS'
break;
case 550:return 'REVERSE'
break;
case 551:return 'REVOKE'
break;
case 552:return 'RIGHT'
break;
case 553:return 'ROLE'
break;
case 554:return 'ROLES'
break;
case 555:return 'ROLLBACK'
break;
case 556:return 'ROLLUP'
break;
case 557:return 'ROUTINE'
break;
case 558:return 'ROW'
break;
case 559:return 'ROWS'
break;
case 560:return 'RULE'
break;
case 561:return 'RULES'
break;
case 562:return 'SAMPLE'
break;
case 563:return 'SATISFIES'
break;
case 564:return 'SAVE'
break;
case 565:return 'SAVEPOINT'
break;
case 566:return 185
break;
case 567:return 'SCHEMA'
break;
case 568:return 'SCOPE'
break;
case 569:return 'SCROLL'
break;
case 570:return 'SEARCH'
break;
case 571:return 'SECOND'
break;
case 572:return 'SECTION'
break;
case 573:return 'SEGMENT'
break;
case 574:return 'SEGMENTS'
break;
case 575:return 143
break;
case 576:return 'SELF'
break;
case 577:return 'SEMI'
break;
case 578:return 'SENSITIVE'
break;
case 579:return 'SEPARATE'
break;
case 580:return 'SEQUENCE'
break;
case 581:return 'SERIALIZABLE'
break;
case 582:return 'SESSION'
break;
case 583:return 97
break;
case 584:return 'SETS'
break;
case 585:return 'SHARD'
break;
case 586:return 'SHARE'
break;
case 587:return 'SHARED'
break;
case 588:return 'SHORT'
break;
case 589:return 177
break;
case 590:return 'SIGNAL'
break;
case 591:return 'SIMILAR'
break;
case 592:return 'SIZE'
break;
case 593:return 'SKEWED'
break;
case 594:return 'SMALLINT'
break;
case 595:return 'SNAPSHOT'
break;
case 596:return 'SOME'
break;
case 597:return 'SOURCE'
break;
case 598:return 'SPACE'
break;
case 599:return 'SPACES'
break;
case 600:return 'SPARSE'
break;
case 601:return 'SPECIFIC'
break;
case 602:return 'SPECIFICTYPE'
break;
case 603:return 'SPLIT'
break;
case 604:return 'SQL'
break;
case 605:return 'SQLCODE'
break;
case 606:return 'SQLERROR'
break;
case 607:return 'SQLEXCEPTION'
break;
case 608:return 'SQLSTATE'
break;
case 609:return 'SQLWARNING'
break;
case 610:return 'START'
break;
case 611:return 'STATE'
break;
case 612:return 'STATIC'
break;
case 613:return 'STATUS'
break;
case 614:return 'STORAGE'
break;
case 615:return 'STORE'
break;
case 616:return 'STORED'
break;
case 617:return 'STREAM'
break;
case 618:return 176
break;
case 619:return 'STRUCT'
break;
case 620:return 'STYLE'
break;
case 621:return 'SUB'
break;
case 622:return 'SUBMULTISET'
break;
case 623:return 'SUBPARTITION'
break;
case 624:return 'SUBSTRING'
break;
case 625:return 'SUBTYPE'
break;
case 626:return 'SUM'
break;
case 627:return 'SUPER'
break;
case 628:return 'SYMMETRIC'
break;
case 629:return 'SYNONYM'
break;
case 630:return 'SYSTEM'
break;
case 631:return 159
break;
case 632:return 'TABLESAMPLE'
break;
case 633:return 'TEMP'
break;
case 634:return 'TEMPORARY'
break;
case 635:return 'TERMINATED'
break;
case 636:return 'TEXT'
break;
case 637:return 'THAN'
break;
case 638:return 'THEN'
break;
case 639:return 171
break;
case 640:return 'TIME'
break;
case 641:return 'TIMESTAMP'
break;
case 642:return 'TIMEZONE'
break;
case 643:return 'TINYINT'
break;
case 644:return 'TO'
break;
case 645:return 'TOKEN'
break;
case 646:return 'TOTAL'
break;
case 647:return 'TOUCH'
break;
case 648:return 'TRAILING'
break;
case 649:return 'TRANSACTION'
break;
case 650:return 'TRANSFORM'
break;
case 651:return 'TRANSLATE'
break;
case 652:return 'TRANSLATION'
break;
case 653:return 'TREAT'
break;
case 654:return 'TRIGGER'
break;
case 655:return 'TRIM'
break;
case 656:return 36
break;
case 657:return 'TRUNCATE'
break;
case 658:return 'TTL'
break;
case 659:return 'TUPLE'
break;
case 660:return 'TYPE'
break;
case 661:return 'UNDER'
break;
case 662:return 'UNDO'
break;
case 663:return 'UNION'
break;
case 664:return 'UNIQUE'
break;
case 665:return 'UNIT'
break;
case 666:return 'UNKNOWN'
break;
case 667:return 'UNLOGGED'
break;
case 668:return 'UNNEST'
break;
case 669:return 'UNPROCESSED'
break;
case 670:return 'UNSIGNED'
break;
case 671:return 'UNTIL'
break;
case 672:return 105
break;
case 673:return 'UPPER'
break;
case 674:return 'URL'
break;
case 675:return 'USAGE'
break;
case 676:return 135
break;
case 677:return 'USER'
break;
case 678:return 'USERS'
break;
case 679:return 'USING'
break;
case 680:return 'UUID'
break;
case 681:return 'VACUUM'
break;
case 682:return 'VALUE'
break;
case 683:return 'VALUED'
break;
case 684:return 99
break;
case 685:return 'VARCHAR'
break;
case 686:return 'VARIABLE'
break;
case 687:return 'VARIANCE'
break;
case 688:return 'VARINT'
break;
case 689:return 'VARYING'
break;
case 690:return 'VIEW'
break;
case 691:return 'VIEWS'
break;
case 692:return 'VIRTUAL'
break;
case 693:return 'VOID'
break;
case 694:return 'WAIT'
break;
case 695:return 'WHEN'
break;
case 696:return 'WHENEVER'
break;
case 697:return 107
break;
case 698:return 'WHILE'
break;
case 699:return 'WINDOW'
break;
case 700:return 'WITH'
break;
case 701:return 'WITHIN'
break;
case 702:return 'WITHOUT'
break;
case 703:return 'WORK'
break;
case 704:return 'WRAPPED'
break;
case 705:return 'WRITE'
break;
case 706:return 'YEAR'
break;
case 707:return 'ZONE'
break;
case 708:return 'JSON'
break;
case 709:return 84
break;
case 710:return 29
break;
case 711:return 29
break;
case 712:return 'TILDEs'
break;
case 713:return 110
break;
case 714:return 90
break;
case 715:return 91
break;
case 716:return 92
break;
case 717:return 93
break;
case 718:return 'REM'
break;
case 719:return 'RSHIFT'
break;
case 720:return 'LSHIFT'
break;
case 721:return 'NE'
break;
case 722:return 'NE'
break;
case 723:return 148
break;
case 724:return 147
break;
case 725:return 150
break;
case 726:return 149
break;
case 727:return 104
break;
case 728:return 'BITAND'
break;
case 729:return 'BITOR'
break;
case 730:return 71
break;
case 731:return 73
break;
case 732:return 61
break;
case 733:return 63
break;
case 734:return 51
break;
case 735:return 53
break;
case 736:return 24
break;
case 737:return 54
break;
case 738:return 65
break;
case 739:return 6
break;
case 740:return 'DOLLAR'
break;
case 741:return 'QUESTION'
break;
case 742:return 'CARET'
break;
case 743:return 21
break;
case 744:return 5
break;
case 745:return 'INVALID'
break;
}
},
rules: [/^(?:([`](\\.|[^"]|\\")*?[`])+)/i,/^(?:(['](\\.|[^']|\\')*?['])+)/i,/^(?:(["](\\.|[^"]|\\")*?["])+)/i,/^(?:--(.*?)($|\r\n|\r|\n))/i,/^(?:\s+)/i,/^(?:ABORT\b)/i,/^(?:ADD\b)/i,/^(?:AFTER\b)/i,/^(?:ALTER\b)/i,/^(?:ANALYZE\b)/i,/^(?:AND\b)/i,/^(?:AS\b)/i,/^(?:ASC\b)/i,/^(?:ATTACH\b)/i,/^(?:BEFORE\b)/i,/^(?:BEGIN\b)/i,/^(?:BETWEEN\b)/i,/^(?:BY\b)/i,/^(?:CASCADE\b)/i,/^(?:CASE\b)/i,/^(?:CAST\b)/i,/^(?:CHECK\b)/i,/^(?:COLLATE\b)/i,/^(?:COLUMN\b)/i,/^(?:CONFLICT\b)/i,/^(?:CONSISTENT_READ\b)/i,/^(?:CONSTRAINT\b)/i,/^(?:CREATE\b)/i,/^(?:CROSS\b)/i,/^(?:CURRENT_DATE\b)/i,/^(?:CURRENT_TIME\b)/i,/^(?:CURRENT_TIMESTAMP\b)/i,/^(?:DATABASE\b)/i,/^(?:DEFAULT\b)/i,/^(?:DEFERRABLE\b)/i,/^(?:DEFERRED\b)/i,/^(?:DELETE\b)/i,/^(?:DESC\b)/i,/^(?:DETACH\b)/i,/^(?:DISTINCT\b)/i,/^(?:DROP\b)/i,/^(?:DESCRIBE\b)/i,/^(?:EACH\b)/i,/^(?:ELSE\b)/i,/^(?:END\b)/i,/^(?:ESCAPE\b)/i,/^(?:EXCEPT\b)/i,/^(?:EXCLUSIVE\b)/i,/^(?:EXISTS\b)/i,/^(?:EXPLAIN\b)/i,/^(?:FAIL\b)/i,/^(?:FOR\b)/i,/^(?:FOREIGN\b)/i,/^(?:FROM\b)/i,/^(?:FULL\b)/i,/^(?:GLOB\b)/i,/^(?:GROUP\b)/i,/^(?:HAVING\b)/i,/^(?:IF\b)/i,/^(?:IGNORE\b)/i,/^(?:IMMEDIATE\b)/i,/^(?:IN\b)/i,/^(?:USE\b)/i,/^(?:INDEX\b)/i,/^(?:INDEXED\b)/i,/^(?:INITIALLY\b)/i,/^(?:INNER\b)/i,/^(?:INSERT\b)/i,/^(?:INSTEAD\b)/i,/^(?:INTERSECT\b)/i,/^(?:INTO\b)/i,/^(?:IS\b)/i,/^(?:ISNULL\b)/i,/^(?:JOIN\b)/i,/^(?:KEY\b)/i,/^(?:LEFT\b)/i,/^(?:LIKE\b)/i,/^(?:CONTAINS\b)/i,/^(?:LIMIT\b)/i,/^(?:MATCH\b)/i,/^(?:NATURAL\b)/i,/^(?:NO\b)/i,/^(?:NOT\b)/i,/^(?:NOTNULL\b)/i,/^(?:NULL\b)/i,/^(?:UNDEFINED\b)/i,/^(?:OF\b)/i,/^(?:OFFSET\b)/i,/^(?:ON\b)/i,/^(?:OR\b)/i,/^(?:ORDER\b)/i,/^(?:OUTER\b)/i,/^(?:PLAN\b)/i,/^(?:PRAGMA\b)/i,/^(?:PRIMARY\b)/i,/^(?:QUERY\b)/i,/^(?:RAISE\b)/i,/^(?:RECURSIVE\b)/i,/^(?:REFERENCES\b)/i,/^(?:REGEXP\b)/i,/^(?:REINDEX\b)/i,/^(?:RELEASE\b)/i,/^(?:RENAME\b)/i,/^(?:REPLACE\b)/i,/^(?:RESTRICT\b)/i,/^(?:RIGHT\b)/i,/^(?:ROLLBACK\b)/i,/^(?:ROW\b)/i,/^(?:SELECT\b)/i,/^(?:SCAN\b)/i,/^(?:SET\b)/i,/^(?:TABLE\b)/i,/^(?:TEMP\b)/i,/^(?:THEN\b)/i,/^(?:TO\b)/i,/^(?:TRIGGER\b)/i,/^(?:UNION\b)/i,/^(?:UNIQUE\b)/i,/^(?:UPDATE\b)/i,/^(?:USING\b)/i,/^(?:VACUUM\b)/i,/^(?:VALUES\b)/i,/^(?:VIEW\b)/i,/^(?:WHEN\b)/i,/^(?:WHERE\b)/i,/^(?:WITH\b)/i,/^(?:TRUE\b)/i,/^(?:FALSE\b)/i,/^(?:SHOW\b)/i,/^(?:TABLES\b)/i,/^(?:STRING\b)/i,/^(?:NUMBER\b)/i,/^(?:STRINGSET\b)/i,/^(?:NUMBERSET\b)/i,/^(?:BINARYSET\b)/i,/^(?:THROUGHPUT\b)/i,/^(?:GSI\b)/i,/^(?:LSI\b)/i,/^(?:PROJECTION\b)/i,/^(?:ALL\b)/i,/^(?:KEYS_ONLY\b)/i,/^(?:NEW\b)/i,/^(?:DEBUG\b)/i,/^(?:ALLOCATE\b)/i,/^(?:ALTER\b)/i,/^(?:ANALYZE\b)/i,/^(?:AND\b)/i,/^(?:ANY\b)/i,/^(?:ARCHIVE\b)/i,/^(?:ARE\b)/i,/^(?:ARRAY\b)/i,/^(?:AS\b)/i,/^(?:ASC\b)/i,/^(?:ASCII\b)/i,/^(?:ASENSITIVE\b)/i,/^(?:ASSERTION\b)/i,/^(?:ASYMMETRIC\b)/i,/^(?:AT\b)/i,/^(?:ATOMIC\b)/i,/^(?:ATTACH\b)/i,/^(?:ATTRIBUTE\b)/i,/^(?:AUTH\b)/i,/^(?:AUTHORIZATION\b)/i,/^(?:AUTHORIZE\b)/i,/^(?:AUTO\b)/i,/^(?:AVG\b)/i,/^(?:BACK\b)/i,/^(?:BACKUP\b)/i,/^(?:BASE\b)/i,/^(?:BATCH\b)/i,/^(?:BEFORE\b)/i,/^(?:BEGIN\b)/i,/^(?:BETWEEN\b)/i,/^(?:BIGINT\b)/i,/^(?:BINARY\b)/i,/^(?:BIT\b)/i,/^(?:BLOB\b)/i,/^(?:BLOCK\b)/i,/^(?:BOOLEAN\b)/i,/^(?:BOTH\b)/i,/^(?:BREADTH\b)/i,/^(?:BUCKET\b)/i,/^(?:BULK\b)/i,/^(?:BY\b)/i,/^(?:BYTE\b)/i,/^(?:CALL\b)/i,/^(?:CALLED\b)/i,/^(?:CALLING\b)/i,/^(?:CAPACITY\b)/i,/^(?:CASCADE\b)/i,/^(?:CASCADED\b)/i,/^(?:CASE\b)/i,/^(?:CAST\b)/i,/^(?:CATALOG\b)/i,/^(?:CHAR\b)/i,/^(?:CHARACTER\b)/i,/^(?:CHECK\b)/i,/^(?:CLASS\b)/i,/^(?:CLOB\b)/i,/^(?:CLOSE\b)/i,/^(?:CLUSTER\b)/i,/^(?:CLUSTERED\b)/i,/^(?:CLUSTERING\b)/i,/^(?:CLUSTERS\b)/i,/^(?:COALESCE\b)/i,/^(?:COLLATE\b)/i,/^(?:COLLATION\b)/i,/^(?:COLLECTION\b)/i,/^(?:COLUMN\b)/i,/^(?:COLUMNS\b)/i,/^(?:COMBINE\b)/i,/^(?:COMMENT\b)/i,/^(?:COMMIT\b)/i,/^(?:COMPACT\b)/i,/^(?:COMPILE\b)/i,/^(?:COMPRESS\b)/i,/^(?:CONDITION\b)/i,/^(?:CONFLICT\b)/i,/^(?:CONNECT\b)/i,/^(?:CONNECTION\b)/i,/^(?:CONSISTENCY\b)/i,/^(?:CONSISTENT\b)/i,/^(?:CONSTRAINT\b)/i,/^(?:CONSTRAINTS\b)/i,/^(?:CONSTRUCTOR\b)/i,/^(?:CONSUMED\b)/i,/^(?:CONTINUE\b)/i,/^(?:CONVERT\b)/i,/^(?:COPY\b)/i,/^(?:CORRESPONDING\b)/i,/^(?:COUNT\b)/i,/^(?:COUNTER\b)/i,/^(?:CREATE\b)/i,/^(?:CROSS\b)/i,/^(?:CUBE\b)/i,/^(?:CURRENT\b)/i,/^(?:CURSOR\b)/i,/^(?:CYCLE\b)/i,/^(?:DATA\b)/i,/^(?:DATABASE\b)/i,/^(?:DATE\b)/i,/^(?:DATETIME\b)/i,/^(?:DAY\b)/i,/^(?:DEALLOCATE\b)/i,/^(?:DEC\b)/i,/^(?:DECIMAL\b)/i,/^(?:DECLARE\b)/i,/^(?:DEFAULT\b)/i,/^(?:DEFERRABLE\b)/i,/^(?:DEFERRED\b)/i,/^(?:DEFINE\b)/i,/^(?:DEFINED\b)/i,/^(?:DEFINITION\b)/i,/^(?:DELETE\b)/i,/^(?:DELIMITED\b)/i,/^(?:DEPTH\b)/i,/^(?:DEREF\b)/i,/^(?:DESC\b)/i,/^(?:DESCRIBE\b)/i,/^(?:DESCRIPTOR\b)/i,/^(?:DETACH\b)/i,/^(?:DETERMINISTIC\b)/i,/^(?:DIAGNOSTICS\b)/i,/^(?:DIRECTORIES\b)/i,/^(?:DISABLE\b)/i,/^(?:DISCONNECT\b)/i,/^(?:DISTINCT\b)/i,/^(?:DISTRIBUTE\b)/i,/^(?:DO\b)/i,/^(?:DOMAIN\b)/i,/^(?:DOUBLE\b)/i,/^(?:DROP\b)/i,/^(?:DUMP\b)/i,/^(?:DURATION\b)/i,/^(?:DYNAMIC\b)/i,/^(?:EACH\b)/i,/^(?:ELEMENT\b)/i,/^(?:ELSE\b)/i,/^(?:ELSEIF\b)/i,/^(?:EMPTY\b)/i,/^(?:ENABLE\b)/i,/^(?:END\b)/i,/^(?:EQUAL\b)/i,/^(?:EQUALS\b)/i,/^(?:ERROR\b)/i,/^(?:ESCAPE\b)/i,/^(?:ESCAPED\b)/i,/^(?:EVAL\b)/i,/^(?:EVALUATE\b)/i,/^(?:EXCEEDED\b)/i,/^(?:EXCEPT\b)/i,/^(?:EXCEPTION\b)/i,/^(?:EXCEPTIONS\b)/i,/^(?:EXCLUSIVE\b)/i,/^(?:EXEC\b)/i,/^(?:EXECUTE\b)/i,/^(?:EXISTS\b)/i,/^(?:EXIT\b)/i,/^(?:EXPLAIN\b)/i,/^(?:EXPLODE\b)/i,/^(?:EXPORT\b)/i,/^(?:EXPRESSION\b)/i,/^(?:EXTENDED\b)/i,/^(?:EXTERNAL\b)/i,/^(?:EXTRACT\b)/i,/^(?:FAIL\b)/i,/^(?:FALSE\b)/i,/^(?:FAMILY\b)/i,/^(?:FETCH\b)/i,/^(?:FIELDS\b)/i,/^(?:FILE\b)/i,/^(?:FILTER\b)/i,/^(?:FILTERING\b)/i,/^(?:FINAL\b)/i,/^(?:FINISH\b)/i,/^(?:FIRST\b)/i,/^(?:FIXED\b)/i,/^(?:FLATTERN\b)/i,/^(?:FLOAT\b)/i,/^(?:FOR\b)/i,/^(?:FORCE\b)/i,/^(?:FOREIGN\b)/i,/^(?:FORMAT\b)/i,/^(?:FORWARD\b)/i,/^(?:FOUND\b)/i,/^(?:FREE\b)/i,/^(?:FROM\b)/i,/^(?:FULL\b)/i,/^(?:FUNCTION\b)/i,/^(?:FUNCTIONS\b)/i,/^(?:GENERAL\b)/i,/^(?:GENERATE\b)/i,/^(?:GET\b)/i,/^(?:GLOB\b)/i,/^(?:GLOBAL\b)/i,/^(?:GO\b)/i,/^(?:GOTO\b)/i,/^(?:GRANT\b)/i,/^(?:GREATER\b)/i,/^(?:GROUP\b)/i,/^(?:GROUPING\b)/i,/^(?:HANDLER\b)/i,/^(?:HASH\b)/i,/^(?:HAVE\b)/i,/^(?:HAVING\b)/i,/^(?:HEAP\b)/i,/^(?:HIDDEN\b)/i,/^(?:HOLD\b)/i,/^(?:HOUR\b)/i,/^(?:IDENTIFIED\b)/i,/^(?:IDENTITY\b)/i,/^(?:IF\b)/i,/^(?:IGNORE\b)/i,/^(?:IMMEDIATE\b)/i,/^(?:IMPORT\b)/i,/^(?:IN\b)/i,/^(?:INCLUDING\b)/i,/^(?:INCLUSIVE\b)/i,/^(?:INCREMENT\b)/i,/^(?:INCREMENTAL\b)/i,/^(?:INDEX\b)/i,/^(?:INDEXED\b)/i,/^(?:INDEXES\b)/i,/^(?:INDICATOR\b)/i,/^(?:INFINITE\b)/i,/^(?:INITIALLY\b)/i,/^(?:INLINE\b)/i,/^(?:INNER\b)/i,/^(?:INNTER\b)/i,/^(?:INOUT\b)/i,/^(?:INPUT\b)/i,/^(?:INSENSITIVE\b)/i,/^(?:INSERT\b)/i,/^(?:INSTEAD\b)/i,/^(?:INT\b)/i,/^(?:INTEGER\b)/i,/^(?:INTERSECT\b)/i,/^(?:INTERVAL\b)/i,/^(?:INTO\b)/i,/^(?:INVALIDATE\b)/i,/^(?:IS\b)/i,/^(?:ISOLATION\b)/i,/^(?:ITEM\b)/i,/^(?:ITEMS\b)/i,/^(?:ITERATE\b)/i,/^(?:JOIN\b)/i,/^(?:KEY\b)/i,/^(?:KEYS\b)/i,/^(?:LAG\b)/i,/^(?:LANGUAGE\b)/i,/^(?:LARGE\b)/i,/^(?:LAST\b)/i,/^(?:LATERAL\b)/i,/^(?:LEAD\b)/i,/^(?:LEADING\b)/i,/^(?:LEAVE\b)/i,/^(?:LEFT\b)/i,/^(?:LENGTH\b)/i,/^(?:LESS\b)/i,/^(?:LEVEL\b)/i,/^(?:LIKE\b)/i,/^(?:LIMIT\b)/i,/^(?:LIMITED\b)/i,/^(?:LINES\b)/i,/^(?:LIST\b)/i,/^(?:LOAD\b)/i,/^(?:LOCAL\b)/i,/^(?:LOCALTIME\b)/i,/^(?:LOCALTIMESTAMP\b)/i,/^(?:LOCATION\b)/i,/^(?:LOCATOR\b)/i,/^(?:LOCK\b)/i,/^(?:LOCKS\b)/i,/^(?:LOG\b)/i,/^(?:LOGED\b)/i,/^(?:LONG\b)/i,/^(?:LOOP\b)/i,/^(?:LOWER\b)/i,/^(?:MAP\b)/i,/^(?:MATCH\b)/i,/^(?:MATERIALIZED\b)/i,/^(?:MAX\b)/i,/^(?:MAXLEN\b)/i,/^(?:MEMBER\b)/i,/^(?:MERGE\b)/i,/^(?:METHOD\b)/i,/^(?:METRICS\b)/i,/^(?:MIN\b)/i,/^(?:MINUS\b)/i,/^(?:MINUTE\b)/i,/^(?:MISSING\b)/i,/^(?:MOD\b)/i,/^(?:MODE\b)/i,/^(?:MODIFIES\b)/i,/^(?:MODIFY\b)/i,/^(?:MODULE\b)/i,/^(?:MONTH\b)/i,/^(?:MULTI\b)/i,/^(?:MULTISET\b)/i,/^(?:NAME\b)/i,/^(?:NAMES\b)/i,/^(?:NATIONAL\b)/i,/^(?:NATURAL\b)/i,/^(?:NCHAR\b)/i,/^(?:NCLOB\b)/i,/^(?:NEW\b)/i,/^(?:NEXT\b)/i,/^(?:NO\b)/i,/^(?:NONE\b)/i,/^(?:NOT\b)/i,/^(?:NULL\b)/i,/^(?:NULLIF\b)/i,/^(?:NUMBER\b)/i,/^(?:NUMERIC\b)/i,/^(?:OBJECT\b)/i,/^(?:OF\b)/i,/^(?:OFFLINE\b)/i,/^(?:OFFSET\b)/i,/^(?:OLD\b)/i,/^(?:ON\b)/i,/^(?:ONLINE\b)/i,/^(?:ONLY\b)/i,/^(?:OPAQUE\b)/i,/^(?:OPEN\b)/i,/^(?:OPERATOR\b)/i,/^(?:OPTION\b)/i,/^(?:OR\b)/i,/^(?:ORDER\b)/i,/^(?:ORDINALITY\b)/i,/^(?:OTHER\b)/i,/^(?:OTHERS\b)/i,/^(?:OUT\b)/i,/^(?:OUTER\b)/i,/^(?:OUTPUT\b)/i,/^(?:OVER\b)/i,/^(?:OVERLAPS\b)/i,/^(?:OVERRIDE\b)/i,/^(?:OWNER\b)/i,/^(?:PAD\b)/i,/^(?:PARALLEL\b)/i,/^(?:PARAMETER\b)/i,/^(?:PARAMETERS\b)/i,/^(?:PARTIAL\b)/i,/^(?:PARTITION\b)/i,/^(?:PARTITIONED\b)/i,/^(?:PARTITIONS\b)/i,/^(?:PATH\b)/i,/^(?:PERCENT\b)/i,/^(?:PERCENTILE\b)/i,/^(?:PERMISSION\b)/i,/^(?:PERMISSIONS\b)/i,/^(?:PIPE\b)/i,/^(?:PIPELINED\b)/i,/^(?:PLAN\b)/i,/^(?:POOL\b)/i,/^(?:POSITION\b)/i,/^(?:PRECISION\b)/i,/^(?:PREPARE\b)/i,/^(?:PRESERVE\b)/i,/^(?:PRIMARY\b)/i,/^(?:PRIOR\b)/i,/^(?:PRIVATE\b)/i,/^(?:PRIVILEGES\b)/i,/^(?:PROCEDURE\b)/i,/^(?:PROCESSED\b)/i,/^(?:PROJECT\b)/i,/^(?:PROJECTION\b)/i,/^(?:PROPERTY\b)/i,/^(?:PROVISIONING\b)/i,/^(?:PUBLIC\b)/i,/^(?:PUT\b)/i,/^(?:QUERY\b)/i,/^(?:QUIT\b)/i,/^(?:QUORUM\b)/i,/^(?:RAISE\b)/i,/^(?:RANDOM\b)/i,/^(?:RANGE\b)/i,/^(?:RANK\b)/i,/^(?:RAW\b)/i,/^(?:READ\b)/i,/^(?:READS\b)/i,/^(?:REAL\b)/i,/^(?:REBUILD\b)/i,/^(?:RECORD\b)/i,/^(?:RECURSIVE\b)/i,/^(?:REDUCE\b)/i,/^(?:REF\b)/i,/^(?:REFERENCE\b)/i,/^(?:REFERENCES\b)/i,/^(?:REFERENCING\b)/i,/^(?:REGEXP\b)/i,/^(?:REGION\b)/i,/^(?:REINDEX\b)/i,/^(?:RELATIVE\b)/i,/^(?:RELEASE\b)/i,/^(?:REMAINDER\b)/i,/^(?:RENAME\b)/i,/^(?:REPEAT\b)/i,/^(?:REPLACE\b)/i,/^(?:REQUEST\b)/i,/^(?:RESET\b)/i,/^(?:RESIGNAL\b)/i,/^(?:RESOURCE\b)/i,/^(?:RESPONSE\b)/i,/^(?:RESTORE\b)/i,/^(?:RESTRICT\b)/i,/^(?:RESULT\b)/i,/^(?:RETURN\b)/i,/^(?:RETURNING\b)/i,/^(?:RETURNS\b)/i,/^(?:REVERSE\b)/i,/^(?:REVOKE\b)/i,/^(?:RIGHT\b)/i,/^(?:ROLE\b)/i,/^(?:ROLES\b)/i,/^(?:ROLLBACK\b)/i,/^(?:ROLLUP\b)/i,/^(?:ROUTINE\b)/i,/^(?:ROW\b)/i,/^(?:ROWS\b)/i,/^(?:RULE\b)/i,/^(?:RULES\b)/i,/^(?:SAMPLE\b)/i,/^(?:SATISFIES\b)/i,/^(?:SAVE\b)/i,/^(?:SAVEPOINT\b)/i,/^(?:SCAN\b)/i,/^(?:SCHEMA\b)/i,/^(?:SCOPE\b)/i,/^(?:SCROLL\b)/i,/^(?:SEARCH\b)/i,/^(?:SECOND\b)/i,/^(?:SECTION\b)/i,/^(?:SEGMENT\b)/i,/^(?:SEGMENTS\b)/i,/^(?:SELECT\b)/i,/^(?:SELF\b)/i,/^(?:SEMI\b)/i,/^(?:SENSITIVE\b)/i,/^(?:SEPARATE\b)/i,/^(?:SEQUENCE\b)/i,/^(?:SERIALIZABLE\b)/i,/^(?:SESSION\b)/i,/^(?:SET\b)/i,/^(?:SETS\b)/i,/^(?:SHARD\b)/i,/^(?:SHARE\b)/i,/^(?:SHARED\b)/i,/^(?:SHORT\b)/i,/^(?:SHOW\b)/i,/^(?:SIGNAL\b)/i,/^(?:SIMILAR\b)/i,/^(?:SIZE\b)/i,/^(?:SKEWED\b)/i,/^(?:SMALLINT\b)/i,/^(?:SNAPSHOT\b)/i,/^(?:SOME\b)/i,/^(?:SOURCE\b)/i,/^(?:SPACE\b)/i,/^(?:SPACES\b)/i,/^(?:SPARSE\b)/i,/^(?:SPECIFIC\b)/i,/^(?:SPECIFICTYPE\b)/i,/^(?:SPLIT\b)/i,/^(?:SQL\b)/i,/^(?:SQLCODE\b)/i,/^(?:SQLERROR\b)/i,/^(?:SQLEXCEPTION\b)/i,/^(?:SQLSTATE\b)/i,/^(?:SQLWARNING\b)/i,/^(?:START\b)/i,/^(?:STATE\b)/i,/^(?:STATIC\b)/i,/^(?:STATUS\b)/i,/^(?:STORAGE\b)/i,/^(?:STORE\b)/i,/^(?:STORED\b)/i,/^(?:STREAM\b)/i,/^(?:STRING\b)/i,/^(?:STRUCT\b)/i,/^(?:STYLE\b)/i,/^(?:SUB\b)/i,/^(?:SUBMULTISET\b)/i,/^(?:SUBPARTITION\b)/i,/^(?:SUBSTRING\b)/i,/^(?:SUBTYPE\b)/i,/^(?:SUM\b)/i,/^(?:SUPER\b)/i,/^(?:SYMMETRIC\b)/i,/^(?:SYNONYM\b)/i,/^(?:SYSTEM\b)/i,/^(?:TABLE\b)/i,/^(?:TABLESAMPLE\b)/i,/^(?:TEMP\b)/i,/^(?:TEMPORARY\b)/i,/^(?:TERMINATED\b)/i,/^(?:TEXT\b)/i,/^(?:THAN\b)/i,/^(?:THEN\b)/i,/^(?:THROUGHPUT\b)/i,/^(?:TIME\b)/i,/^(?:TIMESTAMP\b)/i,/^(?:TIMEZONE\b)/i,/^(?:TINYINT\b)/i,/^(?:TO\b)/i,/^(?:TOKEN\b)/i,/^(?:TOTAL\b)/i,/^(?:TOUCH\b)/i,/^(?:TRAILING\b)/i,/^(?:TRANSACTION\b)/i,/^(?:TRANSFORM\b)/i,/^(?:TRANSLATE\b)/i,/^(?:TRANSLATION\b)/i,/^(?:TREAT\b)/i,/^(?:TRIGGER\b)/i,/^(?:TRIM\b)/i,/^(?:TRUE\b)/i,/^(?:TRUNCATE\b)/i,/^(?:TTL\b)/i,/^(?:TUPLE\b)/i,/^(?:TYPE\b)/i,/^(?:UNDER\b)/i,/^(?:UNDO\b)/i,/^(?:UNION\b)/i,/^(?:UNIQUE\b)/i,/^(?:UNIT\b)/i,/^(?:UNKNOWN\b)/i,/^(?:UNLOGGED\b)/i,/^(?:UNNEST\b)/i,/^(?:UNPROCESSED\b)/i,/^(?:UNSIGNED\b)/i,/^(?:UNTIL\b)/i,/^(?:UPDATE\b)/i,/^(?:UPPER\b)/i,/^(?:URL\b)/i,/^(?:USAGE\b)/i,/^(?:USE\b)/i,/^(?:USER\b)/i,/^(?:USERS\b)/i,/^(?:USING\b)/i,/^(?:UUID\b)/i,/^(?:VACUUM\b)/i,/^(?:VALUE\b)/i,/^(?:VALUED\b)/i,/^(?:VALUES\b)/i,/^(?:VARCHAR\b)/i,/^(?:VARIABLE\b)/i,/^(?:VARIANCE\b)/i,/^(?:VARINT\b)/i,/^(?:VARYING\b)/i,/^(?:VIEW\b)/i,/^(?:VIEWS\b)/i,/^(?:VIRTUAL\b)/i,/^(?:VOID\b)/i,/^(?:WAIT\b)/i,/^(?:WHEN\b)/i,/^(?:WHENEVER\b)/i,/^(?:WHERE\b)/i,/^(?:WHILE\b)/i,/^(?:WINDOW\b)/i,/^(?:WITH\b)/i,/^(?:WITHIN\b)/i,/^(?:WITHOUT\b)/i,/^(?:WORK\b)/i,/^(?:WRAPPED\b)/i,/^(?:WRITE\b)/i,/^(?:YEAR\b)/i,/^(?:ZONE\b)/i,/^(?:JSON\b)/i,/^(?:MATH\b)/i,/^(?:[-]?(\d*[.])?\d+[eE]\d+)/i,/^(?:[-]?(\d*[.])?\d+)/i,/^(?:~)/i,/^(?:\+=)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:>>)/i,/^(?:<<)/i,/^(?:<>)/i,/^(?:!=)/i,/^(?:>=)/i,/^(?:>)/i,/^(?:<=)/i,/^(?:<)/i,/^(?:=)/i,/^(?:&)/i,/^(?:\|)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\.)/i,/^(?:,)/i,/^(?::)/i,/^(?:;)/i,/^(?:\$)/i,/^(?:\?)/i,/^(?:\^)/i,/^(?:[a-zA-Z_][a-zA-Z_0-9]*)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = sqlparser;
exports.Parser = sqlparser.Parser;
exports.parse = function () { return sqlparser.parse.apply(sqlparser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require('_process'))
},{"_process":4,"fs":1,"path":3}],8:[function(require,module,exports){
(function (Buffer){

var DynamoUtil = function() {};

DynamoUtil.config = {
	stringset_parse_as_set: false,
	numberset_parse_as_set: false,
	empty_string_replace_as: "",
}

// works for nodeJS 0.x and iojs,
// Array.from( Set ) doesnt
var array_from_set = function(s) {
	var r = []
	s.forEach(function(n){ r.push(n) })
	return r
} 
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
			anormal[key] = DynamoUtil.stringify(item[key])
		}
	}
	return anormal;
}


DynamoUtil.stringify = function( $value ) {
	if (typeof $value == 'boolean')
		return {'BOOL' : $value }

	if (typeof $value == 'number')
		return {'N' : $value.toString() }

	if (typeof $value == 'string') {
		if ($value.length === 0) {
			if (DynamoUtil.config.empty_string_replace_as === "") {
				return {'S' : $value }
			} else if (DynamoUtil.config.empty_string_replace_as === undefined) {
				return undefined
			}
			return DynamoUtil.stringify( DynamoUtil.config.empty_string_replace_as )
		}
		return {'S' : $value }
	}

	if ($value === null)
		return {'NULL' : true }

	if (Buffer.isBuffer($value))
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
					to_ret.L[i] = DynamoUtil.stringify($value[i] )
				}
			}
			return to_ret
		}

		if ($value instanceof Set) {
			var is_ss = true;
			var is_ns = true;
			
			// count elements in Set
			if ($value.size === 0) {
				is_ss = false;
				is_ns = false;
			}
			
			$value.forEach(function (v) { 
				if ( typeof v === "string" ) {
					is_ns = false;
				} else if ( typeof v === "number" ) {
					is_ss = false;
				} else {
					is_ss = false;
					is_ns = false;
				}
			})
			if (is_ss)
				return { 'SS': array_from_set($value) }

			if (is_ns)
				return { 
					'NS': array_from_set($value).map(function(item) { return item.toString() }) 
				}
			
			return { 
				'L': array_from_set($value).map(function(item) { return DynamoUtil.stringify(item) })
			}
		}

		var to_ret = {'M': {} }
		for (var i in $value) {
			if ($value.hasOwnProperty(i)) {
					var val = DynamoUtil.stringify($value[i] )
					
					if (val !== undefined ) // when empty string is replaced with undefined
						to_ret.M[i] = val
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

DynamoUtil.parse = function(v) {
	if (typeof v !== 'object')
		throw 'expecting object';

	if (Object.keys(v).length !== 1)
		throw 'expecting only one property in object: S, N, BOOL, NULL, L, M, etc ';

	if (v.hasOwnProperty('S')) {
		if ( v.S === DynamoUtil.config.empty_string_replace_as )
			return '';

		return v.S
	}

	if (v.hasOwnProperty('N'))
		return parseInt(v.N)

	if (v.hasOwnProperty('BOOL'))
		return v.BOOL

	if (v.hasOwnProperty('NULL'))
		return null

	if (v.hasOwnProperty('B'))
		return v.B

	if (v.hasOwnProperty('SS')) {
		if (DynamoUtil.config.stringset_parse_as_set)
			return new Set(v.SS)

		return v.SS
	}

	if (v.hasOwnProperty('NS')) {
		if (DynamoUtil.config.numberset_parse_as_set)
			return new Set(v.NS.map(function(el) { return parseFloat(el)}))

		return v.NS.map(function(el) { return parseFloat(el)})
	}

	if (v.hasOwnProperty('L')){
		var normal = [];
		for (var i in v.L ) {
			if (v.L.hasOwnProperty(i)) {
				normal[i] = DynamoUtil.parse(v.L[i])
			}
		}
		return normal;
	}

	if (v.hasOwnProperty('M')) {
		var normal = {}
		for (var i in v.M ) {
			if (v.M.hasOwnProperty(i)) {
				normal[i] = DynamoUtil.parse(v.M[i])
			}
		}
		return normal;
	}
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
						AttributeValueList: [ DynamoUtil.stringify( $expected[key].value ), DynamoUtil.stringify( $expected[key].value2 ) ]
					}
				} else {
					anormal[key] = {
						ComparisonOperator: $expected[key].operator,
						AttributeValueList: [ DynamoUtil.stringify( $expected[key].value ) ]
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






// backword compatibitity
DynamoUtil.anormalizeValue = DynamoUtil.stringify;
DynamoUtil.normalizeValue  = DynamoUtil.parse;

module.exports = DynamoUtil

}).call(this,{"isBuffer":require("../../../../../../../../.nvm/versions/node/v9.11.2/lib/node_modules/browserify/node_modules/is-buffer/index.js")})
},{"../../../../../../../../.nvm/versions/node/v9.11.2/lib/node_modules/browserify/node_modules/is-buffer/index.js":2}]},{},[5]);