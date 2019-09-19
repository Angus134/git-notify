/**
 * Dependencies
 */

var format = require('util').format;
var ms = require('ms');


/**
 * Expose middleware
 */

module.exports = function () {
  return log;
};


/**
 * Options
 */

var options = exports;

options.indent = 2;
options.format = 'method=:method path=:path status=:status time=:time body=:body';
options.filter = ['password', 'password_confirmation'];


/**
 * Log requests
 */

function * log (next) {
	var start = Date.now();
	
	// if error occurs
	// catch it, store it
	// log the failed request
	// and then throw it again
	var err;
	
	try {
	  yield next;
	} catch (e) {
	  err = e;
	  this.status = err.status || 500;
	}
	
	var end = Date.now();
	
	var params = {
	  method: this.method.toUpperCase(),
	  path: this.url,
	  status: this.status,
	  time: ms(end - start),
	  body: serialize(this.request.body || {})
	};
	
	var output = options.format;
	
	Object.keys(params).forEach(function (param) {
	  output = output.replace(':' + param, params[param]);
	});
	
	// insert spaces
	output = indent(output);
	
	console.log(output);
	
	if (err) throw err;
};


/**
 * Utilities
 */

function serialize (obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') return obj;
  
  // request params keys
  var keys = Object.keys(obj);
  
  // filter out keys
  keys = keys.filter(function (key) {
    return options.filter.indexOf(key) === -1;
  });
  
  // convert to stirng
  obj = keys.map(function (key) {
    return format('%s: %s', key, serialize(obj[key]));
  });
  
  return format('{ %s }', obj.join(', '));
}

function indent (str) {
  return new Array(options.indent + 1).join(' ') + str;
}
