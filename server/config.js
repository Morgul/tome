//----------------------------------------------------------------------------------------------------------------------
// Loads the config file from the root project, and combines it with our default config.
//
// @module config.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

var _ = require('lodash');
var defaults = require('../config.example');

//----------------------------------------------------------------------------------------------------------------------

// Attempt to pull the project's config file
var projectConfig;

try
{
    projectConfig = require(path.resolve('./config'));
}
catch(ex){ console.log('error', ex) }

//----------------------------------------------------------------------------------------------------------------------

module.exports = _.defaults({}, projectConfig, defaults);

//----------------------------------------------------------------------------------------------------------------------