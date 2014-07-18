// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiPageController($scope, $route, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath || "welcome";
    $scope.revision = $route.current.params.revision;

    if($scope.revision)
    {
        wikiPage.getRevision($scope.revision).$promise.then(function(page)
        {
            $scope.page = page;
            $scope.$root.title = $scope.page.title;
        });
    }
    else
    {
        wikiPage.get($scope.wikiPath).$promise.then(function(page)
        {
            $scope.page = page;
            $scope.$root.title = $scope.page.title;
        });
    } // end if
} // end WikiPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('WikiPageController', ['$scope', '$route', 'wikiPage', WikiPageController]);

// ---------------------------------------------------------------------------------------------------------------------
