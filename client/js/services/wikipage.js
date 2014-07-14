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
        exists: { method: 'HEAD' },
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

PageService.prototype.getAllTags = function()
{
    return this.Tags.get();
}; // end get

PageService.prototype.getByTag = function(tag)
{
    return this.Page.search({ tags: tag });
}; // end get

PageService.prototype.exists = function(wikiPath)
{
    wikiPath = wikiPath || this.wikiPath;
    return this.Page.exists({ wikiPath: wikiPath });
}; // end exists

PageService.prototype.search = function(searchText)
{
    return this.Page.search({ body: searchText });
}; // end search

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('wikiPage', ['$resource', '$route', PageService]);

// ---------------------------------------------------------------------------------------------------------------------