// ---------------------------------------------------------------------------------------------------------------------
// A service for retrieving/working with wiki pages.
//
// @module wikipage.js
// ---------------------------------------------------------------------------------------------------------------------

function PageService($resource, $route)
{
    this.Tags = $resource('/api/tag', {}, {
        get: { method: 'GET', isArray: true }
    });

    this.Page = $resource('/api/page/:wikiPath', {}, {
        save: { method: 'PUT' },
        exists: { method: 'HEAD' },
        history: { url: '/api/history/:wikiPath', method: 'GET', isArray: true },
        search: { method: 'GET', isArray: true }
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

PageService.prototype.getHistory = function(wikiPath)
{
    wikiPath = wikiPath || this.wikiPath;
    return this.Page.history({ wikiPath: wikiPath });
}; // end get

PageService.prototype.exists = function(wikiPath, callback)
{
    return this.Page.exists({ wikiPath: wikiPath }, function(){ callback(true); }, function(){ callback(false); });
}; // end exists

PageService.prototype.search = function(searchText)
{
    return this.Page.search({ body: searchText });
}; // end search

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('wikiPage', ['$resource', '$route', PageService]);

// ---------------------------------------------------------------------------------------------------------------------