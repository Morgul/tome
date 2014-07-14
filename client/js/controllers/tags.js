// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function TagsPageController($scope, wikiPage)
{
    $scope.tags = {};

    wikiPage.getAllTags().$promise.then(function(tags)
    {
        tags.forEach(function(tag)
        {
            $scope.tags[tag] = wikiPage.getByTag(tag);
        });
    });
} // end TagsPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('TagsPageController', ['$scope', 'wikiPage', TagsPageController]);

// ---------------------------------------------------------------------------------------------------------------------
