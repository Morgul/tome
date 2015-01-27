// ---------------------------------------------------------------------------------------------------------------------
// A controller for the recent activity page.
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function RecentPageController($scope, $http, $location, _, userSvc)
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

    getRecent();
    getComments();

    // -----------------------------------------------------------------------------------------------------------------
    // Watched
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$watch('limit', function()
    {
        getRecent();
        getComments();
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------------------------------------------------

    function getRecent()
    {
        $http.get('/recent', { params: { limit: $scope.limit } })
            .success(function(data)
            {
                $scope.revisions = _.reduce(data, function(results, revision)
                {
                    revision.created = new Date(revision.created);

                    results.push(revision);
                    return results;
                }, []);
            });
    } // end getRecent

    function getComments()
    {
        $http.get('/comments', { params: { limit: $scope.limit } })
            .success(function(data)
            {
                $scope.comments = _.reduce(data, function(results, comment)
                {
                    comment.created = new Date(comment.created);
                    comment.updated = new Date(comment.updated);

                    results.push(comment);
                    return results;
                }, []);
            });
    } // end getComments

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.getDisplay = function(email)
    {
        return userSvc.getDisplay(email);
    }; // end getDisplay

    $scope.getPageUrlByID = function(pageID)
    {
        //TODO: Need to figure out how to do this.
        return 'welcome';
    }; // end getPageUrlByID

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
        $location.path('/diff/' + rev1 + '...' + rev2);
    }; // end diff
} // end RecentPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('RecentPageController', [
    '$scope',
    '$http',
    '$location',
    'lodash',
    'UserService',
    RecentPageController
]);

// ---------------------------------------------------------------------------------------------------------------------
