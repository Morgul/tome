// ---------------------------------------------------------------------------------------------------------------------
// A controller for editing wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function EditPageController($scope, $location)
{
    $scope.preview = false;
    $scope.editorOptions = {
        lineWrapping : true,
        mode: 'gfm'
    };

    // Clear commit message
    $scope.page.message = "";

    //TODO: Find a better way to handle this.
    $scope.$root.title = 'Editing ' + ($scope.page.title || $scope.wikiPath);

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
    '$timeout',
    EditPageController
]);

// ---------------------------------------------------------------------------------------------------------------------