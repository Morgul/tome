// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiPageController($scope, $route, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath || "welcome";
    $scope.revision = $route.current.params.revision;
    $scope.loaded = false;

    if($scope.revision)
    {
        wikiPage.getRevision($scope.revision).$promise.then(function(page)
        {
            $scope.loaded = true;

            $scope.page = page.revision;
            $scope.$root.title = $scope.page.title;
        }, function(error)
        {
            $scope.loaded = true;
            $scope.error = error || {};

            if(error.status != 404)
            {
                console.error("Error loading revision:", error);
            } // end if
        });
    }
    else
    {
        wikiPage.get($scope.wikiPath).$promise.then(function(page)
        {
            $scope.loaded = true;
            $scope.page = page.revision;
            $scope.$root.title = $scope.page.title;
        }, function(error)
        {
            $scope.loaded = true;
            $scope.error = error || {};

            if(error.status != 404)
            {
                console.error("Error loading revision:", error);
            } // end if
        });
    } // end if
} // end WikiPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('WikiPageController', ['$scope', '$route', 'wikiPage', WikiPageController]);

// ---------------------------------------------------------------------------------------------------------------------
