//---------------------------------------------------------------------------------------------------------------------
// Build our routes for handling wiki pages
//
// @module routes.js
//---------------------------------------------------------------------------------------------------------------------

var util = require('util');

var _ = require('lodash');
var Promise = require('bluebird');
var restify = require('restify');

var db = require('./database');
var config = require('./config');
var package = require('../package');

var logger = require('omega-logger').loggerFor(module);

//---------------------------------------------------------------------------------------------------------------------

function MissingEmailError(message)
{
    restify.RestError.call(this, {
        restCode: 'MissingEmail',
        statusCode: 400,
        message: message,
        constructorOpt: MissingEmailError
    });
    this.name = 'MissingEmailError';
} // end MissingEmailError
util.inherits(MissingEmailError, restify.RestError);

function RegistrationDeniedError(message)
{
    restify.RestError.call(this, {
        restCode: 'RegistrationDenied',
        statusCode: 403,
        message: message,
        constructorOpt: RegistrationDeniedError
    });
    this.name = 'RegistrationDeniedError';
} // end RegistrationDeniedError
util.inherits(RegistrationDeniedError, restify.RestError);

function UserExistsError(message)
{
    restify.RestError.call(this, {
        restCode: 'UserExists',
        statusCode: 409,
        message: message,
        constructorOpt: UserExistsError
    });
    this.name = 'UserExistsError';
} // end UserExistsError
util.inherits(UserExistsError, restify.RestError);

function NotHumanError(message)
{
    restify.RestError.call(this, {
        restCode: 'NotHuman',
        statusCode: 403,
        message: message,
        constructorOpt: NotHumanError
    });
    this.name = 'NotHumanError';
} // end NotHumanError
util.inherits(NotHumanError, restify.RestError);

//---------------------------------------------------------------------------------------------------------------------

module.exports = function configureRoutes(app)
{
    //-----------------------------------------------------------------------------------------------------------------
    // Tags
    //-----------------------------------------------------------------------------------------------------------------

    app.get('/api/tag', function(request, response, next)
    {
        db.pages.getTags()
        .then(response.respondAsync)
        .then(function() { next(false); }, next);
    });

    //-----------------------------------------------------------------------------------------------------------------
    // Pages
    //-----------------------------------------------------------------------------------------------------------------

    app.get('/api/history', function(request, response, next)
    {
        var limit = request.query.limit;
        db.pages.recentActivity(limit)
        .then(response.respondAsync)
        .then(function() { next(false); }, next);
    });

    app.get(/^\/api\/history\/(.*)$/, function(request, response, next)
    {
        var limit = request.query.limit;
        var slug = '/' + decodeURIComponent(request.params[0]);

        // Handle welcome page
        if(slug == '/' || slug == '//')
        {
            slug = config.frontPage || '/welcome';
        } // end if

        db.pages.getHistory(slug, limit)
        .then(response.respondAsync)
        .catch(db.Errors.DocumentNotFound, db.Errors.ReqlRuntimeError, function()
        {
            return next(new restify.ResourceNotFoundError("Wiki page not found."));
        })
        .then(function() { next(false); }, next);
    });

    app.get('/api/revision/:revision', function(request, response, next)
    {
        db.pages.getRevision(request.params.revision)
        .then(response.respondAsync)
        .catch(db.Errors.DocumentNotFound, db.Errors.ReqlRuntimeError, function()
        {
            return next(new restify.ResourceNotFoundError("Wiki page not found."));
        })
        .then(function() { next(false); }, next);
    });

    app.get('/api/page', function(request, response, next)
    {
        new Promise(function(resolve, reject)
        {
            if(request.query.body)
            {
                resolve(db.pages.search(request.query.body));
            }
            else if(request.query.tags)
            {
                // Build tags list
                var tags = request.query.tags.replace(' ', '').split(';');
                tags = tags.map(function(tag){ return tag.trim(); });

                resolve(db.pages.getByTags(tags));
            }
            else if(request.query.slug)
            {
                //TODO: implement slug search
                reject(new restify.NotImplementedError("Not yet implemented."));
            }
            else if(request.query.title)
            {
                //TODO: implement title search
                reject(new restify.NotImplementedError("Not yet implemented."));
            }
            else
            {
                reject(new restify.MissingParameterError("No body, tags, slug, or title query specified!"));
            } // end if
        })
        .then(
            function(data)
            {
                logger.warn("Succeeded, with data: %s", logger.dump(data));
                return data;
            },
            function(error)
            {
                logger.warn("Failed, with error: %s", logger.dump(error));
                throw error;
            })
        .then(response.respondAsync)
        .then(function() { next(false); }, next);
    });

    function apiPageHandler(request, response, next)
    {
        var slug = '/' + decodeURIComponent(request.params[0]);

        // Handle welcome page
        if(slug == '/' || slug == '//')
        {
            slug = config.frontPage || '/welcome';
        } // end if

        db.pages.get(slug)
        .catch(db.Errors.DocumentNotFound, db.Errors.ReqlRuntimeError, function()
        {
            throw new restify.ResourceNotFoundError("Wiki page not found.");
        })
        .then(response.respondAsync)
        .then(function() { next(false); }, next);
    } // end apiPageHandler

    app.head(/^\/api\/page\/(.*)$/, apiPageHandler);
    app.get(/^\/api\/page\/(.*)$/, apiPageHandler);

    // Create new wiki pages
    app.put(/^\/api\/page\/(.*)$/, function(request, response, next)
    {
        if(!request.isAuthenticated())
        {
            return next(new restify.NotAuthorizedError("Authentication required."));
        } // end if

        var slug = '/' + decodeURIComponent(request.params[0]);
        var reqBody = request.body;

        db.pages.createOrUpdate(slug, reqBody, request.user)
        .then(response.respondAsync)
        .then(function() { next(false); }, next);
    });

    // Delete wiki pages
    app.del(/^\/api\/page\/(.*)$/, function(request, response, next)
    {
        if(!request.isAuthenticated())
        {
            return next(new restify.NotAuthorizedError("Authentication required."));
        } // end if

        var slug = '/' + decodeURIComponent(request.params[0]);

        db.pages.delete(slug, request.user)
        .then(response.respondAsync)
        .then(function() { next(false); }, next);
    });

    //-----------------------------------------------------------------------------------------------------------------
    // Commits
    //-----------------------------------------------------------------------------------------------------------------

    app.get('/api/commit', function(request, response, next)
    {
        var user = request.query.user;
        var limit = request.query.limit;

        if(user)
        {
            db.users.getCommits(user, limit)
            .then(response.respondAsync)
            .then(function() { next(false); }, next);
        }
        else
        {
            //TODO: Implement looking up commits without a user
            next(new restify.NotImplementedError("Not yet implemented."));
        } // end if
    });

    //-----------------------------------------------------------------------------------------------------------------
    // Comments
    //-----------------------------------------------------------------------------------------------------------------

    app.get('/api/comment', function(request, response, next)
    {
        var page = request.query.page;
        var group = request.query.group;
        var limit = request.query.limit;

        db.comments.get(page, group, limit)
        .then(response.respondAsync)
        .then(function() { next(false); }, next);
    });

    app.put('/api/comment', function(request, response, next)
    {
        if(request.isAuthenticated())
        {
            var page = request.body.page;
            var title = request.body.title;
            var body = request.body.body;

            db.comments.create(page, title, body, request.user)
            .then(response.respondAsync)
            .then(function() { next(false); }, next);
        }
        else
        {
            next(new restify.NotAuthorizedError("Authentication required."));
        } // end if
    });

    app.put('/api/comment/:comment', function(request, response, next)
    {
        if(request.isAuthenticated())
        {
            var comment = request.params.comment;
            var title = request.body.title;
            var body = request.body.body;
            var resolved = request.body.resolved;

            db.comments.update(comment, title, body, resolved)
            .then(response.respondAsync)
            .then(function() { next(false); }, next);
        }
        else
        {
            next(new restify.NotAuthorizedError("Authentication required."));
        } // end if
    });

    app.del('/api/comment/:comment', function(request, response, next)
    {
        if(request.isAuthenticated())
        {
            var comment = request.params.comment;

            db.comments.delete(comment)
            .then(response.respondAsync)
            .then(function() { next(false); }, next);
        }
        else
        {
            next(new restify.NotAuthorizedError("Authentication required."));
        } // end if
    });

    //-----------------------------------------------------------------------------------------------------------------
    // User
    //-----------------------------------------------------------------------------------------------------------------

    app.get('/api/user/:email', function(request, response, next)
    {
        db.users.get(request.params.email)
        .then(response.respondAsync)
        .catch(db.Errors.DocumentNotFound, function()
        {
            return next(new restify.ResourceNotFoundError("Wiki page not found."));
        })
        .then(function() { next(false); }, next);
    });

    app.put('/api/user/:email', function(request, response, next)
    {
        var reqBody = request.body;

        if(!reqBody.email)
        {
            next(new MissingEmailError("Email is required in order to register."));
        }
        else if(request.isAuthenticated())
        {
            if(!request.isAuthenticated())
            {
                next(new restify.NotAuthorizedError("You must be logged in to modify user information."));
            }
            else if(request.user != request.params.email)
            {
                next(new restify.NotAuthorizedError("You may only modify your own user information."));
            } // end if

            // Update the user
            db.users.merge(request.body)
            .then(response.respond)
            .then(function() { next(false); }, next);
        }
        else
        {
            if(config.registration !== true)
            {
                next(new RegistrationDeniedError("Registration disabled."));
            } // end if

            db.users.get(request.params.email)
            .then(function()
            {
                next(new UserExistsError("User %j already exists.", request.params.email));
            })
            .catch(db.Errors.DocumentNotFound, function()
            {
                var expectedAnswer = config.humanVerificationQuestions[reqBody.humanIndex].answer;
                logger.info("Expected: %s, Actual: %s", logger.dump(expectedAnswer), logger.dump(reqBody.answer));

                // Check the human verification question
                if(expectedAnswer !== reqBody.answer)
                {
                    next(new NotHumanError("Failed human verification."));
                }
                else
                {
                    db.users.store({ email: reqBody.email, display: reqBody.display })
                    .then(function()
                    {
                        response.end();
                    });
                } // end if
            });
        } // end if
    });

    app.get('/api/human', function(request, response, next)
    {
        var questions = config.humanVerificationQuestions;
        var randIdx = Math.floor(Math.random() * questions.length);
        var question = questions[randIdx];

        response.respondAsync({ question: question.question, hint: question.hint, index: randIdx })
        .then(function() { next(false); }, next);
    });

    //-----------------------------------------------------------------------------------------------------------------
    // Misc
    //-----------------------------------------------------------------------------------------------------------------

    app.get('/api/config', function(request, response, next)
    {
        var exposedConfig = _.omit(config, ['sid', 'secret', 'humanVerificationQuestions']);
        exposedConfig.version = package.version;

        response.respondAsync(exposedConfig)
        .then(function() { next(false); }, next);
    });

    //-----------------------------------------------------------------------------------------------------------------

    return app;
}; // end configureRoutes

//---------------------------------------------------------------------------------------------------------------------
