// ---------------------------------------------------------------------------------------------------------------------
// A controller for diffs
//
// @module diff.js
// ---------------------------------------------------------------------------------------------------------------------

function DiffController($scope, $http, $routeParams, $location, titleSvc)
{
    var revs = $routeParams.revisions.split('...');

    $http.get('/wiki?revision=' + revs[0])
        .success(function(data)
        {
            $scope.rev1 = data;
        });

    $http.get('/wiki?revision=' + revs[1])
        .success(function(data)
        {
            $scope.rev2 = data;
        });

    // Set the page title
    titleSvc.set(function()
    {
        return 'Diff: "' + revs[0] + '" and "' + revs[1] + '"';
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.swap = function()
    {
        $location.path('/diff/' + $scope.rev2.id + '...' + $scope.rev1.id);
    }; // end swap

    $scope.tagsEqual = function()
    {
        if($scope.rev1, $scope.rev2)
        {
            return _.isEqual($scope.rev1.tags, $scope.rev2.tags);
        } // end if

        return false;
    }; // end tagsEqual
} // end DiffController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('DiffController', [
    '$scope',
    '$http',
    '$routeParams',
    '$location',
    'TitleService',
    DiffController
]);

// ---------------------------------------------------------------------------------------------------------------------
