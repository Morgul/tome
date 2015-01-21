//----------------------------------------------------------------------------------------------------------------------
// Routes for wiki pages
//
// @module page.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');

var routeUtils = require('./utils');
var Page = require('../db/page');
var Comment = require('../db/comment');
var models = require('../models');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function renderPage(page)
{
    var result = page.toJSON();
    result.revision = page.revision;
    result.history = page.history;
    result.comments = page.comments;

    return result;
} // end renderPage

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

/*
//FOR DEBUGGING ONLY!!!!
router.use(function(req, resp, next)
{
    req.user = {id: 'test-user'};
    req.isAuthenticated = function(){ return true; };
    next();
});
*/

//----------------------------------------------------------------------------------------------------------------------
// Pages Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('slug', function(req, resp, next, slug)
{
    req.slug = slug;
    next();
});

router.get('/:slug', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        Page.get(req.slug)
            .then(function(page)
            {
                if(req.query.history)
                {
                    console.log('history!');
                    return Page.history(req.slug, req.query.limit)
                        .then(function(history)
                        {
                            page.history = history;
                            return page;
                        });
                }
                else if(req.query.comments)
                {
                    console.log('comments!');
                    return Comment.getByPage(page.id, req.query.limit)
                        .then(function(comments)
                        {
                            page.comments = comments;
                            return page;
                        });
                }
                else
                {
                    return page;
                } // end if
            })
            .then(function(page)
            {
                resp.json(renderPage(page));
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                logger.warn("[404] Page '%s' not found.", req.slug);

                resp.status(404).json({
                    human: "Page not found.",
                    message: error.message,
                    stack: error.stack
                });
            });
    });
});

router.put('/:slug', function(req, resp)
{
    if(req.isAuthenticated())
    {
        Page.store(req.slug, req.body, req.user)
            .then(function(page)
            {
                resp.json(renderPage(page));
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

router.delete('/:slug', function(req, resp)
{
    if(req.isAuthenticated())
    {
        Page.delete(req.slug, req.user, req.body.message)
            .then(function()
            {
                resp.end();
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------