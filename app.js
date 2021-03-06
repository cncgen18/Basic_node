var Hapi = require('hapi');
var Good = require('good');

// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);

var users = {
    mweyman: {
        id: 'mweyman',
        password: 'password',
        name: 'Michael Weyman',
        role: 'Admin'
    },
    john: {
        id: 'john',
        password: 'password',
        name: 'John Doe',
        role: 'user'
    }
};

server.pack.register(require('hapi-auth-cookie'), function (err) {

    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false
    });

var home = function (request, reply) {
    if(request.auth.credentials.role == 'Admin'){
        reply('<html><head><title>Login page</title></head><body><h3>Welcome '
            + request.auth.credentials.name
            + '!</h3><br/><p>You are the Admin!</p><br/>'
            + '<form method="get" action="/logout">'
            + '<input type="submit" value="Logout">'
            + '</form></body></html>');
    }
    else{
        reply('<html><head><title>Login page</title></head><body><h3>Welcome '
            + request.auth.credentials.name
            + '!</h3><br/><form method="get" action="/logout">'
            + '<input type="submit" value="Logout">'
            + '</form></body></html>');
        }
};
var login = function (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    var message = '';
    var account = null;

    if (request.method === 'post') {

        if (!request.payload.username ||
            !request.payload.password) {

            message = 'Missing username or password';
        }
        else {
            account = users[request.payload.username];
            if (!account ||
                account.password !== request.payload.password) {

                message = 'Invalid username or password';
            }
        }
    }

    if (request.method === 'get' ||
        message) {

        return reply('<html><head><title>Login page</title></head><body>'
            + (message ? '<h3>' + message + '</h3><br/>' : '')
            + '<form method="post" action="/login">'
            + 'Username: <input type="text" name="username"><br>'
            + 'Password: <input type="password" name="password"><br/>'
            + '<input type="submit" value="Login"></form></body></html>');
    }

    request.auth.session.set(account);
    return reply.redirect('/');
};

var logout = function (request, reply) {

    request.auth.session.clear();
    return reply.redirect('/');
};

// Add the route
server.route([
    {
        method: 'GET',
        path: '/',
        config: {
            handler: home,
            auth: 'session'
        }
    },
    {
        method: ['GET', 'POST'],
        path: '/login',
        config: {
            handler: login,
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
    },
    {
        method: 'GET',
        path: '/logout',
        config: {
            handler: logout,
            auth: 'session'
        }
    }
    ]);

/*server.pack.register({
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
*/

// Start the server
	server.start(function () {
    	server.log('info', 'Server running at:', server.info.uri);
	});

});