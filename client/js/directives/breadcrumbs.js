// ---------------------------------------------------------------------------------------------------------------------
// A sticky breadcrumbs implementation.
//
// @module breadcrumbs.js
// ---------------------------------------------------------------------------------------------------------------------

function BreadcrumbsController($scope, $location, wikiPage)
{
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
        templateUrl: '/partials/breadcrumbs.html',
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
        controller: ['$scope', '$location', 'wikiPage', BreadcrumbsController],
        replace: true
    }
}

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('breadcrumbs', ['$document', StickyBreadcrumbsDirective]);

// ---------------------------------------------------------------------------------------------------------------------