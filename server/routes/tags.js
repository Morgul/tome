//----------------------------------------------------------------------------------------------------------------------
// Routes for wiki page tag searching
//
// @module tag.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');

var routeUtils = require('./utils');
var Page = require('../db/page');

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
// Tags Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('tag', function(req, resp, next, tag)
{
    req.tag = tag;
    next();
});

router.get('/', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        Page.getAllTags()
            .then(function(tags)
            {
                resp.json(tags);
            });
    });
});

router.get('/:tag', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        Page.getByTags([req.tag])
            .then(function(pages)
            {
                resp.json(pages);
            });
    });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------