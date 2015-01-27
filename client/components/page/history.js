// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki page history
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function PageHistoryController($scope, $location, userSvc)
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

    $scope.page.loadHistory();
    $scope.page.loadComments(false);

    //------------------------------------------------------------------------------------------------------------------
    // Watches
    //------------------------------------------------------------------------------------------------------------------

    $scope.$watch('limit', function()
    {
        $scope.page.loadHistory();
        $scope.page.loadComments(false);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.getUser = function(email)
    {
        if(email)
        {
            return userSvc.get(email);
        } // end if
    }; // end getUser

    // TODO: Turn this into a link
    $scope.profile = function(event, email)
    {
        event.stopPropagation();
        event.preventDefault();
        $location.path('/profile/' + email);
    }; // end profile

    // TODO: Turn this into a link
    $scope.diff = function(event, rev1, rev2)
    {
        event.stopPropagation();
        event.preventDefault();
        $location.path('/diff/' + rev1 + '...' + rev2);
    }; // end diff
} // end PageHistoryController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('PageHistoryController', [
    '$scope',
    '$location',
    'UserService',
    PageHistoryController
]);

// ---------------------------------------------------------------------------------------------------------------------

