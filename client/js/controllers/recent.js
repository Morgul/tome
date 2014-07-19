// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function RecentPageController($scope, wikiPage)
{
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
        wikiPage.recent($scope.limit || 25).$promise.then(function(revisions)
        {
            $scope.revisions = revisions;
        });
    });
} // end RecentPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('RecentPageController', ['$scope', 'wikiPage', RecentPageController]);

// ---------------------------------------------------------------------------------------------------------------------
