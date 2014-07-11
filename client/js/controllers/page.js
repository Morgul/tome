// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiPageController($scope, $route, $resource)
{
    var Page = $resource('/api/:wikiPath');
    $scope.wikiPath = $route.current.params.wikiPath || "";

    $scope.page = Page.get({ wikiPath: $scope.wikiPath });

    $scope.markdown = "# Welcome\nThis is my nice, wonderful welcome page! Don't you just love it?";
} // end WikiPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('WikiPageController', ['$scope', '$route', '$resource', WikiPageController]);

// ---------------------------------------------------------------------------------------------------------------------