var Hapi = require('hapi');
var Good = require('good');

// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);

var users = {
    Mike: {
        id: 'mweyman',
        password: 'password',
        name: 'Michael Weyman'
    }
};

server.pack.register(require('hapi-auth-cookie'), function (err) {

    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false
    });

var home = function (request,reply){
    reply('<html><head><title>Login</title></head><body><form method="post"><p><input type="text" name="login" value="" placeholer="Username"></p><p><input type="password" name="password" value="" placeholder="password"></p><p class="submit"><input type="submit" name="commit" value="Login"></p></form></body></html>');
};

// Add the route
server.route({
    method: 'GET',
    path: '/',
    config: {
        handler: home,
        auth: 'session'
    }
});

server.route({
    method: 'POST',
    path: '/Login',
    config: {
        handler: function (request, reply) {
    	   var user = request.auth.credentials.name;
    	   var pass = request.auth.credentials.password;
            reply('<html><head></head><body><p>Hello ' + user + '!!</p><p>Your password is : ' + pass + '</p></body></html>');
        },
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        plugins: {
            'hapi-auth-cookie':{
                redirectTo: false
            }
        }
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