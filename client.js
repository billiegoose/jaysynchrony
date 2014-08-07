var Promise = require('es6-promise').Promise;
var jayson = require('jayson');

// create a client
var client = jayson.client.http({
  port: 3000,
  hostname: 'localhost'
});

// A helper function... not actually used at the moment.
function _name_() {return _name_.caller.name; }

// Convert a regular function into a promise.
// Note: this was a lot prettier in CoffeeScript.
function promisify (fun) {
  return function (arg) {
    var args = Array.prototype.slice.call(arguments);
    return new Promise (function (resolve, reject) {
      Promise.all(args)
        .then(function (vals) { resolve(fun.apply(null, vals)); })
        .catch(function (err) { reject(err); });
    });
  };
}

// jaysonify returns a function that returns a promise 
// that is fulfilled by the jayson client request callback.
function jaysonify (func) {
  // Extract the name of the function to be jaysonified.
  var fname = '';
  switch (typeof func) {
    case "function":
      fname = func.name;
      break;
    case "string":
      fname = func;
      break;
    default:
      throw("Specify name of function.");
  }
  // Return a new function that is a wrapper for a jayson call.
  return function(arg) {
    var args = Array.prototype.slice.call(arguments);
    return new Promise (function (resolve, reject) {
      // invoke RPC
      client.request(fname, args, function (err, error, result) {
        if(err) throw err;
        if(error === null) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  };
}

// A promisified version of console.log
function print(a) {
  if (a instanceof Promise) {
    a.then(function(val) { console.log(val); });
    a.catch(function(err) { console.log("Error: " + err); });
  } else {
    console.log(a);
  }
  return null;
}

// Examples.
function HelloWorld () {}
var HelloWorld = jaysonify(HelloWorld);
print(HelloWorld(null));

var add = jaysonify("add");
print(add(1,1));

var add2 = jaysonify("add2");
print(add2([2,3]));

// A local function that operates in a similar way.
// It is promisified rather than jaysonified.
add_s = function(a,b) { return a + b; };
add3 = promisify(add_s);
print(add3(3,3));

// Promisified and jaysonified functions can be mixed with ease!
// THIS IS THE POINT OF THE PROJECT. :D
print(add3(add(5,5),5));