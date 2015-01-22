// ---------------------------------------------------------------------------------------------------------------------
// A controller for searching
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function SearchPageController($scope, $route, wikiPage)
{
    $scope.loaded = false;
    $scope.query = $route.current.params.text;

    $scope.$root.title = 'Search for "' + $scope.query + '"';

    wikiPage.search($route.current.params.text).$promise.then(function(results)
    {
        $scope.results = results;
        $scope.loaded = true;
    });
} // end SearchPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('SearchPageController', [
    '$scope',
    '$route',
    'PageService',
    SearchPageController
]);

// ---------------------------------------------------------------------------------------------------------------------
