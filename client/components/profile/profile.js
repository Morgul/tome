// ---------------------------------------------------------------------------------------------------------------------
// A controller for profile pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function ProfilePageController($scope, $http, $routeParams, $location, authSvc, userSvc, titleSvc)
{
    $scope.email = $routeParams.email;
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

    Object.defineProperty($scope, 'isUserProfile', {
        get: function(){ return $scope.email == (authSvc.user || {}).email; }
    });

    // Support `/profile` as a redirect to your profile, when signed in.
    if(!$scope.email && authSvc.user)
    {
        $location.path('/profile/' + authSvc.user.email)
    } // end if

    // Get the user
    $scope.user = userSvc.get($scope.email);
    $scope.user.$promise
        .then(function(){
            // Set the page title
            titleSvc.set(function()
            {
                return $scope.user.nickname + "'s Profile";
            });
        });
    $scope.revisions = userSvc.getRevisions($scope.email, $scope.limit);

    // -----------------------------------------------------------------------------------------------------------------
    // Watches
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$watch('limit', function()
    {
        // Get the revisions
        $scope.revisions = userSvc.getRevisions($scope.email, $scope.limit);
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.getDisplay = function(email)
    {
        return userSvc.getDisplay(email);
    }; // end getDisplay

    $scope.edit = function()
    {
        $scope.editing = true;
    }; // end edit

    $scope.save = function()
    {
        $scope.editing = false;

        $http.put('/users/' + $scope.email, { bio: $scope.user.bio });
    }; // end save
} // end ProfilePageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('ProfilePageController', [
    '$scope',
    '$http',
    '$routeParams',
    '$location',
    'AuthService',
    'UserService',
    'TitleService',
    ProfilePageController
]);

// ---------------------------------------------------------------------------------------------------------------------