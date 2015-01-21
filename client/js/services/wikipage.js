// ---------------------------------------------------------------------------------------------------------------------
// A service for retrieving/working with wiki pages.
//
// @module wikipage.js
// ---------------------------------------------------------------------------------------------------------------------

function PageService($resource, $route, $cacheFactory)
{
    this.existsCache = $cacheFactory('existsCache', { capacity: 500 });
    this.expirations = {};

    this.Tags = $resource('/tags', {}, {
        get: { method: 'GET', isArray: true }
    });

    this.Page = $resource('/wiki/:wikiPath', {}, {
        save: { method: 'PUT' },
        exists: { method: 'HEAD' },
        revision: { method: 'GET', url:'/wiki/:wikiPath/?revision=:revision', cache: true },
        history: { method: 'GET', url: '/wiki:wikiPath?history', isArray: true },
        search: { method: 'GET', isArray: true },
        recent: { method: 'GET', url: '/recent', isArray: true }
    });

    Object.defineProperty(this, 'wikiPath', {
        get: function(){ return  $route.current.params.wikiPath; }
    });
} // end PageService

PageService.prototype.get = function(wikiPath)
{
    wikiPath = wikiPath || this.wikiPath;
    return this.Page.get({ wikiPath: wikiPath });
}; // end get

PageService.prototype.set = function(wikiPath, page)
{
    if(arguments.length == 1)
    {
        page = wikiPath;
        wikiPath = this.wikiPath;
    } // end if

    return this.Page.save({ wikiPath: wikiPath }, page);
}; // end set

PageService.prototype.remove = function(wikiPath)
{
    wikiPath = wikiPath || this.wikiPath;
    return this.Page.delete({ wikiPath: wikiPath });
};

PageService.prototype.getAllTags = function()
{
    return this.Tags.get();
}; // end get

PageService.prototype.getByTag = function(tag)
{
    return this.Page.search({ tags: tag });
}; // end get

PageService.prototype.getHistory = function(wikiPath, limit)
{
    wikiPath = wikiPath || this.wikiPath;
    limit = limit || 25;
    return this.Page.history({ wikiPath: wikiPath, limit: limit });
}; // end getHistory

PageService.prototype.getRevision = function(revID)
{
    return this.Page.revision({ revision: revID });
}; // end getRevision

PageService.prototype.recent = function(limit)
{
    return this.Page.recent({ limit: limit });
}; // end recent

PageService.prototype.exists = function(wikiPath, callback)
{
    var self = this;
    var exprTime = this.expirations[wikiPath];
    if(!exprTime || (Date.now() - exprTime) > 30000)
    {
        return this.Page.exists({ wikiPath: wikiPath }, function()
        {
            self.existsCache.put(wikiPath, true);
            self.expirations[wikiPath] = Date.now();

            callback(true);
        }, function()
        {
            self.existsCache.put(wikiPath, false);
            self.expirations[wikiPath] = Date.now();

            callback(false);
        });
    }
    else
    {
        callback(self.existsCache.get(wikiPath));
    } // end if
}; // end exists

PageService.prototype.search = function(searchText)
{
    return this.Page.search({ body: searchText });
}; // end search

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('wikiPage', ['$resource', '$route', '$cacheFactory', PageService]);

// ---------------------------------------------------------------------------------------------------------------------