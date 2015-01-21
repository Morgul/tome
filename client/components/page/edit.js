// ---------------------------------------------------------------------------------------------------------------------
// A controller for editing wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function EditPageController($scope, $location, $timeout, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath;
    $scope.preview = false;
    $scope.page = {};

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

        // Clear out existing commit, if any
        delete $scope.page.commit;

        // Set the page title
        $scope.$root.title = "Editing " +  $scope.page.title;
    });

    $scope.delete = function()
    {
        //TODO: Pop a modal form confirming the deletion!

        wikiPage.remove($scope.wikiPath).$promise.then(function()
        {
            $scope.page = undefined;
            $location.path('/wiki/' + $scope.wikiPath);
        });
    }; // end delete

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
    $scope.$on('delete', $scope.delete);
} // end EditPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('EditPageController', ['$scope', '$location', '$timeout', 'wikiPage', EditPageController]);

// ---------------------------------------------------------------------------------------------------------------------