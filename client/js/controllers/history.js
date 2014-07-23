// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki page history
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function PageHistoryController($scope, $filter, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath;
    $scope.limit = 25;
    $scope.limits = [
        {
            text: "5",
            value: 5
        },
        {
            text: "10",
            value: 10
        },
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        },
        {
            text: "All",
            value: undefined
        }
    ]; // end limits

    $scope.$watch('limit', function()
    {
        wikiPage.getHistory($scope.wikiPath, $scope.limit).$promise.then(function(revisions)
        {
            $scope.revisions = $filter('orderBy')(revisions, '-commit.committed');
            $scope.$root.title = $scope.revisions[0].title + " History";
        });
    });
} // end PageHistoryController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('PageHistoryController', ['$scope', '$filter', 'wikiPage', PageHistoryController]);

// ---------------------------------------------------------------------------------------------------------------------

