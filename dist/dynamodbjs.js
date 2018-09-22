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
		if (o.hasOwnProperty('empty_string_replace_as')) {
			//console.log("setting replace as to ", JSON.stringify(o.empty_string_replace_as) )
			DynamodbFactory.util.config.empty_string_replace_as = o.empty_string_replace_as;
		}

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
		this.describeTables = {}
		this.return_explain = false

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

	DynamoDB.prototype.addTableSchema = function( $schema ) {

		if (typeof $schema !== "object")
			throw new Error("[AWSPILOT] Invalid parameter, schema must be Array of Objects or Object");

		if (! $schema.hasOwnProperty('TableName') )
			throw new Error("[AWSPILOT] Invalid parameter, missing $schema.TableName");

		if (! $schema.hasOwnProperty('KeySchema') )
			throw new Error("[AWSPILOT] Invalid parameter, missing $schema.KeySchema");


		this.describeTables[$schema.TableName] = $schema;
	}

	DynamoDB.prototype.schema = function( $schemas ) {
		var $this = this;
		if (typeof $schemas !== "object")
			throw new Error("[AWSPILOT] Invalid parameter, schema must be Array or Object");

		if (Array.isArray($schemas))
			$schemas.map(function(s) {
				$this.addTableSchema(s)
			})
		else
			this.addTableSchema($schemas)

		return this;
	}

	DynamoDB.prototype.explain = function() {
		this.return_explain = true
		return this
	}

	DynamoDB.prototype.table = function($tableName) {
		var re = this.return_explain; this.return_explain = false;
		return new Request( this.client, { events: this.events, describeTables: this.describeTables, return_explain: re, } ).table($tableName)
	}


	DynamoDB.prototype.query = function() {
		var re = this.return_explain; this.return_explain = false;
		var r = new Request( this.client, { events: this.events, describeTables: this.describeTables, return_explain: re, } )
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

	function Request( $client, config ) {


		this.events = config.events // global events
		this.describeTables = config.describeTables
		this.return_explain = config.return_explain
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

		if ( this.return_explain ) {
			if ( reset === true )
				$this.reset()

			switch (method) {
				case 'putItem':
				case 'updateItem':
				case 'deleteItem':
					var explain = {
						Attributes: DynamodbFactory.util.anormalizeItem({
							method: method,
							payload: params,
						})
					}
					break;
				case 'getItem':
					var explain = {
						Item: DynamodbFactory.util.anormalizeItem({
							method: method,
							payload: params,
						})
					}
					break;
				case 'query':
				case 'scan':
					var explain = {
						Items: DynamodbFactory.util.anormalizeItem({
							method: method,
							payload: params,
						})
					}
					break;
				case 'listTables':
					var explain = {
						TableNames: DynamodbFactory.util.anormalizeItem({
							method: method,
							payload: params,
						})
					}
					break;
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
	Request.prototype.describeTable = function( table, callback ) {
		if (this.describeTables.hasOwnProperty(table)) {
			return callback.apply( this, [ null, { Table: this.describeTables[table] } ] )
		}

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

					fullfill(DynamodbFactory.util.parse({ M : data.Item || {} }))
				})
			})
		}


		this.routeCall('getItem', $thisQuery , true, function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			typeof callback !== "function" ? null : callback.apply( this, [ err, DynamodbFactory.util.parse({ M : data.Item || {} }) ,data ])
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

					fullfill(
						DynamodbFactory.util.parse({ L:
							(data.Items || []).map(function(item) { return {'M': item } })
						} )
					)
				})
			})
		}

		this.routeCall('query', $thisQuery , true , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey

			typeof callback !== "function" ? null : callback.apply( this, [ err,

				DynamodbFactory.util.parse({ L:
					(data.Items || []).map(function(item) { return {'M': item } })
				} )
			, data ])
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

					fullfill(
						DynamodbFactory.util.parse({ L:
							(data.Items || []).map(function(item) { return {'M': item } })
						} )
					)
				})
			})
		}

		this.routeCall('scan', $thisQuery, true , function(err,data) {
			if (err)
				return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

			this.LastEvaluatedKey = data.LastEvaluatedKey === undefined ? null : data.LastEvaluatedKey

			typeof callback !== "function" ? null : callback.apply( this, [ err,
				DynamodbFactory.util.parse({ L:
					(data.Items || []).map(function(item) { return {'M': item } })
				} )
			, data ])

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

					case 'SHOW_TABLES':

						if (typeof $this.local_events['beforeRequest'] === "function" )
							$this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

						$this.routeCall( sqp.operation, sqp.dynamodb ,true, function(err,data) {
							if (err)
								return reject(err)

							fullfill(data.TableNames)
						})

						break;
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

							fullfill(
								DynamodbFactory.util.parse({ L:
									(data.Items || []).map(function(item) { return {'M': item } })
								} )
							)
						})
						break;
					default:
						reject({ errorCode: 'UNSUPPORTED_QUERY_TYPE' })
				}

			})
		}


		switch (sqp.statement) {
			case 'SHOW_TABLES':
				if (typeof this.local_events['beforeRequest'] === "function" )
					this.local_events['beforeRequest'](sqp.operation, sqp.dynamodb)

				this.routeCall(sqp.operation, sqp.dynamodb ,true, function(err,data) {
					if (err)
						return typeof callback !== "function" ? null : callback.apply( this, [ err, false ] )

					typeof callback !== "function" ? null : callback.apply( this, [ err, data.TableNames, data ])
				})
				break;
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

					typeof callback !== "function" ? null : callback.apply( this, [ err,
						DynamodbFactory.util.parse({ L:
							(data.Items || []).map(function(item) { return {'M': item } })
						} )
					, data ])

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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,17],$V1=[1,18],$V2=[1,19],$V3=[1,20],$V4=[1,27],$V5=[1,21],$V6=[1,22],$V7=[1,23],$V8=[1,24],$V9=[1,28],$Va=[1,26],$Vb=[5,6],$Vc=[5,6,129,131],$Vd=[1,37],$Ve=[1,38],$Vf=[5,6,131],$Vg=[1,60],$Vh=[1,61],$Vi=[1,62],$Vj=[1,57],$Vk=[1,51],$Vl=[1,58],$Vm=[1,59],$Vn=[21,22,97],$Vo=[1,68],$Vp=[5,6,29,54,66,74,76,102,104,109,112,115,117,122,129,130,131,137,140,146,151,152,153,154,155,156,158,162,170,172,181,186],$Vq=[1,85],$Vr=[1,86],$Vs=[1,87],$Vt=[1,88],$Vu=[1,89],$Vv=[5,6,54,63,76,95,96,97,98,112,117,129,130,131,146],$Vw=[1,91],$Vx=[5,6,53,54,63,76,95,96,97,98,112,117,129,130,131,146],$Vy=[1,96],$Vz=[54,122],$VA=[54,112],$VB=[5,6,54,63,76,95,96,112,117,129,130,131,146],$VC=[5,6,129,131,146],$VD=[1,163],$VE=[1,176],$VF=[1,177],$VG=[1,178],$VH=[1,180],$VI=[1,179],$VJ=[1,181],$VK=[1,184],$VL=[5,6,54],$VM=[5,6,53,54,63,112],$VN=[54,63],$VO=[2,97],$VP=[1,211],$VQ=[1,212],$VR=[53,54],$VS=[2,59],$VT=[1,221],$VU=[1,222],$VV=[5,6,129,130,131],$VW=[1,254],$VX=[1,255],$VY=[1,256],$VZ=[1,252],$V_=[1,253],$V$=[1,248],$V01=[5,6,53,54,117,129,130,131,146],$V11=[5,6,117],$V21=[1,284],$V31=[5,6,129,130,131,146],$V41=[1,290],$V51=[1,288],$V61=[1,291],$V71=[1,292],$V81=[1,293],$V91=[1,294],$Va1=[1,295],$Vb1=[1,296],$Vc1=[1,297],$Vd1=[5,6,109,117,129,131,151,152,153,154,155,156,158,162],$Ve1=[5,6,109,117,129,130,131,151,152,153,154,155,156,158,162],$Vf1=[1,310],$Vg1=[1,315],$Vh1=[1,313],$Vi1=[1,316],$Vj1=[1,317],$Vk1=[1,318],$Vl1=[1,319],$Vm1=[1,320],$Vn1=[1,321],$Vo1=[1,322],$Vp1=[54,76],$Vq1=[5,6,117,129,130,131,146],$Vr1=[2,257],$Vs1=[1,398],$Vt1=[5,6,54,112],$Vu1=[2,259],$Vv1=[1,415],$Vw1=[54,76,176];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"main":3,"sql_stmt_list":4,"EOF":5,"SEMICOLON":6,"sql_stmt":7,"select_stmt":8,"insert_stmt":9,"update_stmt":10,"replace_stmt":11,"delete_stmt":12,"create_table_stmt":13,"show_tables_stmt":14,"drop_table_stmt":15,"describe_table_stmt":16,"drop_index_stmt":17,"scan_stmt":18,"debug_stmt":19,"name":20,"LITERAL":21,"BRALITERAL":22,"database_table_name":23,"DOT":24,"dynamodb_table_name":25,"database_index_name":26,"dynamodb_index_name":27,"signed_number":28,"NUMBER":29,"string_literal":30,"SINGLE_QUOTED_STRING":31,"DOUBLE_QUOTED_STRING":32,"XSTRING":33,"literal_value":34,"boolean":35,"TRUE":36,"FALSE":37,"boolean_value":38,"dynamodb_data_string":39,"dynamodb_raw_string":40,"dynamodb_data_number":41,"dynamodb_raw_number":42,"dynamodb_data_boolean":43,"dynamodb_raw_boolean":44,"dynamodb_data_null":45,"NULL":46,"dynamodb_raw_null":47,"dynamodb_data_undefined":48,"UNDEFINED":49,"dynamodb_data_array":50,"ARRAYLPAR":51,"array_list":52,"ARRAYRPAR":53,"COMMA":54,"array_value":55,"dynamodb_data_json":56,"dynamodb_raw_array":57,"array_list_raw":58,"array_value_raw":59,"dynamodb_raw_json":60,"JSONLPAR":61,"dynamodb_data_json_list":62,"JSONRPAR":63,"dynamodb_data_json_kv":64,"dynamodb_data_json_kv_key":65,"COLON":66,"dynamodb_data_json_list_raw":67,"dynamodb_raw_json_kv":68,"dynamodb_raw_json_kv_key":69,"javascript_raw_expr":70,"dynamodb_raw_stringset":71,"NEW":72,"STRINGSET":73,"LPAR":74,"stringset_list":75,"RPAR":76,"dynamodb_raw_numberset":77,"NUMBERSET":78,"numberset_list":79,"javascript_data_obj_date":80,"DATE":81,"javascript_raw_date_parameter":82,"javascript_raw_obj_date":83,"def_resolvable_expr":84,"javascript_raw_obj_math":85,"javascript_data_obj_math":86,"MATH":87,"javascript_raw_math_funcname":88,"javascript_raw_math_parameter":89,"RANDOM":90,"javascript_data_func_uuid":91,"UUID":92,"javascript_data_expr":93,"dev_resolvable_value":94,"PLUS":95,"MINUS":96,"STAR":97,"SLASH":98,"INSERT":99,"def_insert_ignore":100,"INTO":101,"SET":102,"def_insert_columns":103,"VALUES":104,"def_insert_items":105,"IGNORE":106,"def_insert_item":107,"def_insert_onecolumn":108,"EQ":109,"UPDATE":110,"def_update_columns":111,"WHERE":112,"def_update_where":113,"def_update_onecolumn":114,"PLUSEQ":115,"def_update_where_cond":116,"AND":117,"REPLACE":118,"def_replace_columns":119,"def_replace_onecolumn":120,"DELETE":121,"FROM":122,"def_delete_where":123,"def_delete_where_cond":124,"def_select":125,"select_sort_clause":126,"limit_clause":127,"def_consistent_read":128,"LIMIT":129,"DESC":130,"CONSISTENT_READ":131,"distinct_all":132,"DISTINCT":133,"ALL":134,"def_select_columns":135,"def_select_onecolumn":136,"AS":137,"def_select_from":138,"def_select_use_index":139,"USE":140,"INDEX":141,"def_where":142,"select_where_hash":143,"select_where_range":144,"def_having":145,"HAVING":146,"having_expr":147,"SELECT":148,"where_expr":149,"bind_parameter":150,"OR":151,"GT":152,"GE":153,"LT":154,"LE":155,"BETWEEN":156,"where_between":157,"LIKE":158,"select_where_hash_value":159,"select_where_range_value":160,"select_where_between":161,"CONTAINS":162,"CREATE":163,"TABLE":164,"def_ct_typedef_list":165,"def_ct_pk":166,"def_ct_indexes":167,"def_ct_index_list":168,"def_ct_index":169,"LSI":170,"def_ct_projection":171,"GSI":172,"def_ct_throughput":173,"PRIMARY":174,"KEY":175,"THROUGHPUT":176,"PROJECTION":177,"KEYS_ONLY":178,"def_ct_projection_list":179,"def_ct_typedef":180,"STRING":181,"SHOW":182,"TABLES":183,"DROP":184,"DESCRIBE":185,"ON":186,"def_scan":187,"def_scan_limit_clause":188,"def_scan_consistent_read":189,"SCAN":190,"def_scan_columns":191,"def_scan_use_index":192,"def_scan_having":193,"def_scan_onecolumn":194,"def_scan_having_expr":195,"DEBUG":196,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"SEMICOLON",21:"LITERAL",22:"BRALITERAL",24:"DOT",29:"NUMBER",31:"SINGLE_QUOTED_STRING",32:"DOUBLE_QUOTED_STRING",33:"XSTRING",36:"TRUE",37:"FALSE",46:"NULL",49:"UNDEFINED",51:"ARRAYLPAR",53:"ARRAYRPAR",54:"COMMA",61:"JSONLPAR",63:"JSONRPAR",66:"COLON",72:"NEW",73:"STRINGSET",74:"LPAR",76:"RPAR",78:"NUMBERSET",81:"DATE",87:"MATH",90:"RANDOM",92:"UUID",95:"PLUS",96:"MINUS",97:"STAR",98:"SLASH",99:"INSERT",101:"INTO",102:"SET",104:"VALUES",106:"IGNORE",109:"EQ",110:"UPDATE",112:"WHERE",115:"PLUSEQ",117:"AND",118:"REPLACE",121:"DELETE",122:"FROM",129:"LIMIT",130:"DESC",131:"CONSISTENT_READ",133:"DISTINCT",134:"ALL",137:"AS",140:"USE",141:"INDEX",146:"HAVING",148:"SELECT",150:"bind_parameter",151:"OR",152:"GT",153:"GE",154:"LT",155:"LE",156:"BETWEEN",158:"LIKE",162:"CONTAINS",163:"CREATE",164:"TABLE",170:"LSI",172:"GSI",174:"PRIMARY",175:"KEY",176:"THROUGHPUT",177:"PROJECTION",178:"KEYS_ONLY",181:"STRING",182:"SHOW",183:"TABLES",184:"DROP",185:"DESCRIBE",186:"ON",190:"SCAN",196:"DEBUG"},
productions_: [0,[3,2],[4,3],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[20,1],[20,1],[23,3],[23,1],[25,1],[26,1],[27,1],[28,1],[30,1],[30,1],[30,1],[34,1],[34,1],[35,1],[35,1],[38,1],[38,1],[39,1],[39,1],[40,1],[40,1],[41,1],[42,1],[43,1],[43,1],[44,1],[44,1],[45,1],[47,1],[48,1],[50,3],[52,3],[52,1],[55,0],[55,1],[55,1],[55,1],[55,1],[55,1],[55,1],[57,3],[58,3],[58,1],[59,0],[59,1],[59,1],[59,1],[59,1],[59,1],[59,1],[56,3],[62,3],[62,1],[65,1],[65,1],[65,1],[64,0],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[64,3],[60,3],[67,3],[67,1],[69,1],[69,1],[69,1],[68,0],[68,3],[68,3],[68,3],[68,3],[68,3],[71,7],[75,3],[75,1],[77,7],[79,3],[79,1],[80,5],[80,9],[83,5],[83,9],[82,0],[82,1],[85,1],[86,6],[88,1],[88,1],[89,0],[89,1],[91,3],[91,4],[70,1],[93,1],[84,1],[84,3],[84,3],[84,3],[84,3],[84,3],[94,1],[94,1],[94,1],[94,1],[94,1],[9,6],[9,6],[100,0],[100,1],[105,3],[105,1],[107,3],[103,3],[103,1],[108,3],[108,3],[108,3],[108,3],[108,3],[108,3],[108,3],[10,6],[111,3],[111,1],[114,3],[114,3],[114,3],[114,3],[114,3],[114,3],[114,3],[114,3],[114,3],[113,1],[113,3],[116,3],[11,5],[119,3],[119,1],[120,3],[120,3],[120,3],[120,3],[120,3],[120,3],[120,3],[12,5],[123,1],[123,3],[124,3],[8,4],[127,0],[127,2],[126,0],[126,1],[128,0],[128,1],[132,0],[132,1],[132,1],[135,3],[135,1],[136,1],[136,1],[136,3],[138,2],[139,0],[139,3],[142,2],[142,4],[145,2],[145,0],[125,7],[149,1],[149,1],[149,1],[149,3],[149,3],[149,3],[149,3],[149,3],[149,3],[149,3],[149,3],[149,3],[143,3],[159,1],[144,3],[144,3],[144,3],[144,3],[144,3],[144,3],[144,3],[160,1],[161,3],[161,3],[157,3],[157,3],[147,1],[147,1],[147,1],[147,1],[147,3],[147,3],[147,3],[147,3],[147,3],[147,3],[147,3],[147,3],[147,3],[147,3],[147,3],[147,3],[13,9],[167,0],[167,2],[168,3],[168,1],[169,7],[169,8],[169,9],[169,10],[166,6],[166,8],[173,0],[173,3],[171,0],[171,2],[171,2],[171,4],[179,3],[179,1],[165,3],[165,1],[180,2],[180,2],[14,2],[15,3],[16,3],[17,5],[18,3],[187,6],[188,0],[188,2],[189,0],[189,1],[191,3],[191,1],[194,1],[194,1],[194,3],[192,0],[192,3],[193,2],[193,0],[195,1],[195,1],[195,1],[195,1],[195,3],[195,3],[195,3],[195,3],[195,3],[195,3],[195,3],[195,3],[195,3],[195,3],[195,3],[195,3],[19,2]],
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
case 3: case 48: case 58: case 68: case 93: case 105: case 141: case 144: case 154: case 169: case 192: case 264: case 280:
 this.$ = [$$[$0]]; 
break;
case 16: case 20: case 22: case 23: case 24: case 25: case 26: case 196: case 198: case 204: case 230: case 231: case 285: case 288: case 289:
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
case 47: case 57:

			this.$ = $$[$0-2]
			this.$.push($$[$0]);
		
break;
case 49: case 59:
 this.$ = "\0" 
break;
case 50: case 51: case 52: case 53: case 54: case 55: case 60: case 61: case 62: case 63: case 64: case 65: case 69: case 70: case 71: case 94: case 114: case 117: case 120: case 124: case 125: case 131: case 132: case 133: case 134: case 135: case 217: case 225:
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
case 67: case 92: case 140: case 143: case 153: case 168: case 191: case 249: case 263: case 279:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 72: case 97: case 182: case 188: case 197: case 247: case 275: case 284:
 this.$ = undefined; 
break;
case 73: case 74: case 75: case 76: case 77: case 78: case 79: case 80: case 81: case 82: case 83: case 84: case 85: case 86: case 87: case 88: case 89: case 90: case 98: case 99: case 100: case 101: case 102:
 this.$ = [$$[$0-2], $$[$0] ] 
break;
case 91:

			var $kv = {}
			if ($$[$0-1]) {
				$$[$0-1].map(function(v) {
					if (v)
						$kv[v[0]] = v[1]
				})
			}
			this.$ = { 'M': $kv }
		
break;
case 95: case 96:
 this.$ = eval($$[$0]) 
break;
case 103:

			if ($$[$0-2].slice(-1) == "\0") {
				$$[$0-2] = $$[$0-2].slice(0,-1)
			}
			this.$ = { 'SS': $$[$0-2] }
		
break;
case 104:

			this.$ = $$[$0-2] 
			this.$.push($$[$0]); 
		
break;
case 106:

			if ($$[$0-2].slice(-1) == "\0") {
				$$[$0-2] = $$[$0-2].slice(0,-1)
			}
			this.$ = { 'NS': $$[$0-2] }
		
break;
case 107:

			this.$ = $$[$0-2] 
			this.$.push( ($$[$0]).toString() ); 
		
break;
case 108:
 this.$ = [ ($$[$0]).toString() ]; 
break;
case 109:

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
case 110:

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
case 111:

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
case 112:

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
case 113: case 119:
 this.$ = undefined 
break;
case 115: case 123:

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
case 116:

			if (typeof Math[$$[$0-3]] === "function" ) {
				this.$ = Math[$$[$0-3]]($$[$0-1]);
			} else {
				throw 'Math.' + $$[$0-3] + " not a function"
			}
		
break;
case 118:
 this.$ = 'random' 
break;
case 121:

			this.$ =  '########-####-####-####-############'.replace(/[#]/g, function(c) { var r = Math.random()*16|0, v = c == '#' ? r : (r&0x3|0x8); return v.toString(16); })
 		
break;
case 122:

			this.$ =  '########-####-####-####-############'.replace(/[#]/g, function(c) { var r = Math.random()*16|0, v = c == '#' ? r : (r&0x3|0x8); return v.toString(16); })
			if ( typeof $$[$0-1] === 'string')
				this.$ =  $$[$0-1].replace(/[#]/g, function(c) { var r = Math.random()*16|0, v = c == '#' ? r : (r&0x3|0x8); return v.toString(16); })

			if ( typeof $$[$0-1] === 'number')
				this.$ = '#'.repeat(
					Math.max(
						1,
						Math.min(36, $$[$0-1])
					)
				).replace(/[#]/g, function(c) { var r = Math.random()*16|0, v = c == '#' ? r : (r&0x3|0x8); return v.toString(16); })
		
break;
case 126: case 142:
 this.$ = $$[$0-1] 
break;
case 127:
 this.$ = $$[$0-2] + $$[$0] 
break;
case 128:
 this.$ = $$[$0-2] - $$[$0] 
break;
case 129:
 this.$ = $$[$0-2] * $$[$0] 
break;
case 130:

			if ($$[$0] === 0 )
				throw 'Division by 0';

			this.$ = $$[$0-2] / $$[$0]
		
break;
case 136:

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
case 137:

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
case 138:
 this.$ = false 
break;
case 139:
 this.$ = true 
break;
case 145: case 146: case 147: case 148: case 149: case 150: case 151: case 155: case 156: case 157: case 158: case 159: case 160: case 161: case 170: case 171: case 172: case 173: case 174: case 175: case 176: case 226: case 227:
 this.$ = [ $$[$0-2], $$[$0] ]; 
break;
case 152:


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
case 162:
 this.$ = [ $$[$0-2], $$[$0], '+=' ]; 
break;
case 163:
 this.$ = [ $$[$0-2], undefined, 'delete' ]; 
break;
case 164: case 178: case 250: case 266:
 this.$ = [ $$[$0] ]; 
break;
case 165: case 179:
 this.$ = [$$[$0-2], $$[$0]]; 
break;
case 166: case 180:
 this.$ = {k: $$[$0-2], v: $$[$0] }; 
break;
case 167:

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
case 177:

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
case 181:

			this.$ = {
				statement: 'SELECT',
				operation: 'query',
				dynamodb: $$[$0-3].dynamodb,
			};
			yy.extend(this.$.dynamodb,$$[$0-2]);
			yy.extend(this.$.dynamodb,$$[$0-1]);
			yy.extend(this.$.dynamodb,$$[$0]);
		
break;
case 183:
 this.$ = { Limit: $$[$0] }; 
break;
case 184:
 this.$ = { ScanIndexForward: true }; 
break;
case 185:
 this.$ = { ScanIndexForward: false }; 
break;
case 186: case 277:
 this.$ = { ConsistentRead: false }; 
break;
case 187:
 this.$ = { ConsistentRead: true }; 
break;
case 189:
 this.$ = {distinct:true}; 
break;
case 190:
 this.$ = {all:true}; 
break;
case 193: case 281:
 this.$ = {type: 'star', star:true}; 
break;
case 194: case 282:
 this.$ = {type: 'column', column: $$[$0]}; 
break;
case 195: case 283:
 this.$ = {type: 'column', column: $$[$0-2], alias: $$[$0] }; 
break;
case 199:

			this.$ = {
				//KeyConditionExpression: $$[$0],
				ExpressionAttributeNames: {},
				ExpressionAttributeValues: {},
			};

			this.$.ExpressionAttributeNames[ '#partitionKeyName' ] = $$[$0].partition.partitionKeyName
			this.$.ExpressionAttributeValues[ ':partitionKeyValue' ] = $$[$0].partition.partitionKeyValue
			this.$.KeyConditionExpression = ' #partitionKeyName =  :partitionKeyValue '

		
break;
case 200:

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
case 201: case 286:
 this.$ = {having: $$[$0]}; 
break;
case 203:

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
case 205: case 232: case 290:
 this.$ = {bind_parameter: $$[$0]}; 
break;
case 206: case 233: case 291:
 this.$ = {column: $$[$0]}; 
break;
case 207: case 234: case 292:
 this.$ = {op: 'AND', left: $$[$0-2], right: $$[$0]}; 
break;
case 208: case 235: case 293:
 this.$ = {op: 'OR', left: $$[$0-2], right: $$[$0]}; 
break;
case 209: case 236: case 294:
 this.$ = {op: '=', left: $$[$0-2], right: $$[$0]}; 
break;
case 210: case 237: case 295:
 this.$ = {op: '>', left: $$[$0-2], right: $$[$0]}; 
break;
case 211: case 238: case 296:
 this.$ = {op: '>=', left: $$[$0-2], right: $$[$0]}; 
break;
case 212: case 239: case 297:
 this.$ = {op: '<', left: $$[$0-2], right: $$[$0]}; 
break;
case 213: case 240: case 298:
 this.$ = {op: '<=', left: $$[$0-2], right: $$[$0]}; 
break;
case 214: case 241: case 299:
 this.$ = {op: 'BETWEEN', left: $$[$0-2], right:$$[$0] }; 
break;
case 215: case 242: case 300:
 this.$ = {op: 'LIKE', left:$$[$0-2], right: { type: 'string', string: $$[$0] } }; 
break;
case 216:

			this.$ = {
				partition: {
					partitionKeyName: $$[$0-2],
					partitionKeyValue: $$[$0]
				}
			}
		
break;
case 218:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '='
				}
			}
		
break;
case 219:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '>'
				}
			}
		
break;
case 220:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '>='
				}
			}
		
break;
case 221:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '<'
				}
			}
		
break;
case 222:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: '<='
				}
			}
		
break;
case 223:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue1: $$[$0][0],
					sortKeyValue2: $$[$0][1],
					op: 'BETWEEN'
				}
			}
		
break;
case 224:

			this.$ = {
				sort: {
					sortKeyName: $$[$0-2],
					sortKeyValue: $$[$0],
					op: 'BEGINS_WITH'
				}
			}
		
break;
case 228:
 this.$ = {left: { type: 'number', number: $$[$0-2]}, right: {type: 'number', number: $$[$0] } }; 
break;
case 229:
 this.$ = {left: { type: 'string', string: $$[$0-2]}, right: {type: 'string', string: $$[$0] } }; 
break;
case 243: case 301:
 this.$ = {op: 'CONTAINS', left:$$[$0-2], right: { type: 'string', string: $$[$0] } }; 
break;
case 244: case 302:
 this.$ = {op: 'CONTAINS', left:$$[$0-2], right: { type: 'number', number: $$[$0] } }; 
break;
case 245: case 303:
 this.$ = {op: 'CONTAINS', left:$$[$0-2], right: { type: 'boolean', value: $$[$0] } }; 
break;
case 246:

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
case 248:

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
case 251:

			this.$ = {}
			this.$[$$[$0-4]] = { 
				IndexName: $$[$0-5], 
				KeySchema: [ { AttributeName: $$[$0-2], KeyType: 'HASH' } ], 
				Projection: $$[$0],
			}
		
break;
case 252:

			this.$ = {}
			this.$[$$[$0-5]] = { 
				IndexName: $$[$0-6], 
				KeySchema: [ { AttributeName: $$[$0-3], KeyType: 'HASH' } ], 
				Projection: $$[$0-1],
				ProvisionedThroughput: $$[$0] 
			}
		
break;
case 253:

			this.$ = {}
			this.$[$$[$0-6]] = { 
				IndexName: $$[$0-7], 
				KeySchema: [ { AttributeName: $$[$0-4], KeyType: 'HASH' }, { AttributeName: $$[$0-2], KeyType: 'RANGE' } ], 
				Projection: $$[$0],
			}
		
break;
case 254:

			this.$ = {}
			this.$[$$[$0-7]] = { 
				IndexName: $$[$0-8], 
				KeySchema: [ { AttributeName: $$[$0-5], KeyType: 'HASH' }, { AttributeName: $$[$0-3], KeyType: 'RANGE' } ], 
				Projection: $$[$0-1],
				ProvisionedThroughput: $$[$0] 
			}
		
break;
case 255:
 this.$ = { KeySchema: [ { AttributeName: $$[$0-2], KeyType: 'HASH' }], ProvisionedThroughput: $$[$0] }  
break;
case 256:
 this.$ = { KeySchema: [ { AttributeName: $$[$0-4], KeyType: 'HASH' } , { AttributeName: $$[$0-2], KeyType: 'RANGE' } ], ProvisionedThroughput: $$[$0] }  
break;
case 257:
 this.$ = { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }; 
break;
case 258:
 this.$ = { ReadCapacityUnits: eval($$[$0-1]), WriteCapacityUnits: eval($$[$0]) } 
break;
case 259: case 260:
 this.$ = { ProjectionType: 'ALL' }; 
break;
case 261:
 this.$ = { ProjectionType: 'KEYS_ONLY' } 
break;
case 262:
 this.$ = { ProjectionType: 'INCLUDE', NonKeyAttributes: $$[$0-1] } 
break;
case 265:
 this.$ = $$[$0-2]; this.$.push($$[$0]) 
break;
case 267:
 this.$ = { AttributeName: $$[$0-1], AttributeType: 'S'}; 
break;
case 268:
 this.$ = { AttributeName: $$[$0-1], AttributeType: 'N'}; 
break;
case 269:

			this.$ = {
				statement: 'SHOW_TABLES',
				operation: 'listTables',
				dynamodb: {}
			}
		
break;
case 270:

			this.$ = {
				statement: 'DROP_TABLE',
				operation: 'deleteTable',
				dynamodb: {
					TableName: $$[$0]
				}
			};
		
break;
case 271:

			this.$ = {
				statement: 'DESCRIBE_TABLE',
				operation: 'describeTable',
				dynamodb: {
					TableName: $$[$0]
				}
			};
		
break;
case 272:

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
case 273:

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
case 274:

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
case 276:
 this.$ = {Limit: $$[$0]}; 
break;
case 278:
 this.$ = { ConsistentRead: true  }; 
break;
case 304:

			this.$ = $$[$0]
		
break;
}
},
table: [{3:1,4:2,7:3,8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,99:$V0,110:$V1,118:$V2,121:$V3,125:16,148:$V4,163:$V5,182:$V6,184:$V7,185:$V8,187:25,190:$V9,196:$Va},{1:[3]},{5:[1,29],6:[1,30]},o($Vb,[2,3]),o($Vb,[2,4]),o($Vb,[2,5]),o($Vb,[2,6]),o($Vb,[2,7]),o($Vb,[2,8]),o($Vb,[2,9]),o($Vb,[2,10]),o($Vb,[2,11]),o($Vb,[2,12]),o($Vb,[2,13]),o($Vb,[2,14]),o($Vb,[2,15]),o($Vc,[2,184],{126:31,130:[1,32]}),{100:33,101:[2,138],106:[1,34]},{20:36,21:$Vd,22:$Ve,25:35},{101:[1,39]},{122:[1,40]},{164:[1,41]},{183:[1,42]},{141:[1,44],164:[1,43]},{164:[1,45]},o($Vf,[2,275],{188:46,129:[1,47]}),{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:48,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50},o($Vn,[2,188],{132:63,133:[1,64],134:[1,65]}),{20:69,21:$Vd,22:$Ve,97:$Vo,191:66,194:67},{1:[2,1]},{7:70,8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,99:$V0,110:$V1,118:$V2,121:$V3,125:16,148:$V4,163:$V5,182:$V6,184:$V7,185:$V8,187:25,190:$V9,196:$Va},o($Vf,[2,182],{127:71,129:[1,72]}),o($Vc,[2,185]),{101:[1,73]},{101:[2,139]},{102:[1,74]},o([5,6,74,102,104,112,129,131,140,146],[2,20]),o($Vp,[2,16]),o($Vp,[2,17]),{20:36,21:$Vd,22:$Ve,25:75},{20:36,21:$Vd,22:$Ve,25:76},{20:36,21:$Vd,22:$Ve,25:77},o($Vb,[2,269]),{20:36,21:$Vd,22:$Ve,25:78},{20:80,21:$Vd,22:$Ve,27:79},{20:36,21:$Vd,22:$Ve,25:81},o($Vb,[2,277],{189:82,131:[1,83]}),{28:84,29:$Vq},o($Vb,[2,304]),o([5,6,54,63,112,117,129,130,131,146],[2,123],{95:$Vr,96:$Vs,97:$Vt,98:$Vu}),o($Vv,[2,125]),{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,72:$Vj,74:$Vk,80:52,84:90,86:53,87:$Vl,91:54,92:$Vm,94:50},o($Vv,[2,131]),o($Vv,[2,132]),o($Vv,[2,133]),o($Vv,[2,134]),o($Vv,[2,135]),{81:$Vw},{24:[1,92]},{74:[1,93]},o($Vx,[2,37]),o($Vx,[2,33]),o($Vx,[2,34]),{20:97,21:$Vd,22:$Ve,97:$Vy,135:94,136:95},o($Vn,[2,189]),o($Vn,[2,190]),{54:[1,99],122:[1,98]},o($Vz,[2,280]),o($Vz,[2,281]),o($Vz,[2,282],{137:[1,100]}),o($Vb,[2,2]),o($Vb,[2,186],{128:101,131:[1,102]}),{28:103,29:$Vq},{20:36,21:$Vd,22:$Ve,25:104},{20:107,21:$Vd,22:$Ve,111:105,114:106},{102:[1,108]},{112:[1,109]},{74:[1,110]},o($Vb,[2,270]),{186:[1,111]},{186:[2,22]},o($Vb,[2,271]),o($Vb,[2,273]),o($Vb,[2,278]),o($Vf,[2,276]),o([5,6,29,54,76,109,117,129,130,131,151,152,153,154,155,156,158,162],[2,23]),{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,72:$Vj,74:$Vk,80:52,84:112,86:53,87:$Vl,91:54,92:$Vm,94:50},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,72:$Vj,74:$Vk,80:52,84:113,86:53,87:$Vl,91:54,92:$Vm,94:50},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,72:$Vj,74:$Vk,80:52,84:114,86:53,87:$Vl,91:54,92:$Vm,94:50},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,72:$Vj,74:$Vk,80:52,84:115,86:53,87:$Vl,91:54,92:$Vm,94:50},{76:[1,116],95:$Vr,96:$Vs,97:$Vt,98:$Vu},{74:[1,117]},{21:[1,119],88:118,90:[1,120]},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,72:$Vj,74:$Vk,76:[1,121],80:52,84:123,86:53,87:$Vl,91:54,92:$Vm,93:122,94:50},{54:[1,125],122:[1,126],138:124},o($Vz,[2,192]),o($Vz,[2,193]),o($Vz,[2,194],{137:[1,127]}),{20:36,21:$Vd,22:$Ve,25:128},{20:69,21:$Vd,22:$Ve,97:$Vo,194:129},{20:130,21:$Vd,22:$Ve},o($Vb,[2,181]),o($Vb,[2,187]),o($Vf,[2,183]),{102:[1,131],104:[1,132]},{54:[1,134],112:[1,133]},o($VA,[2,154]),{109:[1,135],115:[1,136]},{20:139,21:$Vd,22:$Ve,119:137,120:138},{20:142,21:$Vd,22:$Ve,123:140,124:141},{20:145,21:$Vd,22:$Ve,165:143,180:144},{20:36,21:$Vd,22:$Ve,25:146},o($VB,[2,127],{97:$Vt,98:$Vu}),o($VB,[2,128],{97:$Vt,98:$Vu}),o($Vv,[2,129]),o($Vv,[2,130]),o($Vv,[2,126]),{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,72:$Vj,74:$Vk,76:[2,113],80:52,82:147,84:148,86:53,87:$Vl,91:54,92:$Vm,94:50},{74:[1,149]},{74:[2,117]},{74:[2,118]},o($Vv,[2,121]),{76:[1,150]},{76:[2,124],95:$Vr,96:$Vs,97:$Vt,98:$Vu},{112:[2,197],139:151,140:[1,152]},{20:97,21:$Vd,22:$Ve,97:$Vy,136:153},{20:36,21:$Vd,22:$Ve,25:154},{20:155,21:$Vd,22:$Ve},o($VC,[2,284],{192:156,140:[1,157]}),o($Vz,[2,279]),o($Vz,[2,283]),{20:160,21:$Vd,22:$Ve,103:158,108:159},{74:$VD,105:161,107:162},{20:166,21:$Vd,22:$Ve,113:164,116:165},{20:107,21:$Vd,22:$Ve,114:167},{29:$Vg,31:$Vh,32:$Vi,36:$VE,37:$VF,39:56,41:55,44:169,46:$VG,47:170,48:175,49:[1,182],51:$VH,57:172,60:171,61:$VI,70:168,71:173,72:$VJ,74:$Vk,77:174,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50},{29:$VK,42:183},o($Vb,[2,167],{54:[1,185]}),o($VL,[2,169]),{109:[1,186]},o($Vb,[2,177]),o($Vb,[2,178],{117:[1,187]}),{109:[1,188]},{54:[1,189]},{54:[2,266]},{29:[1,191],181:[1,190]},o($Vb,[2,272]),{76:[1,192]},{76:[2,114],95:$Vr,96:$Vs,97:$Vt,98:$Vu},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,72:$Vj,74:$Vk,76:[2,119],80:52,84:194,86:53,87:$Vl,89:193,91:54,92:$Vm,94:50},o($Vv,[2,122]),{112:[1,196],142:195},{141:[1,197]},o($Vz,[2,191]),o([112,140],[2,196]),o($Vz,[2,195]),o($Vc,[2,287],{193:198,146:[1,199]}),{141:[1,200]},o($Vb,[2,136],{54:[1,201]}),o($VL,[2,144]),{109:[1,202]},o($Vb,[2,137],{54:[1,203]}),o($VL,[2,141]),{60:204,61:$VI},o($Vb,[2,152]),o($Vb,[2,164],{117:[1,205]}),{109:[1,206]},o($VA,[2,153]),o($VA,[2,155]),o($VA,[2,156]),o($VA,[2,157]),o($VA,[2,158]),o($VA,[2,159]),o($VA,[2,160]),o($VA,[2,161]),o($VA,[2,163]),o($VM,[2,41]),o($VM,[2,42]),o($VM,[2,44]),o($VN,$VO,{67:207,68:208,69:209,20:210,21:$Vd,22:$Ve,31:$VP,32:$VQ}),o($VR,$VS,{58:213,59:214,42:215,40:216,44:217,47:218,57:219,60:220,29:$VK,31:$VT,32:$VU,36:$VE,37:$VF,46:$VG,51:$VH,61:$VI}),{73:[1,223],78:[1,224],81:$Vw},o($VA,[2,45]),o($VA,[2,162]),o([5,6,53,54,112,117,129,130,131,146],[2,38]),{20:139,21:$Vd,22:$Ve,120:225},{29:$Vg,31:$Vh,32:$Vi,36:$VE,37:$VF,39:56,41:55,44:227,46:$VG,47:228,51:$VH,57:230,60:229,61:$VI,70:226,71:231,72:$VJ,74:$Vk,77:232,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50},{20:142,21:$Vd,22:$Ve,124:233},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:234,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50},{20:145,21:$Vd,22:$Ve,166:235,174:[1,237],180:236},{54:[2,267]},{54:[2,268]},o($Vv,[2,109],{24:[1,238]}),{76:[1,239]},{76:[2,120],95:$Vr,96:$Vs,97:$Vt,98:$Vu},o($VV,[2,202],{145:240,146:[1,241]}),{20:243,21:$Vd,22:$Ve,143:242},{20:244,21:$Vd,22:$Ve},o($Vc,[2,274]),{20:249,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:246,36:$VZ,37:$V_,38:247,150:$V$,195:245},{20:257,21:$Vd,22:$Ve},{20:160,21:$Vd,22:$Ve,108:258},{29:$Vg,31:$Vh,32:$Vi,36:$VE,37:$VF,39:56,41:55,44:260,46:$VG,47:261,51:$VH,57:263,60:262,61:$VI,70:259,71:264,72:$VJ,74:$Vk,77:265,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50},{74:$VD,107:266},{76:[1,267]},{20:166,21:$Vd,22:$Ve,116:268},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:269,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50},{54:[1,271],63:[1,270]},o($VN,[2,93]),{66:[1,272]},{66:[2,94]},{66:[2,95]},{66:[2,96]},{53:[1,273],54:[1,274]},o($VR,[2,58]),o($VR,[2,60]),o($VR,[2,61]),o($VR,[2,62]),o($VR,[2,63]),o($VR,[2,64]),o($VR,[2,65]),o($V01,[2,35]),o($V01,[2,36]),{74:[1,275]},{74:[1,276]},o($VL,[2,168]),o($VL,[2,170]),o($VL,[2,171]),o($VL,[2,172]),o($VL,[2,173]),o($VL,[2,174]),o($VL,[2,175]),o($VL,[2,176]),o($Vb,[2,179]),o($V11,[2,180]),{54:[1,278],76:[2,247],167:277},{54:[2,265]},{175:[1,279]},{21:[1,280]},o($Vv,[2,116]),o($VV,[2,203]),{20:285,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:282,36:$VZ,37:$V_,38:283,147:281,150:$V21},o($V31,[2,199],{117:[1,286]}),{109:[1,287]},{112:[2,198]},o($Vc,[2,286],{109:$V41,117:$V51,151:[1,289],152:$V61,153:$V71,154:$V81,155:$V91,156:$Va1,158:$Vb1,162:$Vc1}),o($Vd1,[2,288]),o($Vd1,[2,289]),o($Vd1,[2,290]),o($Vd1,[2,291]),o($Ve1,[2,27]),o($Ve1,[2,28]),o($Ve1,[2,31]),o($Ve1,[2,32]),o($Ve1,[2,24]),o($Ve1,[2,25]),o($Ve1,[2,26]),o($VC,[2,285]),o($VL,[2,143]),o($VL,[2,145]),o($VL,[2,146]),o($VL,[2,147]),o($VL,[2,148]),o($VL,[2,149]),o($VL,[2,150]),o($VL,[2,151]),o($VL,[2,140]),o($VL,[2,142]),o($Vb,[2,165]),o($V11,[2,166]),o([5,6,53,54,63,76,112],[2,91]),o($VN,$VO,{69:209,20:210,68:298,21:$Vd,22:$Ve,31:$VP,32:$VQ}),{29:$Vg,31:$Vh,32:$Vi,36:$VE,37:$VF,39:56,41:55,44:300,46:$VG,47:301,51:$VH,57:302,60:303,61:$VI,70:299,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50},o($VM,[2,56]),o($VR,$VS,{42:215,40:216,44:217,47:218,57:219,60:220,59:304,29:$VK,31:$VT,32:$VU,36:$VE,37:$VF,46:$VG,51:$VH,61:$VI}),{51:[1,305]},{51:[1,306]},{76:[1,307]},{141:$Vf1,168:308,169:309},{74:[1,311]},{74:[1,312]},o($VV,[2,201],{109:$Vg1,117:$Vh1,151:[1,314],152:$Vi1,153:$Vj1,154:$Vk1,155:$Vl1,156:$Vm1,158:$Vn1,162:$Vo1}),o($Ve1,[2,230]),o($Ve1,[2,231]),o($Ve1,[2,232]),o($Ve1,[2,233]),{20:324,21:$Vd,22:$Ve,144:323},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:326,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50,159:325},{20:249,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:246,36:$VZ,37:$V_,38:247,150:$V$,195:327},{20:249,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:246,36:$VZ,37:$V_,38:247,150:$V$,195:328},{20:249,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:246,36:$VZ,37:$V_,38:247,150:$V$,195:329},{20:249,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:246,36:$VZ,37:$V_,38:247,150:$V$,195:330},{20:249,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:246,36:$VZ,37:$V_,38:247,150:$V$,195:331},{20:249,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:246,36:$VZ,37:$V_,38:247,150:$V$,195:332},{20:249,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:246,36:$VZ,37:$V_,38:247,150:$V$,195:333},{28:335,29:$Vq,30:336,31:$VW,32:$VX,33:$VY,157:334},{30:337,31:$VW,32:$VX,33:$VY},{28:339,29:$Vq,30:338,31:$VW,32:$VX,33:$VY,36:$VZ,37:$V_,38:340},o($VN,[2,92]),o($VN,[2,98]),o($VN,[2,99]),o($VN,[2,100]),o($VN,[2,101]),o($VN,[2,102]),o($VR,[2,57]),{31:$Vh,32:$Vi,39:342,75:341},{29:$Vg,41:344,79:343},o($Vb,[2,246]),{54:[1,345],76:[2,248]},o($Vp1,[2,250]),{20:346,21:$Vd,22:$Ve},{20:347,21:$Vd,22:$Ve},{76:[1,348]},{20:285,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:282,36:$VZ,37:$V_,38:283,147:349,150:$V21},{20:285,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:282,36:$VZ,37:$V_,38:283,147:350,150:$V21},{20:285,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:282,36:$VZ,37:$V_,38:283,147:351,150:$V21},{20:285,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:282,36:$VZ,37:$V_,38:283,147:352,150:$V21},{20:285,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:282,36:$VZ,37:$V_,38:283,147:353,150:$V21},{20:285,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:282,36:$VZ,37:$V_,38:283,147:354,150:$V21},{20:285,21:$Vd,22:$Ve,28:250,29:$Vq,30:251,31:$VW,32:$VX,33:$VY,34:282,36:$VZ,37:$V_,38:283,147:355,150:$V21},{28:335,29:$Vq,30:336,31:$VW,32:$VX,33:$VY,157:356},{30:357,31:$VW,32:$VX,33:$VY},{28:359,29:$Vq,30:358,31:$VW,32:$VX,33:$VY,36:$VZ,37:$V_,38:360},o($V31,[2,200]),{109:[1,361],152:[1,362],153:[1,363],154:[1,364],155:[1,365],156:[1,366],158:[1,367]},o($Vq1,[2,216]),o($Vq1,[2,217]),o([5,6,117,129,131,151],[2,292],{109:$V41,152:$V61,153:$V71,154:$V81,155:$V91,156:$Va1,158:$Vb1,162:$Vc1}),o([5,6,129,131,151],[2,293],{109:$V41,117:$V51,152:$V61,153:$V71,154:$V81,155:$V91,156:$Va1,158:$Vb1,162:$Vc1}),o([5,6,109,117,129,131,151,156,158,162],[2,294],{152:$V61,153:$V71,154:$V81,155:$V91}),o($Vd1,[2,295]),o($Vd1,[2,296]),o($Vd1,[2,297]),o($Vd1,[2,298]),o($Vd1,[2,299]),{117:[1,368]},{117:[1,369]},o($Vd1,[2,300]),o($Vd1,[2,301]),o($Vd1,[2,302]),o($Vd1,[2,303]),{53:[1,370],54:[1,371]},o($VR,[2,105]),{53:[1,372],54:[1,373]},o($VR,[2,108]),{141:$Vf1,169:374},{170:[1,375],172:[1,376]},{54:[1,378],76:[1,377]},o($Vv,[2,110]),o([5,6,117,129,130,131,151],[2,234],{109:$Vg1,152:$Vi1,153:$Vj1,154:$Vk1,155:$Vl1,156:$Vm1,158:$Vn1,162:$Vo1}),o([5,6,129,130,131,151],[2,235],{109:$Vg1,117:$Vh1,152:$Vi1,153:$Vj1,154:$Vk1,155:$Vl1,156:$Vm1,158:$Vn1,162:$Vo1}),o([5,6,109,117,129,130,131,151,156,158,162],[2,236],{152:$Vi1,153:$Vj1,154:$Vk1,155:$Vl1}),o($Ve1,[2,237]),o($Ve1,[2,238]),o($Ve1,[2,239]),o($Ve1,[2,240]),o($Ve1,[2,241]),o($Ve1,[2,242]),o($Ve1,[2,243]),o($Ve1,[2,244]),o($Ve1,[2,245]),{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:380,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50,160:379},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:380,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50,160:381},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:380,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50,160:382},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:380,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50,160:383},{29:$Vg,31:$Vh,32:$Vi,39:56,41:55,70:380,72:$Vj,74:$Vk,80:52,84:49,86:53,87:$Vl,91:54,92:$Vm,94:50,160:384},{29:$VK,31:$VT,32:$VU,40:387,42:386,161:385},{31:$VT,32:$VU,40:388},{28:389,29:$Vq},{30:390,31:$VW,32:$VX,33:$VY},{76:[1,391]},{31:$Vh,32:$Vi,39:392},{76:[1,393]},{29:$Vg,41:394},o($Vp1,[2,249]),{74:[1,395]},{74:[1,396]},o($Vp1,$Vr1,{173:397,176:$Vs1}),{20:399,21:$Vd,22:$Ve},o($V31,[2,218]),o($V31,[2,225]),o($V31,[2,219]),o($V31,[2,220]),o($V31,[2,221]),o($V31,[2,222]),o($V31,[2,223]),{117:[1,400]},{117:[1,401]},o($V31,[2,224]),o($Ve1,[2,228]),o($Ve1,[2,229]),o($Vt1,[2,103]),o($VR,[2,104]),o($Vt1,[2,106]),o($VR,[2,107]),{20:402,21:$Vd,22:$Ve},{20:403,21:$Vd,22:$Ve},o($Vp1,[2,255]),{28:404,29:$Vq},{76:[1,405]},{29:$VK,42:406},{31:$VT,32:$VU,40:407},{54:[1,409],76:[1,408]},{54:[1,411],76:[1,410]},{28:412,29:$Vq},o($Vp1,$Vr1,{173:413,176:$Vs1}),o($V31,[2,226]),o($V31,[2,227]),o($Vp1,$Vu1,{171:414,177:$Vv1}),{20:416,21:$Vd,22:$Ve},o($Vw1,$Vu1,{171:417,177:$Vv1}),{20:418,21:$Vd,22:$Ve},o($Vp1,[2,258]),o($Vp1,[2,256]),o($Vp1,[2,251]),{74:[1,421],134:[1,419],178:[1,420]},{76:[1,422]},o($Vp1,$Vr1,{173:423,176:$Vs1}),{76:[1,424]},o($Vw1,[2,260]),o($Vw1,[2,261]),{20:426,21:$Vd,22:$Ve,179:425},o($Vp1,$Vu1,{171:427,177:$Vv1}),o($Vp1,[2,252]),o($Vw1,$Vu1,{171:428,177:$Vv1}),{54:[1,430],76:[1,429]},o($Vp1,[2,264]),o($Vp1,[2,253]),o($Vp1,$Vr1,{173:431,176:$Vs1}),o($Vw1,[2,262]),{20:432,21:$Vd,22:$Ve},o($Vp1,[2,254]),o($Vp1,[2,263])],
defaultActions: {29:[2,1],34:[2,139],80:[2,22],119:[2,117],120:[2,118],144:[2,266],190:[2,267],191:[2,268],210:[2,94],211:[2,95],212:[2,96],236:[2,265],244:[2,198]},
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
case 10:return 117
break;
case 11:return 137
break;
case 12:return 'ASC'
break;
case 13:return 'ATTACH'
break;
case 14:return 'BEFORE'
break;
case 15:return 'BEGIN'
break;
case 16:return 156
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
case 25:return 131
break;
case 26:return 'CONSTRAINT'
break;
case 27:return 163
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
case 36:return 121
break;
case 37:return 130
break;
case 38:return 'DETACH'
break;
case 39:return 133
break;
case 40:return 184
break;
case 41:return 185
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
case 53:return 122
break;
case 54:return 'FULL'
break;
case 55:return 'GLOB'
break;
case 56:return 'GROUP'
break;
case 57:return 146
break;
case 58:return 'IF'
break;
case 59:return 106
break;
case 60:return 'IMMEDIATE'
break;
case 61:return 'IN'
break;
case 62:return 140
break;
case 63:return 141
break;
case 64:return 'INDEXED'
break;
case 65:return 'INITIALLY'
break;
case 66:return 'INNER'
break;
case 67:return 99
break;
case 68:return 'INSTEAD'
break;
case 69:return 'INTERSECT'
break;
case 70:return 101
break;
case 71:return 'IS'
break;
case 72:return 'ISNULL'
break;
case 73:return 'JOIN'
break;
case 74:return 175
break;
case 75:return 'LEFT'
break;
case 76:return 158
break;
case 77:return 162
break;
case 78:return 129
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
case 88:return 186
break;
case 89:return 151
break;
case 90:return 'ORDER'
break;
case 91:return 'OUTER'
break;
case 92:return 'PLAN'
break;
case 93:return 'PRAGMA'
break;
case 94:return 174
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
case 103:return 118
break;
case 104:return 'RESTRICT'
break;
case 105:return 'RIGHT'
break;
case 106:return 'ROLLBACK'
break;
case 107:return 'ROW'
break;
case 108:return 148
break;
case 109:return 190
break;
case 110:return 102
break;
case 111:return 164
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
case 118:return 110
break;
case 119:return 'USING'
break;
case 120:return 'VACUUM'
break;
case 121:return 104
break;
case 122:return 'VIEW'
break;
case 123:return 'WHEN'
break;
case 124:return 112
break;
case 125:return 'WITH'
break;
case 126:return 36
break;
case 127:return 37
break;
case 128:return 182
break;
case 129:return 183
break;
case 130:return 181
break;
case 131:return 29
break;
case 132:return 73
break;
case 133:return 78
break;
case 134:return 'BINARYSET'
break;
case 135:return 176
break;
case 136:return 172
break;
case 137:return 170
break;
case 138:return 177
break;
case 139:return 134
break;
case 140:return 178
break;
case 141:return 72
break;
case 142:return 196
break;
case 143:return 'ALLOCATE'
break;
case 144:return 'ALTER'
break;
case 145:return 'ANALYZE'
break;
case 146:return 117
break;
case 147:return 'ANY'
break;
case 148:return 'ARCHIVE'
break;
case 149:return 'ARE'
break;
case 150:return 'ARRAY'
break;
case 151:return 137
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
case 172:return 156
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
case 232:return 163
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
case 240:return 81
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
case 253:return 121
break;
case 254:return 'DELIMITED'
break;
case 255:return 'DEPTH'
break;
case 256:return 'DEREF'
break;
case 257:return 130
break;
case 258:return 185
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
case 266:return 133
break;
case 267:return 'DISTRIBUTE'
break;
case 268:return 'DO'
break;
case 269:return 'DOMAIN'
break;
case 270:return 'DOUBLE'
break;
case 271:return 184
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
case 326:return 122
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
case 344:return 146
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
case 352:return 106
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
case 360:return 141
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
case 372:return 99
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
case 378:return 101
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
case 386:return 175
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
case 400:return 158
break;
case 401:return 129
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
case 428:return 96
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
case 445:return 72
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
case 459:return 186
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
case 466:return 151
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
case 499:return 174
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
case 506:return 177
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
case 515:return 90
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
case 538:return 118
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
case 566:return 190
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
case 575:return 148
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
case 583:return 102
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
case 589:return 182
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
case 618:return 181
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
case 631:return 164
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
case 639:return 176
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
case 672:return 110
break;
case 673:return 'UPPER'
break;
case 674:return 'URL'
break;
case 675:return 'USAGE'
break;
case 676:return 140
break;
case 677:return 'USER'
break;
case 678:return 'USERS'
break;
case 679:return 'USING'
break;
case 680:return 92
break;
case 681:return 'VACUUM'
break;
case 682:return 'VALUE'
break;
case 683:return 'VALUED'
break;
case 684:return 104
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
case 697:return 112
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
case 709:return 87
break;
case 710:return 92
break;
case 711:return 29
break;
case 712:return 29
break;
case 713:return 'TILDEs'
break;
case 714:return 115
break;
case 715:return 95
break;
case 716:return 96
break;
case 717:return 97
break;
case 718:return 98
break;
case 719:return 'REM'
break;
case 720:return 'RSHIFT'
break;
case 721:return 'LSHIFT'
break;
case 722:return 'NE'
break;
case 723:return 'NE'
break;
case 724:return 153
break;
case 725:return 152
break;
case 726:return 155
break;
case 727:return 154
break;
case 728:return 109
break;
case 729:return 'BITAND'
break;
case 730:return 'BITOR'
break;
case 731:return 74
break;
case 732:return 76
break;
case 733:return 61
break;
case 734:return 63
break;
case 735:return 51
break;
case 736:return 53
break;
case 737:return 24
break;
case 738:return 54
break;
case 739:return 66
break;
case 740:return 6
break;
case 741:return 'DOLLAR'
break;
case 742:return 'QUESTION'
break;
case 743:return 'CARET'
break;
case 744:return 21
break;
case 745:return 5
break;
case 746:return 'INVALID'
break;
}
},
rules: [/^(?:([`](\\.|[^"]|\\")*?[`])+)/i,/^(?:(['](\\.|[^']|\\')*?['])+)/i,/^(?:(["](\\.|[^"]|\\")*?["])+)/i,/^(?:--(.*?)($|\r\n|\r|\n))/i,/^(?:\s+)/i,/^(?:ABORT\b)/i,/^(?:ADD\b)/i,/^(?:AFTER\b)/i,/^(?:ALTER\b)/i,/^(?:ANALYZE\b)/i,/^(?:AND\b)/i,/^(?:AS\b)/i,/^(?:ASC\b)/i,/^(?:ATTACH\b)/i,/^(?:BEFORE\b)/i,/^(?:BEGIN\b)/i,/^(?:BETWEEN\b)/i,/^(?:BY\b)/i,/^(?:CASCADE\b)/i,/^(?:CASE\b)/i,/^(?:CAST\b)/i,/^(?:CHECK\b)/i,/^(?:COLLATE\b)/i,/^(?:COLUMN\b)/i,/^(?:CONFLICT\b)/i,/^(?:CONSISTENT_READ\b)/i,/^(?:CONSTRAINT\b)/i,/^(?:CREATE\b)/i,/^(?:CROSS\b)/i,/^(?:CURRENT_DATE\b)/i,/^(?:CURRENT_TIME\b)/i,/^(?:CURRENT_TIMESTAMP\b)/i,/^(?:DATABASE\b)/i,/^(?:DEFAULT\b)/i,/^(?:DEFERRABLE\b)/i,/^(?:DEFERRED\b)/i,/^(?:DELETE\b)/i,/^(?:DESC\b)/i,/^(?:DETACH\b)/i,/^(?:DISTINCT\b)/i,/^(?:DROP\b)/i,/^(?:DESCRIBE\b)/i,/^(?:EACH\b)/i,/^(?:ELSE\b)/i,/^(?:END\b)/i,/^(?:ESCAPE\b)/i,/^(?:EXCEPT\b)/i,/^(?:EXCLUSIVE\b)/i,/^(?:EXISTS\b)/i,/^(?:EXPLAIN\b)/i,/^(?:FAIL\b)/i,/^(?:FOR\b)/i,/^(?:FOREIGN\b)/i,/^(?:FROM\b)/i,/^(?:FULL\b)/i,/^(?:GLOB\b)/i,/^(?:GROUP\b)/i,/^(?:HAVING\b)/i,/^(?:IF\b)/i,/^(?:IGNORE\b)/i,/^(?:IMMEDIATE\b)/i,/^(?:IN\b)/i,/^(?:USE\b)/i,/^(?:INDEX\b)/i,/^(?:INDEXED\b)/i,/^(?:INITIALLY\b)/i,/^(?:INNER\b)/i,/^(?:INSERT\b)/i,/^(?:INSTEAD\b)/i,/^(?:INTERSECT\b)/i,/^(?:INTO\b)/i,/^(?:IS\b)/i,/^(?:ISNULL\b)/i,/^(?:JOIN\b)/i,/^(?:KEY\b)/i,/^(?:LEFT\b)/i,/^(?:LIKE\b)/i,/^(?:CONTAINS\b)/i,/^(?:LIMIT\b)/i,/^(?:MATCH\b)/i,/^(?:NATURAL\b)/i,/^(?:NO\b)/i,/^(?:NOT\b)/i,/^(?:NOTNULL\b)/i,/^(?:NULL\b)/i,/^(?:UNDEFINED\b)/i,/^(?:OF\b)/i,/^(?:OFFSET\b)/i,/^(?:ON\b)/i,/^(?:OR\b)/i,/^(?:ORDER\b)/i,/^(?:OUTER\b)/i,/^(?:PLAN\b)/i,/^(?:PRAGMA\b)/i,/^(?:PRIMARY\b)/i,/^(?:QUERY\b)/i,/^(?:RAISE\b)/i,/^(?:RECURSIVE\b)/i,/^(?:REFERENCES\b)/i,/^(?:REGEXP\b)/i,/^(?:REINDEX\b)/i,/^(?:RELEASE\b)/i,/^(?:RENAME\b)/i,/^(?:REPLACE\b)/i,/^(?:RESTRICT\b)/i,/^(?:RIGHT\b)/i,/^(?:ROLLBACK\b)/i,/^(?:ROW\b)/i,/^(?:SELECT\b)/i,/^(?:SCAN\b)/i,/^(?:SET\b)/i,/^(?:TABLE\b)/i,/^(?:TEMP\b)/i,/^(?:THEN\b)/i,/^(?:TO\b)/i,/^(?:TRIGGER\b)/i,/^(?:UNION\b)/i,/^(?:UNIQUE\b)/i,/^(?:UPDATE\b)/i,/^(?:USING\b)/i,/^(?:VACUUM\b)/i,/^(?:VALUES\b)/i,/^(?:VIEW\b)/i,/^(?:WHEN\b)/i,/^(?:WHERE\b)/i,/^(?:WITH\b)/i,/^(?:TRUE\b)/i,/^(?:FALSE\b)/i,/^(?:SHOW\b)/i,/^(?:TABLES\b)/i,/^(?:STRING\b)/i,/^(?:NUMBER\b)/i,/^(?:STRINGSET\b)/i,/^(?:NUMBERSET\b)/i,/^(?:BINARYSET\b)/i,/^(?:THROUGHPUT\b)/i,/^(?:GSI\b)/i,/^(?:LSI\b)/i,/^(?:PROJECTION\b)/i,/^(?:ALL\b)/i,/^(?:KEYS_ONLY\b)/i,/^(?:NEW\b)/i,/^(?:DEBUG\b)/i,/^(?:ALLOCATE\b)/i,/^(?:ALTER\b)/i,/^(?:ANALYZE\b)/i,/^(?:AND\b)/i,/^(?:ANY\b)/i,/^(?:ARCHIVE\b)/i,/^(?:ARE\b)/i,/^(?:ARRAY\b)/i,/^(?:AS\b)/i,/^(?:ASC\b)/i,/^(?:ASCII\b)/i,/^(?:ASENSITIVE\b)/i,/^(?:ASSERTION\b)/i,/^(?:ASYMMETRIC\b)/i,/^(?:AT\b)/i,/^(?:ATOMIC\b)/i,/^(?:ATTACH\b)/i,/^(?:ATTRIBUTE\b)/i,/^(?:AUTH\b)/i,/^(?:AUTHORIZATION\b)/i,/^(?:AUTHORIZE\b)/i,/^(?:AUTO\b)/i,/^(?:AVG\b)/i,/^(?:BACK\b)/i,/^(?:BACKUP\b)/i,/^(?:BASE\b)/i,/^(?:BATCH\b)/i,/^(?:BEFORE\b)/i,/^(?:BEGIN\b)/i,/^(?:BETWEEN\b)/i,/^(?:BIGINT\b)/i,/^(?:BINARY\b)/i,/^(?:BIT\b)/i,/^(?:BLOB\b)/i,/^(?:BLOCK\b)/i,/^(?:BOOLEAN\b)/i,/^(?:BOTH\b)/i,/^(?:BREADTH\b)/i,/^(?:BUCKET\b)/i,/^(?:BULK\b)/i,/^(?:BY\b)/i,/^(?:BYTE\b)/i,/^(?:CALL\b)/i,/^(?:CALLED\b)/i,/^(?:CALLING\b)/i,/^(?:CAPACITY\b)/i,/^(?:CASCADE\b)/i,/^(?:CASCADED\b)/i,/^(?:CASE\b)/i,/^(?:CAST\b)/i,/^(?:CATALOG\b)/i,/^(?:CHAR\b)/i,/^(?:CHARACTER\b)/i,/^(?:CHECK\b)/i,/^(?:CLASS\b)/i,/^(?:CLOB\b)/i,/^(?:CLOSE\b)/i,/^(?:CLUSTER\b)/i,/^(?:CLUSTERED\b)/i,/^(?:CLUSTERING\b)/i,/^(?:CLUSTERS\b)/i,/^(?:COALESCE\b)/i,/^(?:COLLATE\b)/i,/^(?:COLLATION\b)/i,/^(?:COLLECTION\b)/i,/^(?:COLUMN\b)/i,/^(?:COLUMNS\b)/i,/^(?:COMBINE\b)/i,/^(?:COMMENT\b)/i,/^(?:COMMIT\b)/i,/^(?:COMPACT\b)/i,/^(?:COMPILE\b)/i,/^(?:COMPRESS\b)/i,/^(?:CONDITION\b)/i,/^(?:CONFLICT\b)/i,/^(?:CONNECT\b)/i,/^(?:CONNECTION\b)/i,/^(?:CONSISTENCY\b)/i,/^(?:CONSISTENT\b)/i,/^(?:CONSTRAINT\b)/i,/^(?:CONSTRAINTS\b)/i,/^(?:CONSTRUCTOR\b)/i,/^(?:CONSUMED\b)/i,/^(?:CONTINUE\b)/i,/^(?:CONVERT\b)/i,/^(?:COPY\b)/i,/^(?:CORRESPONDING\b)/i,/^(?:COUNT\b)/i,/^(?:COUNTER\b)/i,/^(?:CREATE\b)/i,/^(?:CROSS\b)/i,/^(?:CUBE\b)/i,/^(?:CURRENT\b)/i,/^(?:CURSOR\b)/i,/^(?:CYCLE\b)/i,/^(?:DATA\b)/i,/^(?:DATABASE\b)/i,/^(?:DATE\b)/i,/^(?:DATETIME\b)/i,/^(?:DAY\b)/i,/^(?:DEALLOCATE\b)/i,/^(?:DEC\b)/i,/^(?:DECIMAL\b)/i,/^(?:DECLARE\b)/i,/^(?:DEFAULT\b)/i,/^(?:DEFERRABLE\b)/i,/^(?:DEFERRED\b)/i,/^(?:DEFINE\b)/i,/^(?:DEFINED\b)/i,/^(?:DEFINITION\b)/i,/^(?:DELETE\b)/i,/^(?:DELIMITED\b)/i,/^(?:DEPTH\b)/i,/^(?:DEREF\b)/i,/^(?:DESC\b)/i,/^(?:DESCRIBE\b)/i,/^(?:DESCRIPTOR\b)/i,/^(?:DETACH\b)/i,/^(?:DETERMINISTIC\b)/i,/^(?:DIAGNOSTICS\b)/i,/^(?:DIRECTORIES\b)/i,/^(?:DISABLE\b)/i,/^(?:DISCONNECT\b)/i,/^(?:DISTINCT\b)/i,/^(?:DISTRIBUTE\b)/i,/^(?:DO\b)/i,/^(?:DOMAIN\b)/i,/^(?:DOUBLE\b)/i,/^(?:DROP\b)/i,/^(?:DUMP\b)/i,/^(?:DURATION\b)/i,/^(?:DYNAMIC\b)/i,/^(?:EACH\b)/i,/^(?:ELEMENT\b)/i,/^(?:ELSE\b)/i,/^(?:ELSEIF\b)/i,/^(?:EMPTY\b)/i,/^(?:ENABLE\b)/i,/^(?:END\b)/i,/^(?:EQUAL\b)/i,/^(?:EQUALS\b)/i,/^(?:ERROR\b)/i,/^(?:ESCAPE\b)/i,/^(?:ESCAPED\b)/i,/^(?:EVAL\b)/i,/^(?:EVALUATE\b)/i,/^(?:EXCEEDED\b)/i,/^(?:EXCEPT\b)/i,/^(?:EXCEPTION\b)/i,/^(?:EXCEPTIONS\b)/i,/^(?:EXCLUSIVE\b)/i,/^(?:EXEC\b)/i,/^(?:EXECUTE\b)/i,/^(?:EXISTS\b)/i,/^(?:EXIT\b)/i,/^(?:EXPLAIN\b)/i,/^(?:EXPLODE\b)/i,/^(?:EXPORT\b)/i,/^(?:EXPRESSION\b)/i,/^(?:EXTENDED\b)/i,/^(?:EXTERNAL\b)/i,/^(?:EXTRACT\b)/i,/^(?:FAIL\b)/i,/^(?:FALSE\b)/i,/^(?:FAMILY\b)/i,/^(?:FETCH\b)/i,/^(?:FIELDS\b)/i,/^(?:FILE\b)/i,/^(?:FILTER\b)/i,/^(?:FILTERING\b)/i,/^(?:FINAL\b)/i,/^(?:FINISH\b)/i,/^(?:FIRST\b)/i,/^(?:FIXED\b)/i,/^(?:FLATTERN\b)/i,/^(?:FLOAT\b)/i,/^(?:FOR\b)/i,/^(?:FORCE\b)/i,/^(?:FOREIGN\b)/i,/^(?:FORMAT\b)/i,/^(?:FORWARD\b)/i,/^(?:FOUND\b)/i,/^(?:FREE\b)/i,/^(?:FROM\b)/i,/^(?:FULL\b)/i,/^(?:FUNCTION\b)/i,/^(?:FUNCTIONS\b)/i,/^(?:GENERAL\b)/i,/^(?:GENERATE\b)/i,/^(?:GET\b)/i,/^(?:GLOB\b)/i,/^(?:GLOBAL\b)/i,/^(?:GO\b)/i,/^(?:GOTO\b)/i,/^(?:GRANT\b)/i,/^(?:GREATER\b)/i,/^(?:GROUP\b)/i,/^(?:GROUPING\b)/i,/^(?:HANDLER\b)/i,/^(?:HASH\b)/i,/^(?:HAVE\b)/i,/^(?:HAVING\b)/i,/^(?:HEAP\b)/i,/^(?:HIDDEN\b)/i,/^(?:HOLD\b)/i,/^(?:HOUR\b)/i,/^(?:IDENTIFIED\b)/i,/^(?:IDENTITY\b)/i,/^(?:IF\b)/i,/^(?:IGNORE\b)/i,/^(?:IMMEDIATE\b)/i,/^(?:IMPORT\b)/i,/^(?:IN\b)/i,/^(?:INCLUDING\b)/i,/^(?:INCLUSIVE\b)/i,/^(?:INCREMENT\b)/i,/^(?:INCREMENTAL\b)/i,/^(?:INDEX\b)/i,/^(?:INDEXED\b)/i,/^(?:INDEXES\b)/i,/^(?:INDICATOR\b)/i,/^(?:INFINITE\b)/i,/^(?:INITIALLY\b)/i,/^(?:INLINE\b)/i,/^(?:INNER\b)/i,/^(?:INNTER\b)/i,/^(?:INOUT\b)/i,/^(?:INPUT\b)/i,/^(?:INSENSITIVE\b)/i,/^(?:INSERT\b)/i,/^(?:INSTEAD\b)/i,/^(?:INT\b)/i,/^(?:INTEGER\b)/i,/^(?:INTERSECT\b)/i,/^(?:INTERVAL\b)/i,/^(?:INTO\b)/i,/^(?:INVALIDATE\b)/i,/^(?:IS\b)/i,/^(?:ISOLATION\b)/i,/^(?:ITEM\b)/i,/^(?:ITEMS\b)/i,/^(?:ITERATE\b)/i,/^(?:JOIN\b)/i,/^(?:KEY\b)/i,/^(?:KEYS\b)/i,/^(?:LAG\b)/i,/^(?:LANGUAGE\b)/i,/^(?:LARGE\b)/i,/^(?:LAST\b)/i,/^(?:LATERAL\b)/i,/^(?:LEAD\b)/i,/^(?:LEADING\b)/i,/^(?:LEAVE\b)/i,/^(?:LEFT\b)/i,/^(?:LENGTH\b)/i,/^(?:LESS\b)/i,/^(?:LEVEL\b)/i,/^(?:LIKE\b)/i,/^(?:LIMIT\b)/i,/^(?:LIMITED\b)/i,/^(?:LINES\b)/i,/^(?:LIST\b)/i,/^(?:LOAD\b)/i,/^(?:LOCAL\b)/i,/^(?:LOCALTIME\b)/i,/^(?:LOCALTIMESTAMP\b)/i,/^(?:LOCATION\b)/i,/^(?:LOCATOR\b)/i,/^(?:LOCK\b)/i,/^(?:LOCKS\b)/i,/^(?:LOG\b)/i,/^(?:LOGED\b)/i,/^(?:LONG\b)/i,/^(?:LOOP\b)/i,/^(?:LOWER\b)/i,/^(?:MAP\b)/i,/^(?:MATCH\b)/i,/^(?:MATERIALIZED\b)/i,/^(?:MAX\b)/i,/^(?:MAXLEN\b)/i,/^(?:MEMBER\b)/i,/^(?:MERGE\b)/i,/^(?:METHOD\b)/i,/^(?:METRICS\b)/i,/^(?:MIN\b)/i,/^(?:MINUS\b)/i,/^(?:MINUTE\b)/i,/^(?:MISSING\b)/i,/^(?:MOD\b)/i,/^(?:MODE\b)/i,/^(?:MODIFIES\b)/i,/^(?:MODIFY\b)/i,/^(?:MODULE\b)/i,/^(?:MONTH\b)/i,/^(?:MULTI\b)/i,/^(?:MULTISET\b)/i,/^(?:NAME\b)/i,/^(?:NAMES\b)/i,/^(?:NATIONAL\b)/i,/^(?:NATURAL\b)/i,/^(?:NCHAR\b)/i,/^(?:NCLOB\b)/i,/^(?:NEW\b)/i,/^(?:NEXT\b)/i,/^(?:NO\b)/i,/^(?:NONE\b)/i,/^(?:NOT\b)/i,/^(?:NULL\b)/i,/^(?:NULLIF\b)/i,/^(?:NUMBER\b)/i,/^(?:NUMERIC\b)/i,/^(?:OBJECT\b)/i,/^(?:OF\b)/i,/^(?:OFFLINE\b)/i,/^(?:OFFSET\b)/i,/^(?:OLD\b)/i,/^(?:ON\b)/i,/^(?:ONLINE\b)/i,/^(?:ONLY\b)/i,/^(?:OPAQUE\b)/i,/^(?:OPEN\b)/i,/^(?:OPERATOR\b)/i,/^(?:OPTION\b)/i,/^(?:OR\b)/i,/^(?:ORDER\b)/i,/^(?:ORDINALITY\b)/i,/^(?:OTHER\b)/i,/^(?:OTHERS\b)/i,/^(?:OUT\b)/i,/^(?:OUTER\b)/i,/^(?:OUTPUT\b)/i,/^(?:OVER\b)/i,/^(?:OVERLAPS\b)/i,/^(?:OVERRIDE\b)/i,/^(?:OWNER\b)/i,/^(?:PAD\b)/i,/^(?:PARALLEL\b)/i,/^(?:PARAMETER\b)/i,/^(?:PARAMETERS\b)/i,/^(?:PARTIAL\b)/i,/^(?:PARTITION\b)/i,/^(?:PARTITIONED\b)/i,/^(?:PARTITIONS\b)/i,/^(?:PATH\b)/i,/^(?:PERCENT\b)/i,/^(?:PERCENTILE\b)/i,/^(?:PERMISSION\b)/i,/^(?:PERMISSIONS\b)/i,/^(?:PIPE\b)/i,/^(?:PIPELINED\b)/i,/^(?:PLAN\b)/i,/^(?:POOL\b)/i,/^(?:POSITION\b)/i,/^(?:PRECISION\b)/i,/^(?:PREPARE\b)/i,/^(?:PRESERVE\b)/i,/^(?:PRIMARY\b)/i,/^(?:PRIOR\b)/i,/^(?:PRIVATE\b)/i,/^(?:PRIVILEGES\b)/i,/^(?:PROCEDURE\b)/i,/^(?:PROCESSED\b)/i,/^(?:PROJECT\b)/i,/^(?:PROJECTION\b)/i,/^(?:PROPERTY\b)/i,/^(?:PROVISIONING\b)/i,/^(?:PUBLIC\b)/i,/^(?:PUT\b)/i,/^(?:QUERY\b)/i,/^(?:QUIT\b)/i,/^(?:QUORUM\b)/i,/^(?:RAISE\b)/i,/^(?:RANDOM\b)/i,/^(?:RANGE\b)/i,/^(?:RANK\b)/i,/^(?:RAW\b)/i,/^(?:READ\b)/i,/^(?:READS\b)/i,/^(?:REAL\b)/i,/^(?:REBUILD\b)/i,/^(?:RECORD\b)/i,/^(?:RECURSIVE\b)/i,/^(?:REDUCE\b)/i,/^(?:REF\b)/i,/^(?:REFERENCE\b)/i,/^(?:REFERENCES\b)/i,/^(?:REFERENCING\b)/i,/^(?:REGEXP\b)/i,/^(?:REGION\b)/i,/^(?:REINDEX\b)/i,/^(?:RELATIVE\b)/i,/^(?:RELEASE\b)/i,/^(?:REMAINDER\b)/i,/^(?:RENAME\b)/i,/^(?:REPEAT\b)/i,/^(?:REPLACE\b)/i,/^(?:REQUEST\b)/i,/^(?:RESET\b)/i,/^(?:RESIGNAL\b)/i,/^(?:RESOURCE\b)/i,/^(?:RESPONSE\b)/i,/^(?:RESTORE\b)/i,/^(?:RESTRICT\b)/i,/^(?:RESULT\b)/i,/^(?:RETURN\b)/i,/^(?:RETURNING\b)/i,/^(?:RETURNS\b)/i,/^(?:REVERSE\b)/i,/^(?:REVOKE\b)/i,/^(?:RIGHT\b)/i,/^(?:ROLE\b)/i,/^(?:ROLES\b)/i,/^(?:ROLLBACK\b)/i,/^(?:ROLLUP\b)/i,/^(?:ROUTINE\b)/i,/^(?:ROW\b)/i,/^(?:ROWS\b)/i,/^(?:RULE\b)/i,/^(?:RULES\b)/i,/^(?:SAMPLE\b)/i,/^(?:SATISFIES\b)/i,/^(?:SAVE\b)/i,/^(?:SAVEPOINT\b)/i,/^(?:SCAN\b)/i,/^(?:SCHEMA\b)/i,/^(?:SCOPE\b)/i,/^(?:SCROLL\b)/i,/^(?:SEARCH\b)/i,/^(?:SECOND\b)/i,/^(?:SECTION\b)/i,/^(?:SEGMENT\b)/i,/^(?:SEGMENTS\b)/i,/^(?:SELECT\b)/i,/^(?:SELF\b)/i,/^(?:SEMI\b)/i,/^(?:SENSITIVE\b)/i,/^(?:SEPARATE\b)/i,/^(?:SEQUENCE\b)/i,/^(?:SERIALIZABLE\b)/i,/^(?:SESSION\b)/i,/^(?:SET\b)/i,/^(?:SETS\b)/i,/^(?:SHARD\b)/i,/^(?:SHARE\b)/i,/^(?:SHARED\b)/i,/^(?:SHORT\b)/i,/^(?:SHOW\b)/i,/^(?:SIGNAL\b)/i,/^(?:SIMILAR\b)/i,/^(?:SIZE\b)/i,/^(?:SKEWED\b)/i,/^(?:SMALLINT\b)/i,/^(?:SNAPSHOT\b)/i,/^(?:SOME\b)/i,/^(?:SOURCE\b)/i,/^(?:SPACE\b)/i,/^(?:SPACES\b)/i,/^(?:SPARSE\b)/i,/^(?:SPECIFIC\b)/i,/^(?:SPECIFICTYPE\b)/i,/^(?:SPLIT\b)/i,/^(?:SQL\b)/i,/^(?:SQLCODE\b)/i,/^(?:SQLERROR\b)/i,/^(?:SQLEXCEPTION\b)/i,/^(?:SQLSTATE\b)/i,/^(?:SQLWARNING\b)/i,/^(?:START\b)/i,/^(?:STATE\b)/i,/^(?:STATIC\b)/i,/^(?:STATUS\b)/i,/^(?:STORAGE\b)/i,/^(?:STORE\b)/i,/^(?:STORED\b)/i,/^(?:STREAM\b)/i,/^(?:STRING\b)/i,/^(?:STRUCT\b)/i,/^(?:STYLE\b)/i,/^(?:SUB\b)/i,/^(?:SUBMULTISET\b)/i,/^(?:SUBPARTITION\b)/i,/^(?:SUBSTRING\b)/i,/^(?:SUBTYPE\b)/i,/^(?:SUM\b)/i,/^(?:SUPER\b)/i,/^(?:SYMMETRIC\b)/i,/^(?:SYNONYM\b)/i,/^(?:SYSTEM\b)/i,/^(?:TABLE\b)/i,/^(?:TABLESAMPLE\b)/i,/^(?:TEMP\b)/i,/^(?:TEMPORARY\b)/i,/^(?:TERMINATED\b)/i,/^(?:TEXT\b)/i,/^(?:THAN\b)/i,/^(?:THEN\b)/i,/^(?:THROUGHPUT\b)/i,/^(?:TIME\b)/i,/^(?:TIMESTAMP\b)/i,/^(?:TIMEZONE\b)/i,/^(?:TINYINT\b)/i,/^(?:TO\b)/i,/^(?:TOKEN\b)/i,/^(?:TOTAL\b)/i,/^(?:TOUCH\b)/i,/^(?:TRAILING\b)/i,/^(?:TRANSACTION\b)/i,/^(?:TRANSFORM\b)/i,/^(?:TRANSLATE\b)/i,/^(?:TRANSLATION\b)/i,/^(?:TREAT\b)/i,/^(?:TRIGGER\b)/i,/^(?:TRIM\b)/i,/^(?:TRUE\b)/i,/^(?:TRUNCATE\b)/i,/^(?:TTL\b)/i,/^(?:TUPLE\b)/i,/^(?:TYPE\b)/i,/^(?:UNDER\b)/i,/^(?:UNDO\b)/i,/^(?:UNION\b)/i,/^(?:UNIQUE\b)/i,/^(?:UNIT\b)/i,/^(?:UNKNOWN\b)/i,/^(?:UNLOGGED\b)/i,/^(?:UNNEST\b)/i,/^(?:UNPROCESSED\b)/i,/^(?:UNSIGNED\b)/i,/^(?:UNTIL\b)/i,/^(?:UPDATE\b)/i,/^(?:UPPER\b)/i,/^(?:URL\b)/i,/^(?:USAGE\b)/i,/^(?:USE\b)/i,/^(?:USER\b)/i,/^(?:USERS\b)/i,/^(?:USING\b)/i,/^(?:UUID\b)/i,/^(?:VACUUM\b)/i,/^(?:VALUE\b)/i,/^(?:VALUED\b)/i,/^(?:VALUES\b)/i,/^(?:VARCHAR\b)/i,/^(?:VARIABLE\b)/i,/^(?:VARIANCE\b)/i,/^(?:VARINT\b)/i,/^(?:VARYING\b)/i,/^(?:VIEW\b)/i,/^(?:VIEWS\b)/i,/^(?:VIRTUAL\b)/i,/^(?:VOID\b)/i,/^(?:WAIT\b)/i,/^(?:WHEN\b)/i,/^(?:WHENEVER\b)/i,/^(?:WHERE\b)/i,/^(?:WHILE\b)/i,/^(?:WINDOW\b)/i,/^(?:WITH\b)/i,/^(?:WITHIN\b)/i,/^(?:WITHOUT\b)/i,/^(?:WORK\b)/i,/^(?:WRAPPED\b)/i,/^(?:WRITE\b)/i,/^(?:YEAR\b)/i,/^(?:ZONE\b)/i,/^(?:JSON\b)/i,/^(?:MATH\b)/i,/^(?:UUID\b)/i,/^(?:[-]?(\d*[.])?\d+[eE]\d+)/i,/^(?:[-]?(\d*[.])?\d+)/i,/^(?:~)/i,/^(?:\+=)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:>>)/i,/^(?:<<)/i,/^(?:<>)/i,/^(?:!=)/i,/^(?:>=)/i,/^(?:>)/i,/^(?:<=)/i,/^(?:<)/i,/^(?:=)/i,/^(?:&)/i,/^(?:\|)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\.)/i,/^(?:,)/i,/^(?::)/i,/^(?:;)/i,/^(?:\$)/i,/^(?:\?)/i,/^(?:\^)/i,/^(?:[a-zA-Z_][a-zA-Z_0-9]*)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746],"inclusive":true}}
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
/* possible that is no longer needed, replaced by stringify() */
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

/*
DynamoUtil.normalizeList = function($items) {
	var $list = []
	for (var i in $items) {
		$list.push(DynamoUtil.normalizeItem($items[i]))
	}
	return $list;
}
*/

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
		return parseFloat(v.N)

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

}).call(this,{"isBuffer":require("../../../../../../../../.nvm/versions/node/v10.8.0/lib/node_modules/browserify/node_modules/is-buffer/index.js")})
},{"../../../../../../../../.nvm/versions/node/v10.8.0/lib/node_modules/browserify/node_modules/is-buffer/index.js":2}]},{},[5]);
