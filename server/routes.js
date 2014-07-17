//----------------------------------------------------------------------------------------------------------------------
// Build our routes for handling wiki pages
//
// @module routes.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');

var router = require('router');
var _ = require('lodash');

var db = require('./database');
var cache = require('./cache');
var config = require('../config');
var package = require('../package');

var logger = require('omega-logger').getLogger('router');

//----------------------------------------------------------------------------------------------------------------------

function respond(object, response)
{
    logger.debug('Response:', logger.dump(object));

    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(object));
} // end respond

function error(message, response)
{
    logger.error('Error: "%s"', message);

    response.writeHead(400, {"Content-Type": "application/json"});
    response.end(JSON.stringify({ error: message }));
} // end error

function notAuthorized(message, response)
{
    logger.error('Not Authorized: "%s"', message);

    response.writeHead(403, {"Content-Type": "application/json"});
    response.end(JSON.stringify({ error: 'Not Authorized:' + message }));
} // end error

function wiki404(response)
{
    logger.debug('Wiki page not found.');

    response.writeHead(404, {"Content-Type": "application/json"});
    response.end("Wiki page not found.");
} // end wiki404

//----------------------------------------------------------------------------------------------------------------------

var route = router();

//----------------------------------------------------------------------------------------------------------------------
// Tags
//----------------------------------------------------------------------------------------------------------------------

route.get('/api/tag', function(request, response)
{
    logger.info('user:', request.user, request.isAuthenticated());
    cache.getTags(function(results)
    {
        respond(results, response);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Pages
//----------------------------------------------------------------------------------------------------------------------

route.get('/api/page', function(request, response)
{
    if(request.query.body)
    {
        cache.search(request.query.body, function(results)
        {
            respond(results, response);
        });
    }
    else if(request.query.tags)
    {
        // Build tags list
        var tags = request.query.tags.replace(' ', '').split(';');
        tags = tags.map(function(tag){ return tag.trim(); });

        cache.getByTags(tags, function(results)
        {
            respond(results, response);
        });
    }
    else if(request.query.id)
    {
        //TODO: implement id search
    }
    else if(request.query.title)
    {
        //TODO: implement title search
    }
    else
    {
        cache.all(function(results)
        {
            respond(results, response);
        });
    } // end if
});

route.head('/api/page/*', function(request, response)
{
    cache.exists('/' + request.params.wildcard, function(exists)
    {
        if(exists)
        {
            respond(true, response);
        }
        else
        {
            wiki404(response);
        } // end if
    });
});

route.get('/api/page/*', function(request, response)
{
    cache.get('/' + request.params.wildcard, function(wikiPage)
    {
        // Handle welcome page
        if(request.params.wildcard == '/')
        {
            wikiPage = cache.get('/welcome');
        } // end if

        if(wikiPage)
        {
            respond(wikiPage, response);
        }
        else
        {
            wiki404(response);
        } // end if
    });
});

// Create new wiki pages
route.put('/api/page/*', function(request, response)
{
    if(request.isAuthenticated())
    {
        var wikiPath = '/' + request.params.wildcard;
        var reqBody = request.body;

        cache.set(wikiPath, reqBody, function()
        {
            response.end();
        });
    }
    else
    {
        notAuthorized("Authentication Required.", response);
    } // end if
});

// Update wiki pages
route.post('/api/page/*', function(request, response)
{
    if(request.isAuthenticated())
    {
        var wikiPath = '/' + request.params.wildcard;
        var reqBody = request.body;

        cache.set(wikiPath, reqBody, function()
        {
            response.end();
        });
    }
    else
    {
        notAuthorized("Authentication Required.", response);
    } // end if
});

// Delete wiki pages
route.delete('/api/page/*', function(request, response)
{
    if(request.isAuthenticated())
    {
        var wikiPath = '/' + request.params.wildcard;

        cache.remove(wikiPath, function()
        {
            response.end();
        });
    }
    else
    {
        notAuthorized("Authentication Required.", response);
    } // end if
});

//----------------------------------------------------------------------------------------------------------------------
// User
//----------------------------------------------------------------------------------------------------------------------

route.put('/api/user/:email', function(request, response)
{
    var regBody = request.body;

    if(regBody.email)
    {
        db.users.get(request.params.email).then(function()
        {
            error("User already exists.", response);
        }).catch(db.Errors.DocumentNotFound, function()
        {
            if(!request.isAuthenticated() && config.registration === true)
            {
                logger.info("Expected: %s, Actual: %s",
                    logger.dump(config.humanVerificationQuestions[regBody.humanIndex].answer),
                    logger.dump(regBody.answer));

                // Check the human verification question
                if(config.humanVerificationQuestions[regBody.humanIndex].answer == regBody.answer)
                {
                    db.users.store({ email: regBody.email, display: regBody.display }).then(function()
                    {
                        response.end();
                    });
                }
                else
                {
                    error('Failed human verification.', response);
                } // end if
            }
            else
            {
                error("Registration not allowed.", response);
            } // end if
        });
    }
    else
    {
        error("Missing or invalid body.", response);
    } // end if
});

route.post('/api/user/:email', function(request, response)
{
    if(request.body.email)
    {
        db.users.get(request.params.email).then(function(user)
        {
            // Update the user
            if(request.isAuthenticated() || request.user == request.params.email)
            {
                db.users.merge(request.body).then(function(){ response.end(); });
            }
            else
            {
                notAuthorized("You must be logged in as the user you are attempting to modify.", response);
            } // end if
        }).catch(db.Errors.DocumentNotFound, function()
        {
            error("User does not exist.", response);
        });
    }
    else
    {
        error("Missing or invalid body.", response);
    } // end if
});

route.get('/api/human', function(request, response)
{
    var questions = config.humanVerificationQuestions;
    var randIdx = Math.floor(Math.random() * questions.length);
    var question = questions[randIdx];
    respond({ question: question.question, hint: question.hint, index: randIdx }, response);
});

//----------------------------------------------------------------------------------------------------------------------
// Misc
//----------------------------------------------------------------------------------------------------------------------

route.get('/api/config', function(request, response)
{
    var exposedConfig = _.omit(config, ['sid', 'secret', 'humanVerificationQuestions']);
    exposedConfig.version = package.version;
    respond(exposedConfig, response);
});

route.get(function(request, response)
{
    response.end(fs.readFileSync('./client/index.html', { encoding: 'utf8' }));
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = route;

//----------------------------------------------------------------------------------------------------------------------