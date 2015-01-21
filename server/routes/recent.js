//----------------------------------------------------------------------------------------------------------------------
// Routes for recent activity
//
// @module page.js
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
// Recent Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.get('/', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        models.Revision.filter()
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
    });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------