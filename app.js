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
    console.log('Server running at:', server.info.uri);
});