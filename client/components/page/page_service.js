// ---------------------------------------------------------------------------------------------------------------------
// PageService
//
// @module page_service.js
// ---------------------------------------------------------------------------------------------------------------------

function PageServiceFactory($q, $routeParams, $location, $cacheFactory, $http, PageResource)
{
    function PageService()
    {
        this.pageCache = $cacheFactory('pageCache', { capacity: 500 });

        Object.defineProperties(this, {
            wikiPath: {
                get: function()
                {
                    // Are we on a url that begins with `/wiki`?
                    if($location.path().match(/^\/wiki/))
                    {
                        return $routeParams.wikiPath;
                    } // end if
                }
            },
            current: {
                get: function()
                {
                    // Are we on a url that begins with `/wiki`?
                    if($location.path().match(/^\/wiki/))
                    {
                        return this.get(null, null, true);
                    } // end if
                }
            }
        });
    } // end PageService

    PageService.prototype.get = function(wikiPath, revision, skipRefresh)
    {
        wikiPath = wikiPath || this.wikiPath;
        var key = revision ? wikiPath + '@' + revision : wikiPath;

        var page = this.pageCache.get(key);

        if(!page)
        {
            page = PageResource(wikiPath, revision);

            // We always want to pull the details from the page, in case we're loading a revision without a url.
            key = revision ? page.url + '@' + revision : page.url;
            this.pageCache.put(key, page);
        }
        else
        {
            if(!skipRefresh)
            {
                // Get the latest version of the page
                page.refresh();
            } // end if
        } // end if

        return page;
    }; // end get

    PageService.prototype.getByTag = function(tag)
    {
        var self = this;
        var pages = [];
        $http.get('/tags/' + tag)
            .success(function(data)
            {
                _.each(data, function(page)
                {
                    // While there may be a more efficient way to do this, this is by far the most elegant.
                    pages.push(self.get(page.url, null, true));
                }); // end each
            });

        return pages;
    }; // end getByTag

    PageService.prototype.exists = function(url)
    {
        var deferred = $q.defer();

        $http.head(url)
            .success(function() { deferred.resolve(true); })
            .error(function() { deferred.resolve(false); });

        return deferred.promise;
    }; // end exists

    return new PageService();
} // end PageServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('PageService', [
    '$q',
    '$routeParams',
    '$location',
    '$cacheFactory',
    '$http',
    'PageResource',
    PageServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------