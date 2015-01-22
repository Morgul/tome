// ---------------------------------------------------------------------------------------------------------------------
// A controller for editing wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function EditPageController($scope, $location)
{
    $scope.editorOptions = {
        lineWrapping : true,
        mode: 'gfm'
    };

    //TODO: Find a better way to handle this.
    $scope.$root.title = 'Editing ' + $scope.page.title;

    //------------------------------------------------------------------------------------------------------------------
    // Events
    //------------------------------------------------------------------------------------------------------------------

    $scope.$on('save', $scope.save);
    $scope.$on('revert', $scope.revert);
    $scope.$on('delete', $scope.delete);

    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.delete = function()
    {
        //TODO: Pop a modal form confirming the deletion!
        $scope.page.delete()
            .then(function()
            {
                $location.search({});
            });
    }; // end delete

    $scope.save = function()
    {
        $scope.page.save()
            .then(function()
            {
                $location.search({});
            });
    }; // end save

    $scope.revert = function()
    {
        $location.search({});
    }; // end revert

    /*
    $scope.wikiPath = pageSvc.wikiPath;
    $scope.preview = false;
    $scope.page = {};

    if(!$scope.wikiPath)
    {
        $location.path('/edit/welcome');
        return;
    } // end if


    pageSvc.get($scope.wikiPath).$promise.then(function(page)
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

        pageSvc.remove($scope.wikiPath).$promise.then(function()
        {
            $scope.page = undefined;
            $location.path('/wiki/' + $scope.wikiPath);
        });
    }; // end delete

    $scope.save = function()
    {
        pageSvc.set($scope.wikiPath, $scope.page).$promise.then(function()
        {
            $location.path('/wiki/' + $scope.wikiPath);
        });
    }; // end save

    $scope.revert = function()
    {
        $location.path('/wiki/' + $scope.wikiPath);
    }; // end revert

    */
} // end EditPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('EditPageController', [
    '$scope',
    '$location',
    '$timeout',
    EditPageController
]);

// ---------------------------------------------------------------------------------------------------------------------