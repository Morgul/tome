// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function TagsPageController($scope, $routeParams, $http, pageSvc)
{
    $scope.tags = {};
    $scope.singleTag = $routeParams.tag;

    $scope.$root.title = "Tags";

    if($scope.singleTag)
    {
        $scope.tags[$routeParams.tag] = pageSvc.getByTag($routeParams.tag);
        $scope.$root.title = "Pages tagged with #" + $scope.singleTag;
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
    TagsPageController
]);

// ---------------------------------------------------------------------------------------------------------------------
