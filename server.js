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

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var package = require('./package');
var config = require('./server/config');

// Auth
var serialization = require('./server/auth/serialization');
var gPlusAuth = require('./server/auth/google-plus');

// Routers
var routeUtils = require('./server/routes/utils');
var pagesRouter = require('./server/routes/pages');
var tagsRouter = require('./server/routes/tags');
var searchRouter = require('./server/routes/search');
var recentRouter = require('./server/routes/recent');
var commentsRouter = require('./server/routes/comments');
var usersRouter = require('./server/routes/users');
var configRouter = require('./server/routes/config');

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
var app = express();

// Basic request logging
app.use(routeUtils.requestLogger(logger));

// Basic error logging
app.use(routeUtils.errorLogger(logger));

// Passport support
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: config.secret || 'nosecret',
    key: config.key || 'sid',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up out authentication support
gPlusAuth.initialize(app);

// Setup static serving
app.use(express.static(path.resolve(__dirname + '/client')));

// Set up our application routes
app.use('/wiki', pagesRouter);
app.use('/tags', tagsRouter);
app.use('/search', searchRouter);
app.use('/recent', recentRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);
app.use('/config', configRouter);

// Serve index.html
app.get('/', routeUtils.serveIndex);

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    app: app,
    listen: function()
    {
        // The fallback route, always serves index.html
        //app.use(routeUtils.serveIndex);

        // Start the server
        var server = app.listen(config.port || 3000, function()
        {
            var host = server.address().address;
            var port = server.address().port;

            logger.info('Tome v%s listening at http://%s:%s', package.version, host, port);
        });
    } // end listen
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
