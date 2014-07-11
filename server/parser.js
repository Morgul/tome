//----------------------------------------------------------------------------------------------------------------------
// Parses wiki md files, generates meta-data.
//
// @module parser.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var walk = require('walk');
var headerParse = require('header-parse');

var cache = require('./cache');
var logger = require('omega-logger').getLogger('parser');

//----------------------------------------------------------------------------------------------------------------------

function WikiParser(){}

WikiParser.prototype._parseWikiFile = function(root, fileStats, next)
{
    // This is the relative url that this page will be displayed at.
    var wikiPageUrl = '/' + path.relative('./wiki', root);
    wikiPageUrl += (wikiPageUrl == '/' ? '' : '/') + path.basename(fileStats.name, '.md');

    // Open the wiki page
    var pageText = fs.readFileSync(path.resolve(root, fileStats.name), { encoding: 'utf8' });
    var output = headerParse.extractHeaderBlock(pageText);

    // Lowercase header keys
    output.headers = _.transform(output.headers, function(headers, val, key)
    {
        headers[key.toLowerCase()] = val;
    }, {});

    // Build wikiPage object
    var wikiPage = { body: output.body };
    wikiPage = _.assign(wikiPage, output.headers);

    // Parse our tags into a list
    if(wikiPage.tags)
    {
        wikiPage.tags = wikiPage.tags.replace(' ', '').split(';');
        wikiPage.tags = wikiPage.tags.map(function(tag){ return tag.trim(); });
    } // end if

    // Add the page to the cache
    cache.set(wikiPageUrl, wikiPage, function()
    {
        // Parse the next file
        next();
    });
}; // end _parseWikiFile

WikiParser.prototype.parse = function()
{
    console.log('starting');
    var self = this;

    var walker = walk.walk('./wiki', {
        followLinks: true
    });

    walker.on("file", function (root, fileStats, next) {
        if(path.extname(fileStats.name) == '.md')
        {
            self._parseWikiFile(root, fileStats, next);
        } // end if
    });
}; // end parse

//----------------------------------------------------------------------------------------------------------------------

module.exports = new WikiParser();

//----------------------------------------------------------------------------------------------------------------------