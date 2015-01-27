// ---------------------------------------------------------------------------------------------------------------------
// TitleService - a service for setting the page title.
//
// @module title_service.js
// ---------------------------------------------------------------------------------------------------------------------

function TitleServiceFactory($rootScope, $q, pageSvc)
{
    function TitleService(){}

    TitleService.prototype.set = function(setterFunc)
    {
        var pageDeferred = $q.defer();
        var pagePromise = pageDeferred.promise;
        var page = pageSvc.current;

        // Resolve the deferred
        pageDeferred.resolve(page);

        if(page)
        {
            pagePromise = page.promise;
        } // end if

        pagePromise
            .then(function(){ return page })
            .then(setterFunc)
            .then(function(title)
            {
                $rootScope.title = title;
            });
    }; // end set

    return new TitleService();
} // end TitleServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('TitleService', [
    '$rootScope',
    '$q',
    'PageService',
    TitleServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------