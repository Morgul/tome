// ---------------------------------------------------------------------------------------------------------------------
// A controller for editing wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function EditPageController($scope, $location, wikiPage)
{
    $scope.editorOptions = {
        lineWrapping : true,
        mode: 'gfm'
    };

    $scope.wikiPath = wikiPage.wikiPath || "welcome";

    wikiPage.get($scope.wikiPath).$promise.then(function(page)
    {
        $scope.page = page;
        $scope.$root.title = "Editing " +  $scope.page.title;
    });

    $scope.save = function()
    {
        wikiPage.set($scope.wikiPath, $scope.page).$promise.then(function()
        {
            $location.path('/wiki/' + $scope.wikiPath);
        });
    }; // end save

    $scope.revert = function()
    {
        $location.path('/wiki/' + $scope.wikiPath);
    }; // end revert
} // end EditPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('EditPageController', ['$scope', '$location', 'wikiPage', EditPageController]);

// ---------------------------------------------------------------------------------------------------------------------