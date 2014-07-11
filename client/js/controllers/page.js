// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiPageController($scope, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath || "welcome";

    $scope.page = wikiPage.get($scope.wikiPath);
    $scope.$root.title = $scope.page.title;

    $scope.markdown = "# Welcome\nThis is my nice, wonderful welcome page! Don't you just love it?";
} // end WikiPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('WikiPageController', ['$scope', 'wikiPage', WikiPageController]);

// ---------------------------------------------------------------------------------------------------------------------