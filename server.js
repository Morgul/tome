//----------------------------------------------------------------------------------------------------------------------
// Brief description for server.js module.
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
    //.use(connect.logger('dev'))
    .use(connect.bodyParser())
    .use(connect.query())
    .use(connect.static('client'))
    .use(connect.cookieParser(config.secret))
    .use(connect.session({
        secret: config.secret || 'nosecret',
        key: config.sid || 'sid',
        store: new connect.session.MemoryStore()
    }))
    .use(redirect())
    .use(passport.initialize())
    .use(passport.session())
    .use(router)
    .listen(4000);

logger.info('Tomb v%s started on %s, port %s.', package.version, server.address().address, server.address().port);

//----------------------------------------------------------------------------------------------------------------------