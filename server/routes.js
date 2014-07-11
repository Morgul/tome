//----------------------------------------------------------------------------------------------------------------------
// Build our routes for handling wiki pages
//
// @module routes.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');

var router = require('router');

var cache = require('./cache');
var logger = require('omega-logger').getLogger('router');

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

route.get('/api/tag', function(req, res)
{
    console.log('got here...');
    cache.getTags(function(results)
    {
        respond(results, res);
    });
});

route.get('/api/page', function(req, res)
{
    if(req.query.body)
    {
        cache.search(req.query.body, function(results)
        {
            respond(results, res);
        });
    }
    else if(req.query.tags)
    {
        // Build tags list
        var tags = req.query.tags.replace(' ', '').split(';');
        tags = tags.map(function(tag){ return tag.trim(); });

        cache.getByTags(tags, function(results)
        {
            respond(results, res);
        });

        //TODO: implement tag search
    }
    else if(req.query.id)
    {
        //TODO: implement id search
    }
    else if(req.query.title)
    {
        //TODO: implement title search
    }
    else
    {
        cache.all(function(results)
        {
            respond(results, res);
        });
    } // end if
});

route.head('/api/page/*', function(req, res)
{
    cache.exists('/' + req.params.wildcard, function(exists)
    {
        if(exists)
        {
            respond(true, res);
        }
        else
        {
            wiki404(res);
        } // end if
    });
});

route.get('/api/page/*', function(req, res)
{
    cache.get('/' + req.params.wildcard, function(wikiPage)
    {
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
});

route.get(function(req, resp)
{
    resp.end(fs.readFileSync('./client/index.html', { encoding: 'utf8' }));
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = route;

//----------------------------------------------------------------------------------------------------------------------