// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function TagsPageController($scope, $route, wikiPage)
{
    $scope.tags = {};
    $scope.singleTag = $route.current.params.tag;

    if($scope.singleTag)
    {
        $scope.tags[$scope.singleTag] = wikiPage.getByTag($scope.singleTag);
    }
    else
    {
        wikiPage.getAllTags().$promise.then(function(tags)
        {
            tags.forEach(function(tag)
            {
                $scope.tags[tag] = wikiPage.getByTag(tag);
            });
        });
    } // end if
} // end TagsPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('TagsPageController', ['$scope', '$route', 'wikiPage', TagsPageController]);

// ---------------------------------------------------------------------------------------------------------------------
