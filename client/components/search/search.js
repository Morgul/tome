// ---------------------------------------------------------------------------------------------------------------------
// A controller for searching
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function SearchPageController($scope, $routeParams, $http)
{
    $scope.query = $routeParams.text;

    $scope.$root.title = 'Search for "' + $scope.query + '"';

    $http.get('/search', { params: { body: $scope.query } })
        .success(function(data)
        {
            $scope.results = data;
        });
} // end SearchPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('SearchPageController', [
    '$scope',
    '$routeParams',
    '$http',
    SearchPageController
]);

// ---------------------------------------------------------------------------------------------------------------------
