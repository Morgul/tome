//----------------------------------------------------------------------------------------------------------------------
// Build our routes for handling wiki pages
//
// @module routes.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');

var router = require('router');

var cache = require('./cache');

//----------------------------------------------------------------------------------------------------------------------

function respond(object, response)
{
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(object));
} // end respond

function wiki404(response)
{
    response.writeHead(404, {"Content-Type": "application/json"});
    response.end("Wiki page not found.");
} // end wiki404

//----------------------------------------------------------------------------------------------------------------------

var route = router();

route.get('/api', function(req, res)
{
    respond(cache.get('/welcome'), res);
});

route.get('/api/*', function(req, res)
{
    var wikiPage = cache.get('/' + req.params.wildcard);

    // Handle welcome page
    if(req.params.wildcard == '/')
    {
        wikiPage = cache.get('/welcome');
    } // end if

    if(wikiPage)
    {
        respond(wikiPage, res);
    }
    else
    {
        wiki404(res);
    } // end if
});

route.get(function(req, resp)
{
    resp.end(fs.readFileSync('./client/index.html', { encoding: 'utf8' }));
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = route;

//----------------------------------------------------------------------------------------------------------------------