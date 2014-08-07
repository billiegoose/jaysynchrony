var jayson = require('jayson');

// create a server, with example method
var server = jayson.server({
  add: function(a, b, callback) {
    callback(null, a + b);
  }
});

// A helper function... not actually used at the moment.
function _name_() {return _name_.caller.name; }

// This takes a regular function and makes it available 
// over JSON-RPC.
function serve(func) {
  server.method(func.name, function(args,callback) {
    callback(null,func(args));
  });
}

// An example of a regular function.
function HelloWorld(args) {
  return "Hello, World!";
}
function add2 (args) {
  return args[0]+args[1];
}

// BAM. Available on JSON-RPC now.
serve(HelloWorld);
serve(add2);

// Bind a http interface to the server and let it listen to localhost:3000
server.http().listen(3000);