var Hapi = require('hapi');
var Good = require('good');

// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);



// Add the route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        reply('hello world');
    }
});
// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});