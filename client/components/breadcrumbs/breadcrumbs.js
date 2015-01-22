// ---------------------------------------------------------------------------------------------------------------------
// A sticky breadcrumbs implementation.
//
// @module breadcrumbs.js
// ---------------------------------------------------------------------------------------------------------------------

function BreadcrumbsController($scope, $location, wikiPage)
{
    $scope.isEdit = function()
    {
        re = new RegExp("^\/edit.*$");
        return re.test($location.path());
    };

    $scope.prefix = function()
    {
        var prefix = $location.path().split('/')[1];

        return prefix;
    }; // end prefix

    //------------------------------------------------------------------------------------------------------------------
    // Edit page functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.save = function()
    {
        $scope.$root.$broadcast('save');
    }; // end save

    $scope.revert = function()
    {
        $scope.$root.$broadcast('revert');
    }; // end revert

    //------------------------------------------------------------------------------------------------------------------
    // View page functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.edit = function()
    {
        $location.search({ edit: true });
    }; // end edit

    $scope.delete = function()
    {
        $scope.$root.$broadcast('delete');
    }; // end delete

    $scope.history = function()
    {
        $location.search({ history: true });
    }; // end history

    $scope.comment = function()
    {
        $scope.$root.$broadcast('comment');
    }; // end history

    $scope.comments = function()
    {
        $location.search({ comments: true });
    }; // end history

    //------------------------------------------------------------------------------------------------------------------
    // Breadcrumbs functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.breadcrumbs = function()
    {
        var wikiPath = wikiPage.wikiPath || "";
        var pathElems = wikiPath.split('/');
        if(pathElems.length < 2 && pathElems[0] == "")
        {
            pathElems = $location.path() == '/' ? ["welcome"] : [];
        } // end if
        return [""].concat(pathElems);
    }; // end breadcrumbs

    $scope.buildCrumbUrl = function($index)
    {
        var wikiPath = wikiPage.wikiPath || "";
        return wikiPath.split('/').slice(0, $index).join('/');
    }; // end buildCrumbUrl
} // end BreadcrumbsController

function StickyBreadcrumbsDirective($document)
{
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '/components/breadcrumbs/breadcrumbs.html',
        link: function(scope, elem, attrs)
        {
            scope.fixed = false;

            $document.on('scroll', function(event)
            {
                var child = elem.children()[0];
                elem.css('min-height', child.getBoundingClientRect().height + 'px');

                var elemRect = elem[0].getBoundingClientRect();
                scope.$apply(function()
                {
                    scope.fixed = elemRect.top <= 0;
                });
            });
        },
        controller: ['$scope', '$location', 'PageService', BreadcrumbsController],
        replace: true
    }
}

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('breadcrumbs', ['$document', StickyBreadcrumbsDirective]);

// ---------------------------------------------------------------------------------------------------------------------