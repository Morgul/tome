// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiPageController($scope, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath || "welcome";

    wikiPage.get($scope.wikiPath).$promise.then(function(page)
    {
        $scope.page = page;
        $scope.$root.title = $scope.page.title;
    });
} // end WikiPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('WikiPageController', ['$scope', 'wikiPage', WikiPageController]);

// ---------------------------------------------------------------------------------------------------------------------