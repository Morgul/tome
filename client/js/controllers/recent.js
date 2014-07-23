// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function RecentPageController($scope, $http, $filter, wikiPage)
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
        wikiPage.recent($scope.limit).$promise.then(function(revisions)
        {
            $scope.revisions = revisions;
        });

        var url = '/api/comment';
        url += $scope.limit ? '?limit=' + $scope.limit : '';

        $http.get(url).success(function(comments)
        {
            $scope.comments = comments;
        });
    });
} // end RecentPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('RecentPageController', ['$scope', '$http', '$filter', 'wikiPage', RecentPageController]);

// ---------------------------------------------------------------------------------------------------------------------
