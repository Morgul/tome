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

//----------------------------------------------------------------------------------------------------------------------
// Pages Endpoint
//----------------------------------------------------------------------------------------------------------------------


router.head('/*', function(req, resp)
{
    // Get wildcard parameter
    var slug = req.params[0];

    Page.exists(slug)
        .then(function(exists)
        {
            if(exists)
            {
                resp.end();
            }
            else
            {
                resp.status(404).end();
            } // end if
        });
});

router.get('/*', function(req, resp)
{
    // Get wildcard parameter
    var slug = req.params[0];

    routeUtils.interceptHTML(resp, function()
    {
        Page.get(slug)
            .then(function(page)
            {
                if(req.query.history)
                {
                    return Page.history(slug, req.query.limit)
                        .then(function(history)
                        {
                            resp.json(history);
                        });
                }
                else if(req.query.comments)
                {
                    return Comment.getByPage(page.id, req.query.limit, (req.query.group === 'true'))
                        .then(function(comments)
                        {
                            resp.json(comments);
                        });
                }
                else if(req.query.revision)
                {
                    models.Revision.get(req.query.revision)
                        .then(function(rev)
                        {
                            page.revision = rev;
                            resp.json(renderPage(page));
                        });
                }
                else
                {
                    resp.json(renderPage(page));
                } // end if
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                logger.warn("[404] Page '%s' not found.", slug);

                resp.status(404).json({
                    human: "Page not found.",
                    message: error.message,
                    stack: error.stack
                });
            });
    });
});

router.put('/*', function(req, resp)
{
    // Get wildcard parameter
    var slug = req.params[0];

    if(req.isAuthenticated())
    {
        Page.store(slug, req.body, req.user)
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

router.delete('/*', function(req, resp)
{
    // Get wildcard parameter
    var slug = req.params[0];

    if(req.isAuthenticated())
    {
        Page.delete(slug, req.user, req.body.message)
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