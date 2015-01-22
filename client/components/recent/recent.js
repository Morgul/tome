// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function RecentPageController($scope, $http, $location, wikiPage)
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

    $scope.$root.title = "Recent Activity";

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

    $scope.profile = function(event, email)
    {
        event.stopPropagation();
        event.preventDefault();
        $location.path('/profile/' + email);
    }; // end profile

    $scope.diff = function(event, rev1, rev2)
    {
        event.stopPropagation();
        event.preventDefault();
        $location.path('/diff/' + rev1 + '/' + rev2);
    }; // end diff
} // end RecentPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('RecentPageController', [
    '$scope',
    '$http',
    '$location',
    'PageService',
    RecentPageController
]);

// ---------------------------------------------------------------------------------------------------------------------
