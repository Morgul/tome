//----------------------------------------------------------------------------------------------------------------------
// Brief description for authentication module.
//
// @module authentication
//----------------------------------------------------------------------------------------------------------------------

var passport = require('passport');
var PersonaStrategy = require('passport-persona').Strategy;

var db = require('./database');
var router = require('./routes');
var errors = require('./errors');
var config = require('../config');

var logger = require('omega-logger').getLogger('auth');

//----------------------------------------------------------------------------------------------------------------------

router.post('/auth/login-persona', function(request, response)
    {
        passport.authenticate('persona', { failureRedirect: '/' }, function(error, user)
        {
            if(error)
            {
                if(error instanceof errors.RegistrationRequiredError)
                {
                    logger.debug('Registration required.');
                    response.writeHead(403, {"Content-Type": "application/json"});
                    response.end(JSON.stringify({ email: error.email, error: error.message }));
                }
                else if(error instanceof error.NotAuthorizedError)
                {
                    logger.debug('Registration not allowed.');
                    response.writeHead(403, {"Content-Type": "application/json"});
                    response.end(JSON.stringify({ error: error.message }));
                }
                else
                {
                    logger.error('Error authenticating:', logger.dump(error));
                    response.writeHead(500, {"Content-Type": "application/json"});
                    response.end(error.message || error.toString());
                } // end if
            }
            else
            {
                request.login(user, function(err)
                {
                    //TODO: if this is a new user, we should redirect them to the profile page.
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.end(JSON.stringify(user));
                });
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
    db.users.get(email).then(function(user)
    {
        done(null, user);
    }).catch(function(error)
    {
        done(error);
    });
});

passport.use(new PersonaStrategy({
        audience: config.audience
    },
    function(email, done)
    {
        db.users.get(email).then(function(user)
        {
            if(user)
            {
                done(null, user);
            } // end if
        }).catch(db.Errors.DocumentNotFound, function()
        {
            if(config.registration === 'auto')
            {
                // Auto-create users
                 user = { email: email };
                 db.users.store(user).then(function()
                 {
                     done(null, user);
                 });
            }
            else if(config.registration === true)
            {
                // Force registration
                var error = new errors.RegistrationRequiredError();
                error.email = email;
                done(error);
            }
            else
            {
                done(new errors.NotAuthorizedError("Registration disabled."));
            } // end if
        });
    })
);

//----------------------------------------------------------------------------------------------------------------------