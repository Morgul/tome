// ---------------------------------------------------------------------------------------------------------------------
// A controller for searching
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function SearchPageController($scope, $routeParams, $http, titleSvc)
{
    $scope.query = $routeParams.text;
    $scope.searching = true;

    // Set the page title
    titleSvc.set(function()
    {
        return 'Search for "' + $scope.query + '"';
    });

    $http.get('/search', { params: { body: $scope.query } })
        .success(function(data)
        {
            $scope.searching = false;
            $scope.results = data;
        });
} // end SearchPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('SearchPageController', [
    '$scope',
    '$routeParams',
    '$http',
    'TitleService',
    SearchPageController
]);

// ---------------------------------------------------------------------------------------------------------------------
