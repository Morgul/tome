//----------------------------------------------------------------------------------------------------------------------
// Routes for wiki page comment searching
//
// @module comment.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');

var routeUtils = require('./utils');
var models = require('../models');
var Comment = require('../db/comment');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

//----------------------------------------------------------------------------------------------------------------------
// Comments Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('comment_id', function(req, resp, next, id)
{
    Comment.get(id)
        .then(function(comment)
        {
            req.comment = comment;
            next();
        })
        .catch(models.errors.DocumentNotFound, function(error)
        {
            resp.status(404).json({
                human: "Comment not found.",
                message: error.message,
                stack: error.stack
            });
        });
});

router.post('/', function(req, resp)
{
    if(req.isAuthenticated())
    {
        // We only ever allow posting as the current user.
        req.body.userID = req.user.email;

        Comment.store(null, req.body)
            .then(function(comment)
            {
                resp.json(comment);
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

router.get('/:comment_id', function(req, resp)
{
    resp.json(req.comment);
});

router.put('/:comment_id', function(req, resp)
{
    if(req.isAuthenticated())
    {
        Comment.store(req.comment.id, req.body)
            .then(function(comment)
            {
                resp.json(comment);
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

router.delete('/:comment_id', function(req, resp)
{
    if(req.isAuthenticated())
    {
        Comment.delete(req.comment.id)
            .then(function(comment)
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