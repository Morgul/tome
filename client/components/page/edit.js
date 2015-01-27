// ---------------------------------------------------------------------------------------------------------------------
// A controller for editing wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function EditPageController($scope, $location, titleSvc)
{
    $scope.preview = false;
    $scope.editorOptions = {
        lineWrapping : true,
        mode: 'gfm'
    };

    if($scope.page.promise)
    {
        // Clear commit message
        $scope.page.promise
            .then(function()
            {
                $scope.page.message = undefined;

            });
    } // end if

    // Set the page title
    titleSvc.set(function(page)
    {
        return 'Editing ' + (page.title || page.url);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Events
    //------------------------------------------------------------------------------------------------------------------

    $scope.$on('save', function(){ $scope.save() });
    $scope.$on('revert', function(){ $scope.revert() });
    $scope.$on('delete', function(){ $scope.delete() });

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
} // end EditPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('EditPageController', [
    '$scope',
    '$location',
    'TitleService',
    EditPageController
]);

// ---------------------------------------------------------------------------------------------------------------------