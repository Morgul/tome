// ---------------------------------------------------------------------------------------------------------------------
// A controller for diffs
//
// @module diff.js
// ---------------------------------------------------------------------------------------------------------------------

function DiffController($scope, $route, $location, wikiPage)
{
    $scope.rev1 = $route.current.params.rev1;
    $scope.rev2 = $route.current.params.rev2;

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

    $scope.swap = function()
    {
        $location.path('/diff/' + $scope.rev2.id + '/' + $scope.rev1.id);
    }; // end swap
} // end DiffController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('DiffController', [
    '$scope',
    '$route',
    '$location',
    'PageService',
    DiffController
]);

// ---------------------------------------------------------------------------------------------------------------------
