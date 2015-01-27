// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiPageController($scope, $route, $routeParams, pageSvc)
{
    $scope.wikiPath = pageSvc.wikiPath || "welcome";
    $scope.revision = $route.current.params.revision;

    $scope.page = pageSvc.get(null, $scope.revision);

    // Determine what sub page we should load.
    if($routeParams.edit)
    {
        $scope.subPage = '/components/page/edit.html';
    }
    else if($routeParams.history)
    {
        $scope.subPage = '/components/page/history.html';
    }
    else if($routeParams.comments)
    {
        $scope.subPage = '/components/page/comments.html';
    }
    else
    {
        $scope.subPage = '/components/page/display.html';
    } // end if

    //TODO: Find a better way to handle this
    $scope.$root.title = ($scope.page || {}).title;
} // end WikiPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('WikiPageController', [
    '$scope',
    '$route',
    '$routeParams',
    'PageService',
    WikiPageController
]);

// ---------------------------------------------------------------------------------------------------------------------
