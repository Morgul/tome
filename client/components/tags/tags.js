// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function TagsPageController($scope, $routeParams, $http, pageSvc, titleSvc)
{
    $scope.tags = {};
    $scope.singleTag = $routeParams.tag;

    // Set the page title
    titleSvc.set(function()
    {
        return "All Tags";
    });

    if($scope.singleTag)
    {
        $scope.tags[$routeParams.tag] = pageSvc.getByTag($routeParams.tag);
        // Set the page title
        titleSvc.set(function()
        {
            return 'Pages tagged with "#' + $scope.singleTag + '"';
        });
    }
    else
    {
        $http.get('/tags')
            .success(function(tags)
            {
                tags.forEach(function(tag)
                {
                    $scope.tags[tag] = pageSvc.getByTag(tag);
                });
            });
    } // end if
} // end TagsPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('TagsPageController', [
    '$scope',
    '$routeParams',
    '$http',
    'PageService',
    'TitleService',
    TagsPageController
]);

// ---------------------------------------------------------------------------------------------------------------------
