// ---------------------------------------------------------------------------------------------------------------------
// A controller for profile pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function ProfilePageController($scope, $http, $route, $location, authSvc)
{

    function getCommits() {
        var url = '/api/commit?user=' + $scope.user.email;
        url += $scope.bleh.limit ? "&limit=" + $scope.bleh.limit : "";

        $http.get(url)
            .success(function(commits)
            {
                $scope.commits = commits;
            });
    } // end getCommits

    $scope.email = $route.current.params.email;
    $scope.bleh = { limit: 25 };
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

    $scope.$watch('bleh.limit', function()
    {
        if($scope.user)
        {
            getCommits();
        } // end if
    });

    // Support `/profile` as a redirect to your profile, when signed in.
    if(!$scope.email && authSvc.user)
    {
        $location.path('/profile/' + authSvc.user.email)
    } // end if

    if($scope.email == (authSvc.user || {}).email)
    {
        $scope.editing = true;
        $scope.user = authSvc.user;
        $scope.$root.title = ($scope.user.display || $scope.user.email) + "'s Profile";

        // Get our commits
        getCommits();
    }
    else
    {
        $http.get('/api/user/' + $scope.email)
            .success(function(user)
            {
                $scope.user = user;
                $scope.$root.title = (user.display || user.email) + "'s Profile";

                // Get our commits
                getCommits();
            });
    } // end if

    $scope.save = function()
    {
        $http.put('/api/user/' + authSvc.user.email, $scope.user)
            .success(function(data)
            {
                $scope.displaySuccess = true;
            })
            .error(function(data, status)
            {
                console.error('failed:', data, status);
            });
    }; // end save

    $scope.dismiss = function()
    {
        $scope.displaySuccess = false;
    };
} // end ProfilePageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('ProfilePageController', ['$scope', '$http', '$route', '$location', 'AuthService', ProfilePageController]);

// ---------------------------------------------------------------------------------------------------------------------