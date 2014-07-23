// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function TagsPageController($scope, $route, wikiPage)
{
    $scope.tags = {};
    $scope.singleTag = $route.current.params.tag;
    $scope.loaded = false;

    if($scope.singleTag)
    {
        wikiPage.getByTag($scope.singleTag).$promise.then(function(docs)
        {
            $scope.loaded = true;
            $scope.tags[$scope.singleTag] = docs
        });
    }
    else
    {
        wikiPage.getAllTags().$promise.then(function(tags)
        {
            tags.forEach(function(tag)
            {
                $scope.tags[tag] = wikiPage.getByTag(tag);
            });

            $scope.loaded = true;
        });
    } // end if
} // end TagsPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('TagsPageController', ['$scope', '$route', 'wikiPage', TagsPageController]);

// ---------------------------------------------------------------------------------------------------------------------
