var Hapi = require('hapi');
var Good = require('good');

// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);



// Add the route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        reply('<html><head><title>Login</title></head><body><form method="post"><p><input type="text" name="login" value="" placeholer="Username"></p><p><input type="password" name="password" value="" placeholder="password"></p><p class="submit"><input type="submit" name="commit" value="Login"></p></form></body></html>');
    }
});
server.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {
    	var user =  JSON.stringify(request.payload.login);
        reply('<html><head></head><body><p>Hello ' + user + '!!</p></body></html>');
    }
});

server.pack.register({
    plugin: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            args:[{ log: '*', request: '*' }]
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }


// Start the server
	server.start(function () {
    	server.log('info', 'Server running at:', server.info.uri);
	});

});