// ---------------------------------------------------------------------------------------------------------------------
// A controller for diffs
//
// @module diff.js
// ---------------------------------------------------------------------------------------------------------------------

function DiffController($scope, $http, $routeParams, $location, pageSvc)
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

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.swap = function()
    {
        $location.path('/diff/' + $scope.rev2.id + '...' + $scope.rev1.id);
    }; // end swap


    /*
    wikiPage.getRevision($scope.rev1).$promise.then(function(revision)
    {
        $scope.rev1 = revision;
        if($scope.rev2.body)
        {
            $scope.diff = JsDiff.diffLines($scope.rev1.body, $scope.rev2.body);
        } // end if
    });

    wikiPage.getRevision($scope.rev2).$promise.then(function(revision)
    {
        $scope.rev2 = revision;
        if($scope.rev1.body)
        {
            $scope.diff = JsDiff.diffLines($scope.rev1.body, $scope.rev2.body);
        } // end if
    });

    */
} // end DiffController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('DiffController', [
    '$scope',
    '$http',
    '$routeParams',
    '$location',
    'PageService',
    DiffController
]);

// ---------------------------------------------------------------------------------------------------------------------
