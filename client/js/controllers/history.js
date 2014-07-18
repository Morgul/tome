// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki page history
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function PageHistoryController($scope, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath;

    wikiPage.getHistory($scope.wikiPath).$promise.then(function(revisions)
    {
        $scope.revisions = revisions;
        $scope.$root.title = "History for '" + $scope.wikiPath + "'";
    });
} // end PageHistoryController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('PageHistoryController', ['$scope', 'wikiPage', PageHistoryController]);

// ---------------------------------------------------------------------------------------------------------------------

