// ---------------------------------------------------------------------------------------------------------------------
// A controller for searching
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function SearchPageController($scope, $route, wikiPage)
{
    $scope.query = $route.current.params.text;
    $scope.results = wikiPage.search($route.current.params.text);
} // end SearchPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('SearchPageController', ['$scope', '$route', 'wikiPage', SearchPageController]);

// ---------------------------------------------------------------------------------------------------------------------
