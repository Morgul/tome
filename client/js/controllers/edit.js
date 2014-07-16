// ---------------------------------------------------------------------------------------------------------------------
// A controller for editing wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function EditPageController($scope, $location, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath;

    if(!$scope.wikiPath)
    {
        $location.path('/edit/welcome');
        return;
    } // end if

    $scope.editorOptions = {
        lineWrapping : true,
        mode: 'gfm'
    };

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

    $scope.$on('save', $scope.save);
    $scope.$on('revert', $scope.revert);
} // end EditPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('EditPageController', ['$scope', '$location', 'wikiPage', EditPageController]);

// ---------------------------------------------------------------------------------------------------------------------