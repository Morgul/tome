// ---------------------------------------------------------------------------------------------------------------------
// A controller for editing wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function EditPageController($scope, $location, _, titleSvc)
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

    $scope.mergeClass = function(tag)
    {
        if($scope.serverRev && _.contains($scope.serverRev.tags, tag))
        {
            if(_.contains($scope.origTags, tag))
            {
                return 'label-default';
            }
            else
            {
                return 'label-danger';
            } // end if
        }
        else if($scope.serverRev && _.contains($scope.page.tags, tag))
        {
            return 'label-success';
        }
        else
        {
            return 'label-default'
        } // end if
    }; // end mergeClass

    $scope.hasEqualTags = function()
    {
        return _.isEqual($scope.origTags, $scope.serverRev.tags);
    }; // end hasEqualTags

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
            })
            .catch(function(response)
            {
                if(response.status == 409)
                {
                    // Save this to the scope, so we can modify the UI.
                    $scope.serverRev = response.data;
                    $scope.origTags = $scope.page.tags;
                    $scope.page.tags = _.uniq($scope.page.tags.concat($scope.serverRev.tags));
                    $scope.mergeRefresh = !$scope.mergeRefresh;

                    // This should allow us to save our new revision.
                    $scope.page.revision.id = $scope.serverRev.id;
                } // end if
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
    'lodash',
    'TitleService',
    EditPageController
]);

// ---------------------------------------------------------------------------------------------------------------------