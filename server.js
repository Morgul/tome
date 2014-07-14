//----------------------------------------------------------------------------------------------------------------------
// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var connect = require('connect');
var redirect = require('connect-redirection');
var passport = require('passport');

var router = require('./server/routes');
var parser = require('./server/parser');
var auth = require('./server/authentication');

var package = require('./package');
var config = require('./config');

//----------------------------------------------------------------------------------------------------------------------

// Parse wiki pages
parser.parse();

var server = connect()
    .use(connect.logger('dev'))
    .use(connect.query())
    .use(connect.static('client'))
    .use(connect.cookieParser(config.secret))
    .use(connect.session({
        secret: config.secret,
        store: config.store,
        key: config.sid
    }))
    .use(connect.bodyParser())
    .use(redirect())
    .use(passport.initialize())
    .use(passport.session())
    .use(router)
    .listen(4000);

console.log('Tomb v%s started on %s, port %s.', package.version, server.address().address, server.address().port);

//----------------------------------------------------------------------------------------------------------------------