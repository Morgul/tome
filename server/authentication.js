//----------------------------------------------------------------------------------------------------------------------
// Brief description for authentication module.
//
// @module authentication
//----------------------------------------------------------------------------------------------------------------------

var passport = require('passport');
var PersonaStrategy = require('passport-persona').Strategy;

var config = require('../config');
var users = require('./users');
var router = require('./routes');

var logger = require('omega-logger').getLogger('auth');

//----------------------------------------------------------------------------------------------------------------------

router.post('/auth/login-persona', function(request, response)
    {
        passport.authenticate('persona', { failureRedirect: '/' }, function(error, user)
        {
            if(arguments.length < 2)
            {
                logger.error('Error authenticating:', logger.dump(error));
                response.writeHead(500, {"Content-Type": "application/json"});
                response.end(error.toString());
            }
            else
            {
                //TODO: if this is a new user, we should redirect them to the profile page.
                console.log('success?', arguments);

                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify(user));
            } // end if
        })(request, response);
    }
);

router.post('/auth/logout-persona', function(request, response)
{
    request.logout();
    response.redirect('/');
});

//----------------------------------------------------------------------------------------------------------------------

passport.serializeUser(function(user, done)
{
    done(null, user.email);
});

passport.deserializeUser(function(email, done)
{
    users.get(email).then(function(user)
    {
        done(null, user);
    });
});

passport.use(new PersonaStrategy({
        audience: config.audience
    },
    function(email, done)
    {
        console.log('logging in:', email);

        users.get(email).then(function(user)
        {
            if(user)
            {
                done(null, user);
            }
            else
            {
                user = { email: email };
                users.store(email, user);

                done(null, user);
            } // end if
        });
    })
);

//----------------------------------------------------------------------------------------------------------------------