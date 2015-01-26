//----------------------------------------------------------------------------------------------------------------------
// Routes for users
//
// @module users.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');

var routeUtils = require('./utils');
var models = require('../models');

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
// Users Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('user_email', function(req, resp, next, email)
{

    models.User.filter({ email: email })
        .then(function(users)
        {
            if(_.isEmpty(users)) { throw new models.errors.DocumentNotFound(); }

            req.user = users[0];
            next();
        })
        .catch(models.errors.DocumentNotFound, function(error)
        {
            resp.status(404).json({
                human: "User not found.",
                message: error.message,
                stack: error.stack
            });
        });
});

router.get('/', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
        {
            models.User.filter()
                .then(function(users)
                {
                    resp.json(users);
                });
        });
});

router.get('/:user_email', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        if(req.query.recent)
        {
            models.Revision.filter({ userID: req.user.email })
                .then(function(revisions)
                {
                    return _.sortBy(revisions, function(revision)
                    {
                        return new Date(revision.created);
                    }).reverse();
                })
                .then(function(revisions)
                {
                    var lastIdx = req.query.limit || revisions.length;
                    return revisions.slice(0, lastIdx);
                })
                .then(function(revisions)
                {
                    resp.json(revisions);
                });
        }
        else
        {
            resp.json(req.user);
        } // end if
    });
});

router.put('/:user_email', function(req, resp)
{
    if(req.isAuthenticated())
    {
        _.assign(req.user, req.body);

        req.user.save()
            .then(function()
            {
                resp.status(200).end();
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