//----------------------------------------------------------------------------------------------------------------------
// Main server module for Tome Wiki.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var logging = require('omega-logger');

if(process.env.LOG_LEVEL)
{
    logging.defaultConsoleHandler.level = logging.getLevel(process.env.LOG_LEVEL);
} // end if

var logger = logging.getLogger('server');

//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

var connect = require('connect');
var redirect = require('connect-redirection');
var passport = require('passport');

var router = require('./server/routes');
var auth = require('./server/authentication');

var package = require('./package');
var config = require('./server/config');

//----------------------------------------------------------------------------------------------------------------------

var app = connect()
    .use(connect.bodyParser())
    .use(connect.query())
    .use(connect.static(__dirname + '/client'))
    .use(connect.cookieParser(config.secret))
    .use(connect.session({
        secret: config.secret || 'nosecret',
        key: config.sid || 'sid',
        store: new connect.session.MemoryStore()
    }))
    .use(redirect());

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    app: app,
    listen: function()
    {
        var server = app
            .use(passport.initialize())
            .use(passport.session())
            .use(router)
            .listen(config.port || 4000);

        logger.info('Tomb v%s started on %s, port %s.', package.version, server.address().address, server.address().port);
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------